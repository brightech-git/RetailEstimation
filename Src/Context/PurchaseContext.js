import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import { PurchaseService } from "../Src-1/Service/PurchaseService";
import { calcWastage, calcNetWt, calcAmount, effectiveAmount } from "../Src-1/Hook/UsePurchase";

const PurchaseContext = createContext(null);

// Map a purchase row to the API payload shape.
// Fields present in the row are filled; everything else defaults to empty/0.
export const buildPurchasePayload = (row) => ({
  tagno:        row.tagno        || null,
  itemid:       Number(row.itemId) || 0,
  subitemid:    Number(row.subItemId) || 0,
  pcs:          Number(row.pcs) || 0,
  grswt:        Number(row.grswt) || 0,
  netwt:        calcNetWt(row) || 0,
  lesswt:       Number(row.dustwt) || 0,
  remark1:      row.description   || null,
  userid:      999       || null,
  dustwt:      row.dustwt      || null,
  rate:         Number(row.rate) || 0,
  boardrate:    Number(row.boardrate || row.rate) || 0,
  amount:       effectiveAmount(row) || 0,
  mcharge:      Number(row.mcharge) || 0,
  mcgrm:        Number(row.mcgrm) || 0,
  wastage:      calcWastage(row) || 0,
  wastper:      Number(row.wPercent) || 0,
  flag:         Array.isArray(row.ownership)
                  ? row.ownership.includes("OWN") ? "W" : "O"
                  : null,
  make:         Array.isArray(row.ownership)
                  ? row.ownership.includes("OWN") ? "W" : "O"
                  : null,
  empid:        Number(row.emp) || 0,
  catcode:      row.categoryCode || "",
  ocatcode:     null,
  accode:       row.accode       || "",
  systemid:     "8",
  transtatus:   row.transtatus   || "P",
  status:       row.status       || "A",
  appver:       "APP",
  taggrswt:     Number(row.grswt) || 0,
  tagnetwt:     calcNetWt(row) || 0,
  weightunit:   row.weightunit   || "G",
  stoneunit:    row.stoneunit    || "C",
  protype:      Number(row.protype) || 1,
  metalid:      row.metalId      || "G",
  itemtypeid:   Number(row.itemTypeId) || 0,
  purity:       Number(row.purity) || 0,
  tablecode:    row.tablecode    || "",
  vatexm:       row.vatexm       || "N",
  stktype:      row.stktype      || "N",
  purexch:      Array.isArray(row.ownership)
                  ? row.ownership.includes("EXCHANGE") ? "E" : "P"
                  : null,
});

export const PurchaseProvider = ({ children }) => {
  const [savedRows, setSavedRows] = useState([]);
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [purchaseTranno, setPurchaseTranno] = useState(null);
  const [purchaseEstBatchNo, setPurchaseEstBatchNo] = useState(null);

  const savePurchaseRows = (rows) => setSavedRows(rows);
  const removePurchaseRow = (idx) => setSavedRows((prev) => prev.filter((_, i) => i !== idx));
  const clearPurchaseRows = () => {
    setSavedRows([]);
  };
  const clearPurchaseAll = () => {
    setSavedRows([]);
    setPurchaseTranno(null);
    setPurchaseEstBatchNo(null);
  };

  const submitPurchase = async () => {
    if (!savedRows.length) return null;
    if (!apiBaseUrl) {
      Alert.alert("Error", "API base URL not set");
      return null;
    }
    setSubmitting(true);
    try {
      const payload = savedRows.map(buildPurchasePayload);
      console.log("📦 Purchase payload:", JSON.stringify(payload, null, 2));
      const first = await new PurchaseService(apiBaseUrl).saveReceipt(payload);
      const tranno = first?.tranno || null;
      const estbatchno = first?.estbatchno || null;
      if (tranno) setPurchaseTranno(tranno);
      if (estbatchno) setPurchaseEstBatchNo(estbatchno);
      clearPurchaseRows();
      return tranno;
    } catch (e) {
      console.error("[PurchaseContext] submitPurchase failed:", e);
      console.error("[PurchaseContext] response data:", JSON.stringify(e?.response?.data, null, 2));
      console.error("[PurchaseContext] response status:", e?.response?.status);
      Alert.alert("Error", e?.response?.data?.message || "Failed to save purchase");
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  // The Home screen submits sales and purchase together through
  // /estissue-receipt. This only records the returned purchase slip details.
  const completeCombinedPurchase = ({ receiptTranno, tranno, batchNo }) => {
    setPurchaseTranno(receiptTranno || tranno || null);
    setPurchaseEstBatchNo(batchNo || null);
    clearPurchaseRows();
  };

  return (
    <PurchaseContext.Provider
      value={{ savedRows, savePurchaseRows, removePurchaseRow, clearPurchaseRows, clearPurchaseAll, submitPurchase, completeCombinedPurchase, submitting, setApiBaseUrl, purchaseTranno, purchaseEstBatchNo }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchaseContext = () => useContext(PurchaseContext);
