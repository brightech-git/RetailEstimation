import { useState, useRef, useEffect, useContext } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginContext } from "../../Context/LoginContext";

import {
  EstimationService,
  formatDateToSqlDateTime,
  formatDateToMidnightSql,
  parseValue,
  calculateGrossAmount,
  calculateGST,
  calculateGrandTotal,
} from "../Service/EstimationService";

export const useEstimation = (apiBaseUrl) => {
  const [ITEMID, setITEMID] = useState("");
  const [TAGNO, setTAGNO] = useState("");
  const [emp, setEmp] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [showList, setShowList] = useState(false);
  const [tranno, setTranno] = useState(null);
  const [estBatchNo, setEstBatchNo] = useState(null);
  const [scanningField, setScanningField] = useState(null);
  const [scannerVisible, setScannerVisible] = useState(false);

  const {
    username,
    userId,
    companyId: loggedInCompanyId,
    companyName,
  } = useContext(LoginContext);
  const [service, setService] = useState(null);

  const itemIdInputRef = useRef(null);
  const tagInputRef = useRef(null);
  const empInputRef = useRef(null);

  const removeRow = (index) => {
    setTableData((prev) => prev.filter((_, i) => i !== index));
  };

  // Expose the logged-in user's currently selected cost ID (from
  // AsyncStorage, kept in sync by LoginContext) so screens can build
  // costId-scoped requests without re-implementing storage access.
  const getCostId = async () => {
    if (service) return service.getCostId();
    try {
      return (await AsyncStorage.getItem("SELECTED_COST_ID")) || "";
    } catch (e) {
      console.warn("Failed to read SELECTED_COST_ID:", e);
      return "";
    }
  };

  const clearAll = () => {
    setTableData([]);
    setTranno(null);
    setEstBatchNo(null);
  };

  useEffect(() => {
    itemIdInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (apiBaseUrl) {
      setService(new EstimationService(apiBaseUrl));
    }
  }, [apiBaseUrl]);

  const handleScanned = (field, data) => {
    if (data.includes("-")) {
      const [item, tag] = data.split("-");
      setITEMID(item);
      setTAGNO(tag);
      empInputRef.current?.focus();
    } else {
      if (field === "itemid") {
        setITEMID(data);
        tagInputRef.current?.focus();
      } else if (field === "tagno") {
        setTAGNO(data);
        empInputRef.current?.focus();
      }
    }
  };

  const fetchItemList = async () => {
    if (!service) return;

    try {
      const data = await service.fetchItemList();
      setItemList(data);
      setShowList(true);
    } catch (error) {
      Alert.alert("Failed to load ITEM IDs", error.message || "Unknown error");
    }
  };

  const fetchData = async () => {
    if (!service) return;

    if (!ITEMID.trim() || !TAGNO.trim() || !emp.trim()) {
      Alert.alert(
        "Missing Input",
        "Please enter valid Item ID, Tag No, and Employee."
      );
      return;
    }

    const itemIdInt = parseInt(ITEMID, 10);
    if (isNaN(itemIdInt)) {
      Alert.alert("Invalid Item ID", "Item ID must be a number.");
      return;
    }

    setLoading(true);

    try {
      // Check if tag already exists
      const tagDetails = await service.checkTagExists(ITEMID, TAGNO);
      if (tagDetails && tagDetails.trandate) {
        console.log(
          "Tag already issued on:",
          tagDetails,
          "Trn No:",
          tagDetails.tranno
        );
        Alert.alert(
          "Tag Already Issued",
          `Issued on ${tagDetails.trandate}, Trn No: ${tagDetails.tranno}`
        );
        return;
      }

      // Check for duplicates in current table
      const alreadyExists = tableData.some(
        (row) =>
          row.ITEMID === itemIdInt && row.TAGNO === TAGNO && row.EMPID === emp
      );

      if (alreadyExists) {
        Alert.alert(
          "Duplicate Entry",
          "This Tag is already loaded in the Sales Grid."
        );
        return;
      }

      const data = await service.fetchEstimationData(ITEMID, TAGNO);
      console.log("Estimation Total Data:", data);

      if (!Array.isArray(data) || data.length === 0) {
        Alert.alert("No data found.");
        return;
      }

      // /estimationTotal doesn't return COSTID/COMPANYID on the row, so
      // firstItem.COSTID is always empty - the real source of truth is
      // the cost centre the user picked at login (SELECTED_COST_ID).
      const firstItem = data[0];
      const costId = firstItem.COSTID || (await service.getCostId()) || "";
      const companyId = firstItem.COMPANYID || loggedInCompanyId || "";

      const newData = data.map((d) => ({
        ...d,
        ITEMID: itemIdInt,
        TAGNO,
        EMPID: emp,
        EMP: emp,
        METALID: d.METALID || 0,
        COSTID: costId,
        COMPANYID: companyId,
        MAXMCGRM: d.MAXMCGRM || 0,
        MC_FROM_API: d.MC || 0,
        GrossAmount: d.GrossAmount || "0",
        GSTAmount: d.GSTAmount || "0",
        GrandTotal: d.GrandTotal || "0",
      }));

      setTableData((prev) => [...prev, ...newData]);

      // Reset form and focus
      setITEMID("");
      setTAGNO("");
      setEmp("");
      itemIdInputRef.current?.focus();
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData(); // your API calling logic
    console.log("Refreshed");
  };

  const submitData = async (overrideData) => {
    const data = overrideData || tableData;
    console.log("Submitting data:", data);

    if (data.length === 0) {
      Alert.alert("No data", "Please add items before submitting.");
      return null;
    }

    try {
      setLoading(true);

      // Get transaction number
      const TRANNO = await service.getTransactionNumber();
      console.log("TRANNO Response:", TRANNO);
      if (!TRANNO) throw new Error("Failed to get TRANNO");

      // Get COSTID and COMPANYID from the first item, falling back to the
      // logged-in user's selected cost centre / company - some callers
      // (e.g. Homescreen1's raw API data) never had COSTID/COMPANYID on
      // the row to begin with, since /estimationTotal doesn't return them.
      const firstItem = data[0];
      const costId = firstItem.COSTID || (await service.getCostId()) || "";
      const companyId = firstItem.COMPANYID || loggedInCompanyId || "";

      // Get estimation batch number
      const batchNo = await service.getEstimationBatchNo(costId, companyId);
      if (!batchNo) {
        Alert.alert("Error", "Could not retrieve ESTBATCHNO");
        return null;
      }

      // Enrich items with additional data
      const enrichedData = await Promise.all(
        data.map(async (item) => {
          console.log(
            `Fetching stone inputs for ITEMID=${item.ITEMID} TAGNO=${item.TAGNO}`
          );

          // Fetch stone inputs
          let stoneInputs = await service.getStoneInputs(
            item.ITEMID,
            item.TAGNO,
            item.COSTID || costId
          );

          // Fetch stone category codes
          for (const stn of stoneInputs) {
            if (!stn?.stnitemid) continue;
            stn.catcode = await service.getStoneCategoryCode(
              item.ITEMID,
              stn.stnitemid,
              item.COSTID || costId
            );
          }

          // Fetch tag details
          const tagDetails = await service.getTagDetails(
            item.TAGNO,
            item.COSTID || costId
          );

          // Get transaction date
          let trandateString = formatDateToSqlDateTime();
          const dateFromApi = await service.getTransactionDate(
            item.ITEMID,
            item.TAGNO
          );
          if (dateFromApi) {
            trandateString = formatDateToSqlDateTime(dateFromApi);
          }

          // Build item payload
          const rawItem = {
            TRANNO,
            TRANDATE: formatDateToMidnightSql(item.trandate),
            TRANTYPE: "SA",
            PCS: parseFloat(item.PCS) || 0,
            GRSWT: parseFloat(item.GRSWT) || 0,
            NETWT: parseFloat(item.NETWT) || 0,
            PUREWT: parseFloat(item.PUREWT || item.NETWT) || 0,
            TAGNO: item.TAGNO || "",
            ITEMID: item.ITEMID || 0,
            WASTPER: tagDetails?.wastper,
            WASTAGE: parseFloat(item.Wastage) || 0,
            MCGRM:
              parseFloat(item.MAXMCGRM) ||
              parseFloat(item.MC_FROM_API) ||
              parseFloat(tagDetails?.mcgram) ||
              0,
            MCHARGE: parseFloat(item.MC_FROM_API) || tagDetails?.mcharge || 0,
            AMOUNT: parseFloat(calculateGrossAmount(item).toFixed(2)) || 0,
            RATE:
              item.SALEMODE === "R"
                ? parseFloat(item.RATE) || 0
                : parseFloat(item.Rate) || 0,
            BOARDRATE: parseFloat(item.Rate) || 0,
            COSTID: item.COSTID || costId,
            COMPANYID: item.COMPANYID || companyId,
            EMPID: Number(item.EMP) || 0,
            STNAMT: parseFloat(item.StoneAmount) || 0,
            MISCAMT: parseFloat(item.MiscAmount) || 0,
            LESSWT: tagDetails?.lesswt,
            SUBITEMID: tagDetails?.subitemid,
            SALEMODE: tagDetails?.salemode,
            GRSNET: tagDetails?.grsnet,
            TAGDESIGNER: tagDetails?.designerid,
            ITEMTYPEID: tagDetails?.itemtypeid,
            ITEMCTRID: tagDetails?.itemctrid,
            PURITY: tagDetails?.purity,
            TAGSVALUE: tagDetails?.salvalue,
            TRANSTATUS: "",
            REFNO: "",
            REFDATE: null,
            FLAG: "",
            TAGGRSWT: parseFloat(item.GRSWT) || 0,
            TAGNETWT: parseFloat(item.NETWT) || 0,
            TAGRATEID: 0.0,
            TABLECODE: "",
            INCENTIVE: "",
            WEIGHTUNIT: "",
            CATCODE: item.CATCODE || 0,
            OCATCODE: "",
            ACCODE: "",
            ALLOY: "0.000",
            BATCHNO: "",
            REMARK1: "",
            REMARK2: "",
            USERID: 999,
            UPDATED: formatDateToMidnightSql(item.updated),
            UPTIME: "",
            SYSTEMID: "",
            DISCOUNT: "0.00",
            RUNNO: "",
            CANCEL: "",
            CASHID: "",
            VATEXM: "",
            ORSNO: "",
            ORDERNO: "",
            STONEUNIT: null,
            PROTYPE: "0",
            METALID: item.METALID || "0",
            TAX: parseFloat(calculateGST(item).toFixed(2)) || 0,
            SC: "0.00",
            ADSC: "0.00",
            APPVER: "",
            PSNO: "",
            DISCEMPID: "",
            MARGINID: "0",
            OTHERAMT: "",
            RATEID: 0.0,
            ESTBATCHNO: batchNo,
            OESTBATCHNO: null,
            SETGRPID: "",
            STATUS: "",
            DUEDATE: formatDateToMidnightSql(item.duedate),
            TOUCH: "0.00",
            STKTYPE: "",
            BARPREFIX: "",
            HSN: null,
          };

          return [rawItem, stoneInputs];
        })
      );

      const rawItems = enrichedData.map(([item]) =>
        Object.fromEntries(
          Object.entries(item).filter(([_, v]) => v !== undefined && v !== null)
        )
      );

      console.log(
        "📤 Payload to /estissue:",
        JSON.stringify(rawItems, null, 2)
      );

      // Submit main estimation data
      const savedIssues = await service.submitEstimationData(rawItems);
      console.log("📦 Saved issues received:", savedIssues);

      if (!Array.isArray(savedIssues)) {
        throw new Error(
          "❌ Invalid EstIssue response: expected an array but got " +
            JSON.stringify(savedIssues)
        );
      }

      // Create mapping for SNOs
      const snoMap = {};
      savedIssues.forEach((issue) => {
        snoMap[issue.TAGNO || issue.tagno] = issue.SNO || issue.sno;
      });

      const tagToRawItemMap = {};
      enrichedData.forEach(([rawItem]) => {
        const tag = rawItem?.TAGNO;
        if (tag) {
          tagToRawItemMap[tag.toString().trim()] = rawItem;
        } else {
          console.warn("❗ rawItem is missing TAGNO:", rawItem);
        }
      });

      // Submit stone data
      const allStonePayloads = [];
      for (const [item, stoneInputs] of enrichedData) {
        const tagno = item.TAGNO;
        const estSNO = snoMap[tagno];
        const generatedSNO = await service.generateEstissStoneSno(
          item.COSTID || costId,
          item.COMPANYID || companyId
        );

        if (!Array.isArray(stoneInputs) || stoneInputs.length === 0) continue;

        const stonePayloads = stoneInputs.map((stone) => ({
          sno: generatedSNO,
          isssno: estSNO,
          ismsno: "",
          tranno: TRANNO,
          TRANDATE: formatDateToMidnightSql(item.TRANDATE),
          trantype: "SA",
          stnpcs: stone.stnpcs || 0,
          stnwt: stone.stnwt || 0,
          stnrate: stone.stnrate || 0,
          stnamt: stone.stnamt || 0,
          stnitemid: stone.stnitemid || 0,
          stnsubitemid: stone.stnsubitemid || 0,
          calcmode: stone.calcmode || "",
          stoneunit: stone.stoneunit || "",
          stonemode: "",
          transtatus: "",
          costid: stone.costid || item.COSTID || costId,
          companyid: stone.companyid || item.COMPANYID || companyId,
          batchno: "",
          systemid: "",
          vatexm: "",
          catcode: stone.catcode || "",
          protype: "",
          ocatcode: "",
          tax: 0,
          sc: 0,
          adsc: 0,
          appver: "",
          discount: 0.0,
          tagstnpcs: 0,
          tagstnwt: 0,
          tagsno: stone.tagsno || "",
          estbatchno: batchNo || "",
          cutid: 0,
          colorid: 0,
          clarityid: 0,
          settypeid: 0,
          shapeid: 0,
          height: 0,
          width: 0,
        }));

        allStonePayloads.push(...stonePayloads);
      }

      if (allStonePayloads.length > 0) {
        await service.submitStoneData(allStonePayloads);
      }

      // Submit tax data
      for (const tagno in snoMap) {
        const estSNO = snoMap[tagno];
        const rawItem = tagToRawItemMap[tagno.toString().trim()];

        if (!rawItem) {
          console.warn(`❌ rawItem not found for TAGNO=${tagno}`);
          continue;
        }

        const amount = parseFloat(rawItem.AMOUNT) || 0;
        if (amount <= 0) {
          console.warn(
            `⛔ Skipping tax entry for TAGNO=${tagno} because amount is 0`
          );
          continue;
        }

        const estTaxTranSno = await service.generateEstTaxTranSno(
          rawItem.COSTID || costId,
          rawItem.COMPANYID || companyId
        );
        console.log("✅ Generated ESTTAXTRAN SNO:", estTaxTranSno);

        const taxDetails = await service.getTaxDetails(rawItem.ITEMID);
        console.log(`✅ Tax details for ITEMID=${rawItem.ITEMID}:`, taxDetails);

        const basePayload = {
          sno: estTaxTranSno,
          isssno: String(estSNO),
          tranno: Number(TRANNO),
          trandate: formatDateToMidnightSql(rawItem.TRANDATE),
          trantype: "SA",
          batchno: String(batchNo),
          amount: parseFloat(amount.toFixed(2)),
          taxtype: null,
          costid: String(rawItem.COSTID || costId),
          companyid: String(rawItem.COMPANYID || companyId),
          studded: null,
        };

        const generateTaxEntries = (payload, sgst = 1.5, cgst = 1.5) => {
          const amt = payload.amount;
          return [
            {
              ...payload,
              taxid: "SG",
              taxper: sgst,
              taxamount: parseFloat(((amt * sgst) / 100).toFixed(2)),
              tsno: 1,
            },
            {
              ...payload,
              taxid: "CG",
              taxper: cgst,
              taxamount: parseFloat(((amt * cgst) / 100).toFixed(2)),
              tsno: 2,
            },
          ];
        };

        const taxEntries = generateTaxEntries(basePayload);

        try {
          for (const entry of taxEntries) {
            console.log(
              "📤 Posting tax entry:",
              JSON.stringify(entry, null, 2)
            );
            await service.submitTaxData(entry);
          }
          console.log(
            "✅ SGST and CGST entries inserted for TAGNO:",
            rawItem.TAGNO
          );
        } catch (err) {
          console.warn(
            "❌ Failed to insert SGST/CGST tax entries:",
            err.response?.data || err.message
          );
          Alert.alert(
            "Warning",
            `Tax insert failed for TAGNO: ${rawItem.TAGNO}`
          );
        }
      }

      // Update transaction number
      try {
        await service.updateTransactionNumber();
      } catch (err) {
        Alert.alert(
          "Partial Success",
          "Data submitted, but TRANNO update failed."
        );
      }

      // Get final details for printing
      const [ipAddress, estDetails, rateResponse] = await Promise.all([
        service.getIPAddress(),
        service.getEstimationDetails(TRANNO, costId),
        service.getTodayRates(),
      ]);

      let rawBillDate = estDetails?.billDate;
      let billDate =
        !rawBillDate || isNaN(Date.parse(rawBillDate))
          ? new Date().toISOString().replace("T", " ").slice(0, 19)
          : new Date(rawBillDate).toISOString().replace("T", " ").slice(0, 19);

      // Submit print data
      const estPrintPayload = {
        brefno: TRANNO,
        billdate: billDate,
        goldrate: rateResponse?.GOLDRATE || 0,
        silverrate: rateResponse?.SILVERRATE || 0,
        billtype: estDetails?.bill_type || "",
        instrument: "X",
        sysipaddress: ipAddress,
        estbatchno: batchNo,
      };

      await service.submitPrintData(estPrintPayload);

      Alert.alert("Success", `Sales Estimation No: ${TRANNO} Generated`);
      setTranno(TRANNO);
      setEstBatchNo(batchNo);
      setTableData([]);

      return batchNo;
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.message ||
          "Something went wrong."
      );
      console.error("Submitting error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalGross = tableData.reduce(
    (acc, row) => acc + calculateGrossAmount(row),
    0
  );
  const totalGST = tableData.reduce((acc, row) => acc + calculateGST(row), 0);
  const totalGrand = tableData.reduce(
    (acc, row) => acc + calculateGrandTotal(row),
    0
  );

  return {
    // State
    ITEMID,
    TAGNO,
    emp,
    tableData,
    loading,
    itemList,
    showList,
    tranno,
    estBatchNo,
    scanningField,
    scannerVisible,

    // Refs
    itemIdInputRef,
    tagInputRef,
    empInputRef,

    // Setters
    setITEMID,
    setTAGNO,
    setEmp,
    setTableData,
    setLoading,
    setItemList,
    setShowList,
    setTranno,
    setEstBatchNo,
    setScanningField,
    setScannerVisible,

    // Functions
    handleScanned,
    fetchItemList,
    fetchData,
    handleRefresh,
    submitData,
    removeRow,
    clearAll,
    getCostId,

    // Calculations
    totalGross,
    totalGST,
    totalGrand,
    calculateGrossAmount,
    calculateGST,
    calculateGrandTotal,
  };
};
