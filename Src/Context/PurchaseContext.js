import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import createApiInstance from "../Api/axiosInstance";
import ENDPOINTS from "../Api/endpoints";
import { calcWastage, calcNetWt, calcAmount } from "../Src-1/Hook/UsePurchase";

const PurchaseContext = createContext(null);

// Map a purchase row to the API payload shape.
// Fields present in the row are filled; everything else defaults to empty/0.
const buildPayload = (row) => ({
  tagno:        row.tagno        || null,
  itemid:       row.itemId       || null,
  subitemid:    row.subItemId    || null,
  pcs:          row.pcs          || null,
  grswt:        row.grswt        || null,
  netwt:        calcNetWt(row)   || null,
  lesswt:       ""     || null,
  remark1:      row.description   || null,
  userid:      999       || null,
  dustwt:      row.dustwt      || null,
  rate:         row.rate         || null,
  boardrate:    row.boardrate    || null,
  amount:       calcAmount(row)  || null,
  mcharge:      row.mcharge      || null,
  mcgrm:        row.mcgrm        || null,
  wastage:      calcWastage(row) || null,
  wastper:      row.wPercent     || null,
  flag:         Array.isArray(row.ownership)
                  ? row.ownership.includes("OWN") ? "W" : "O"
                  : null,
  make:         Array.isArray(row.ownership)
                  ? row.ownership.includes("OWN") ? "W" : "O"
                  : null,
  empid:        row.emp          || null,
  catcode:      row.categoryCode || null,
  ocatcode:     null,
  accode:       row.accode       || null,
  systemid:     "8",
  transtatus:   null,
  status:       row.status       || null,
  appver:       "APP",
  taggrswt:     null,
  tagnetwt:     null,
  weightunit:   row.weightunit   || null,
  stoneunit:    row.stoneunit    || null,
  protype:      row.protype      || null,
  metalid:      row.metalId      || null,
  itemtypeid:   row.itemTypeId   || null,
  purity:       row.purity       || null,
  tablecode:    row.tablecode    || null,
  vatexm:       row.vatexm       || null,
  stktype:      row.stktype      || null,
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
      const api = createApiInstance(apiBaseUrl);
      const payload = savedRows.map(buildPayload);
      console.log("📦 Purchase payload:", JSON.stringify(payload, null, 2));
      const response = await api.post(`${ENDPOINTS.EST_RECEIPT}?costId=`, payload);
      console.log("✅ Purchase response:", JSON.stringify(response?.data, null, 2));
      const first = Array.isArray(response?.data) ? response.data[0] : response?.data;
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

  return (
    <PurchaseContext.Provider
      value={{ savedRows, savePurchaseRows, removePurchaseRow, clearPurchaseRows, clearPurchaseAll, submitPurchase, submitting, setApiBaseUrl, purchaseTranno, purchaseEstBatchNo }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchaseContext = () => useContext(PurchaseContext);
