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
    companyData,
    costOptions,
    selectedCostId,
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
      if (tagDetails && tagDetails.status !== "not issued" && tagDetails.trandate) {
        console.log("Tag already issued on:", tagDetails, "Trn No:", tagDetails.tranno);
        Alert.alert(
          "Tag Already Issued",
          `Issued on ${tagDetails.trandate}, Trn No: ${tagDetails.tranno}`
        );
        return;
      }
      // status === "not issued" → proceed to fetch estimation data

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

      const newData = await Promise.all(data.map(async (d) => {
        const offer = await service.getOffer(TAGNO);
        const discount = (offer.netwt || 0) * (offer.board_rate || 0);
        return {
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
          DISCOUNT: discount,
          BOARD_RATE: offer.board_rate || 0,
        };
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

  // Per-row: gross after discount (taxable base)
  const calculateDiscountedGross = (row) => {
    const gross = calculateGrossAmount(row);
    const discount = parseFloat(row.DISCOUNT) || 0;
    return gross - discount;
  };

  // Per-row: GST on discounted gross
  const calculateDiscountedGST = (row) => {
    const taxable = calculateDiscountedGross(row);
    let gstPer = parseFloat(row.GSTPer);
    if (isNaN(gstPer)) gstPer = 3; // 1.5% CGST + 1.5% SGST
    return (taxable * gstPer) / 100;
  };

  // Per-row: grand total on discounted gross
  const calculateDiscountedGrandTotal = (row) =>
    calculateDiscountedGross(row) + calculateDiscountedGST(row);

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
      console.log("[TRANNO] Response:", TRANNO);
      if (!TRANNO) throw new Error("Failed to get TRANNO");

      // Get COSTID and COMPANYID from the first item, falling back to the
      // logged-in user's selected cost centre / company - some callers
      // (e.g. Homescreen1's raw API data) never had COSTID/COMPANYID on
      // the row to begin with, since /estimationTotal doesn't return them.
      const firstItem = data[0];
      const costId = firstItem.COSTID || (await service.getCostId()) || "";

      // Resolve the string company code (e.g. "SFH") — used everywhere,
      // including /estissue companyid. loggedInCompanyId is a numeric ID.
      const companyCode =
        costOptions?.find((o) => o.COSTID === costId)?.COMPANYID ||
        companyData?.COMPANYCODE ||
        companyData?.COMPANYID ||
        "";
      console.log("[EstBatchNo] Payload:", { costId, companyId: companyCode });
      const batchNo = await service.getEstimationBatchNo(costId, companyCode);
      console.log("[EstBatchNo] Response:", batchNo);
      if (!batchNo) {
        Alert.alert("Error", "Could not retrieve ESTBATCHNO");
        return null;
      }

      // Fetch today's rates before building payloads
      const todayRates = await service.getTodayRates();
      console.log("[TodayRates] Response:", todayRates);

      // Enrich items with additional data
      const enrichedData = await Promise.all(
        data.map(async (item) => {
          console.log(
            `Fetching stone inputs for ITEMID=${item.ITEMID} TAGNO=${item.TAGNO}`
          );

          // Fetch stone inputs
          console.log("[StoneInputs] Payload:", { ITEMID: item.ITEMID, TAGNO: item.TAGNO, costId: item.COSTID || costId });
          let stoneInputs = await service.getStoneInputs(item.ITEMID, item.TAGNO);
          console.log("[StoneInputs] Response:", stoneInputs);

          // Fetch stone category codes
          for (const stn of stoneInputs) {
            if (!stn?.stnitemid) continue;
            stn.catcode = await service.getStoneCategoryCode(item.ITEMID, stn.stnitemid);
          }

          // Fetch tag details
          console.log("[TagDetails] Payload:", { TAGNO: item.TAGNO, costId: item.COSTID || costId });
          const tagDetails = await service.getTagDetails(item.TAGNO);
          console.log("[TagDetails] Response:", tagDetails);

          // Fetch offer for this item
          console.log("[Offer] Payload:", { tagno: item.TAGNO });
          const offerData = await service.getOffer(item.TAGNO);
          console.log("[Offer] Response:", offerData);

          console.log("[TaxDetails] Payload:", { itemid: item.ITEMID });
          const itemTaxDetails = await service.getTaxDetails(item.ITEMID);
          console.log("[TaxDetails] Response:", itemTaxDetails);

          // Get transaction date
          let trandateString = formatDateToSqlDateTime();
          console.log("[TranDate] Payload:", { ITEMID: item.ITEMID, TAGNO: item.TAGNO });
          const dateFromApi = await service.getTransactionDate(
            item.ITEMID,
            item.TAGNO
          );
          console.log("[TranDate] Response:", dateFromApi);
          if (dateFromApi) {
            trandateString = formatDateToSqlDateTime(dateFromApi);
          }

          // Build item payload
          const rawItem = {
            tranno: TRANNO,
            TRANDATE: formatDateToMidnightSql(item.trandate),
            trantype: "SA",
            pcs: parseFloat(item.PCS) || 0,
            grswt: parseFloat(item.GRSWT) || 0,
            netwt: parseFloat(item.NETWT) || 0,
            purewt: parseFloat(item.PUREWT || item.NETWT) || 0,
            tagno: item.TAGNO || "",
            itemid: item.ITEMID || 0,
            wastper: tagDetails?.wastper,
            wastage: tagDetails?.wastage || 0,
            mcgrm:
              parseFloat(tagDetails?.mcgram) ||
              0,
            mcharge: tagDetails?.mccharge || 0,
            amount: parseFloat((calculateGrossAmount(item) - (parseFloat(item.DISCOUNT) || 0)).toFixed(2)) || 0,
            rate: parseFloat(offerData?.board_rate) || parseFloat(item.BOARD_RATE) || 0,
            boardrate: parseFloat(offerData?.board_rate) || parseFloat(item.BOARD_RATE) ||  0,
            costid: item.COSTID || costId,
            companyid: companyCode,
            empid: Number(item.EMP) || 0,
            stnamt: parseFloat(item.StoneAmount) || 0,
            miscamt: parseFloat(item.MiscAmount) || 0,
            lesswt: tagDetails?.lesswt,
            subitemid: tagDetails?.subitemid,
            salemode: tagDetails?.salemode,
            grsnet: tagDetails?.grsnet,
            tagdesigner: tagDetails?.designerid,
            itemtypeid: tagDetails?.itemtypeid,
            itemctrid: tagDetails?.itemctrid,
            purity: tagDetails?.purity,
            tagsvalue: tagDetails?.salvalue,
            transtatus: "",
            refno: "",
            refdate: "1900-01-01 00:00:00",
            flag: "",
            taggrswt: parseFloat(item.GRSWT) || 0,
            tagnetwt: parseFloat(item.NETWT) || 0,
            tagrateid: 0,
            tablecode: "",
            incentive: "",
            weightunit: "",
            catcode: itemTaxDetails?.CATCODE ? String(itemTaxDetails.CATCODE) : (item.CATCODE ? String(item.CATCODE) : ""),
            ocatcode: "",
            accode: "",
            alloy: "0.000",
            batchno: "",
            remark1: "",
            remark2: "",
            userid: String(userId || "1"),
            updated: formatDateToMidnightSql(new Date()),
            uptime: "",
            systemid: "",
            discount: parseFloat((parseFloat(item.DISCOUNT) || 0).toFixed(2)),
            runno: "",
            cancel: "",
            cashid: "",
            vatexm: "",
            orsno: "",
            orderno: "",
            stoneunit: "",
            protype: "0",
            metalid: item.METALID ? String(item.METALID) : "G",
            tax: parseFloat(calculateDiscountedGST(item).toFixed(2)) || 0,
            sc: "0.00",
            adsc: "0.00",
            appver: "",
            psno: "",
            discempid: "",
            marginid: "0",
            otheramt: "",
            rateid: "0.00",
            estbatchno: batchNo,
            oestbatchno: null,
            setgrpid: "",
            status: "",
            duedate: formatDateToMidnightSql(item.duedate),
            touch: "0.00",
            stktype: "",
            barprefix: "",
            hsn: null,
          };

          return [rawItem, stoneInputs];
        })
      );

      const rawItems = enrichedData.map(([item]) => item);

      console.log(
        "📤 Payload to /estissue:",
        JSON.stringify(rawItems, null, 2)
      );

      // Submit main estimation data
      const savedIssues = await service.submitEstimationData(rawItems);
      console.log("[EstIssue] Response:", savedIssues);

      if (!Array.isArray(savedIssues)) {
        throw new Error(
          "❌ Invalid EstIssue response: expected an array but got " +
            JSON.stringify(savedIssues)
        );
      }

      // Create mapping for SNOs
      const snoMap = {};
      savedIssues.forEach((issue) => {
        snoMap[issue.tagno || issue.TAGNO] = issue.sno || issue.SNO;
      });

      const tagToRawItemMap = {};
      enrichedData.forEach(([rawItem]) => {
        const tag = rawItem?.tagno;
        if (tag) {
          tagToRawItemMap[tag.toString().trim()] = rawItem;
        } else {
          console.warn("❗ rawItem is missing tagno:", rawItem);
        }
      });

      // Submit stone data
      const allStonePayloads = [];
      for (const [item, stoneInputs] of enrichedData) {
        const tagno = item.tagno;
        const estSNO = snoMap[tagno];
        const generatedSNO = await service.generateEstissStoneSno(
          item.costid || costId,
          item.companyid || companyCode
        );

        if (!Array.isArray(stoneInputs) || stoneInputs.length === 0) continue;

        console.log("[EstIssStoneSno] Payload:", { costId: item.costid || costId, companyId: item.companyid || companyCode });
        console.log("[EstIssStoneSno] Response:", generatedSNO);

        const stonePayloads = stoneInputs.map((stone) => ({
          sno: generatedSNO,
          isssno: estSNO,
          ismsno: "",
          tranno: TRANNO,
          TRANDATE: formatDateToMidnightSql(item.TRANDATE || item.trandate),
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
          costid: stone.costid || item.costid || costId,
          companyid: stone.companyid || item.companyid || companyCode,
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
        console.log("[StoneData] Payload:", allStonePayloads);
        const stoneResponse = await service.submitStoneData(allStonePayloads);
        console.log("[StoneData] Response:", stoneResponse);
      }

      // Submit tax data
      for (const tagno in snoMap) {
        const estSNO = snoMap[tagno];
        const rawItem = tagToRawItemMap[tagno.toString().trim()];

        if (!rawItem) {
          console.warn(`❌ rawItem not found for TAGNO=${tagno}`);
          continue;
        }

        const amount = parseFloat(rawItem.amount) || 0;
        if (amount <= 0) {
          console.warn(
            `⛔ Skipping tax entry for tagno=${tagno} because amount is 0`
          );
          continue;
        }

        console.log("[EstTaxTranSno] Payload:", { costId: rawItem.costid || costId, companyId: rawItem.companyid || companyCode });
        const estTaxTranSno = await service.generateEstTaxTranSno(
          rawItem.costid || costId,
          rawItem.companyid || companyCode
        );
        console.log("[EstTaxTranSno] Response:", estTaxTranSno);

        console.log("[TaxDetails] Payload:", { itemid: rawItem.itemid });
        const taxDetails = await service.getTaxDetails(rawItem.itemid);
        console.log("[TaxDetails] Response:", taxDetails);

        const basePayload = {
          sno: estTaxTranSno,
          isssno: String(estSNO),
          tranno: Number(TRANNO),
          trandate: formatDateToMidnightSql(rawItem.TRANDATE),
          trantype: "SA",
          batchno: String(batchNo),
          amount: parseFloat(amount.toFixed(2)),
          taxtype: null,
          costid: String(rawItem.costid || costId),
          companyid: String(rawItem.companyid || companyCode),
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
            console.log("[TaxData] Payload:", entry);
            const taxResponse = await service.submitTaxData(entry);
            console.log("[TaxData] Response:", taxResponse);
          }
        } catch (err) {
          console.warn(
            "❌ Failed to insert SGST/CGST tax entries:",
            err.response?.data || err.message
          );
          Alert.alert(
            "Warning",
            `Tax insert failed for tagno: ${rawItem.tagno}`
          );
        }
      }

      // Update transaction number
      try {
        const updateTrannoRes = await service.updateTransactionNumber();
        console.log("[UpdateTranno] Response:", updateTrannoRes);
      } catch (err) {
        Alert.alert(
          "Partial Success",
          "Data submitted, but TRANNO update failed."
        );
      }

      // Get final details for printing
      console.log("[EstDetails] Payload:", { TRANNO, costId });
      const [ipAddress, estDetails] = await Promise.all([
        service.getIPAddress(),
        service.getEstimationDetails(TRANNO),
      ]);
      console.log("[IPAddress] Response:", ipAddress);
      console.log("[EstDetails] Response:", estDetails);

      let rawBillDate = estDetails?.billDate;
      let billDate =
        !rawBillDate || isNaN(Date.parse(rawBillDate))
          ? new Date().toISOString().replace("T", " ").slice(0, 19)
          : new Date(rawBillDate).toISOString().replace("T", " ").slice(0, 19);

      // Submit print data
      const estPrintPayload = {
        brefno: TRANNO,
        billdate: billDate,
        goldrate: todayRates?.GOLDRATE || 0,
        silverrate: todayRates?.SILVERRATE || 0,
        billtype: estDetails?.bill_type || "",
        instrument: "X",
        sysipaddress: ipAddress,
        estbatchno: batchNo,
      };

      console.log("[PrintData] Payload:", estPrintPayload);
      const printResponse = await service.submitPrintData(estPrintPayload);
      console.log("[PrintData] Response:", printResponse);

      Alert.alert("Success", `Sales Estimation No: ${TRANNO} Generated`);
      setTranno(TRANNO);
      setEstBatchNo(batchNo);
      setTableData([]);

      return batchNo;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Something went wrong.";
      console.error("Submitting error details:", {
        status: error.response?.status,
        url: error.config?.url,
        params: error.config?.params,
        requestData: error.config?.data,
        responseData: error.response?.data,
      });
      Alert.alert("Error", typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Totals
  const totalDiscount = tableData.reduce(
    (acc, row) => acc + (parseFloat(row.DISCOUNT) || 0),
    0
  );
  const totalGross = tableData.reduce(
    (acc, row) => acc + calculateDiscountedGross(row),
    0
  );
  const totalGST = tableData.reduce(
    (acc, row) => acc + calculateDiscountedGST(row),
    0
  );
  const totalGrand = totalGross + totalGST;

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
    totalDiscount,
    totalGrand,
    calculateGrossAmount,
    calculateGST,
    calculateGrandTotal,
    calculateDiscountedGross,
    calculateDiscountedGST,
    calculateDiscountedGrandTotal,
  };
};
