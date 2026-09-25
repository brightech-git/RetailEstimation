import { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginContext } from "../../Context/LoginContext";
import { useEstimation } from "./UseEstimation";
import useTagLookup from "./useTagLookup";
import {
  printEstimationSlip,
  useEstimationPreview,
} from "../Components/PrintReceipt/PrintSlip";

// Split "ITEMID-TAGNO" → { itemId, tagNo }, or { error } when malformed.
const parseCombinedInput = (input) => {
  const parts = input.trim().split("-");
  if (parts.length !== 2) return { error: "Invalid format. Use: ITEMID-TAGNO" };

  const itemId = parts[0].trim();
  const tagNo = parts[1].trim();
  if (!itemId || !tagNo) return { error: "Both ITEMID and TAGNO are required" };

  return { itemId, tagNo };
};

// Quick Estimate: one Fetch (or scan) of "ITEMID-TAGNO" looks the tag up,
// submits it as an estimation and prints the slip straight to the current
// printer — no preview. Print Slip reprints the last slip the same way.
export const useQuickEstimate = (apiBaseUrl) => {
  const { username } = useContext(LoginContext);
  const estimation = useEstimation(apiBaseUrl);
  const { loading: loadingApiData, lookupTag } = useTagLookup(apiBaseUrl);

  const [displayData, setDisplayData] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [combinedInput, setCombinedInput] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preparingPrint, setPreparingPrint] = useState(false);

  const estimationPreview = useEstimationPreview(employeeId, { autoPrint: true });

  // Employee picked on the cost-centre screen
  useEffect(() => {
    AsyncStorage.getItem("EMPLOYEE_ID")
      .then((empId) => {
        if (empId) setEmployeeId(empId);
      })
      .catch((error) => console.error("Error fetching employee ID:", error));
  }, []);

  // Submit rows as an estimation; returns the ESTBATCHNO or null.
  const submitRows = async (rowsToSubmit) => {
    setIsSubmitting(true);
    try {
      // submitData saves empid from each row's EMP
      const rows = rowsToSubmit.map((row) => ({
        ...row,
        EMP: row.EMP || employeeId,
        EMPID: row.EMPID || employeeId,
      }));
      const result = await estimation.submitData(rows);
      const batchNo = result?.batchNo ?? result ?? null;
      if (batchNo) estimation.setEstBatchNo(batchNo);
      return batchNo;
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Submission Failed", error.message || "Unable to submit data");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load the slip and hand it to the auto-printing preview hook.
  const printSlip = async (batchNo) => {
    setPreparingPrint(true);
    try {
      await printEstimationSlip(batchNo, username, apiBaseUrl);
    } catch (err) {
      Alert.alert("Print Failed", err.message || "Unable to generate slip");
    } finally {
      setPreparingPrint(false);
    }
  };

  // Fetch → submit → print. `inputOverride` lets a scan use the scanned
  // value directly instead of waiting for combinedInput state to update.
  const fetchApiData = async (inputOverride) => {
    const input = typeof inputOverride === "string" ? inputOverride : combinedInput;
    if (!input || busy) return;

    const parsed = parseCombinedInput(input);
    if (parsed.error) {
      setValidationError(parsed.error);
      return;
    }
    setValidationError("");

    const { itemId, tagNo } = parsed;
    setDisplayData([]);
    estimation.setEstBatchNo(null);

    const rows = await lookupTag(itemId, tagNo);
    if (!rows || rows.length === 0) return;

    setDisplayData(rows);
    estimation.setITEMID(itemId);
    estimation.setTAGNO(tagNo);

    const batchNo = await submitRows(rows);
    if (!batchNo) return;

    setCombinedInput("");
    await printSlip(batchNo);
  };

  const handleInputChange = (text) => {
    setCombinedInput(text);
    setValidationError("");
  };

  const openScanner = () => {
    estimation.setScanningField("combined");
    estimation.setScannerVisible(true);
  };

  const closeScanner = () => estimation.setScannerVisible(false);

  // BarcodeScannerModal calls onScanned(field, data)
  const handleScanned = (_field, data) => {
    setValidationError("");
    setCombinedInput(data);
    estimation.setScannerVisible(false);
    fetchApiData(data);
  };

  // Reprint the last slip
  const handlePrint = async () => {
    if (!estimation.estBatchNo) {
      Alert.alert("No slip available", "Fetch a tag first to generate a slip");
      return;
    }
    await printSlip(estimation.estBatchNo);
  };

  const submitting = isSubmitting || estimation.loading;
  const printing = preparingPrint || estimationPreview.autoPrinting;
  const busy = loadingApiData || submitting || printing;

  // What the Fetch button is doing right now
  const status = loadingApiData
    ? "Fetching..."
    : submitting
      ? "Saving..."
      : printing
        ? "Printing..."
        : "";

  return {
    employeeId,
    combinedInput,
    validationError,
    displayData,
    busy,
    status,
    canPrint: !!estimation.estBatchNo && !busy,
    EstimationPreviewComponent: estimationPreview.EstimationPreviewComponent,
    scannerVisible: estimation.scannerVisible,
    scanningField: estimation.scanningField,
    handleInputChange,
    fetchApiData,
    openScanner,
    closeScanner,
    handleScanned,
    handlePrint,
  };
};
