import { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import { SalesReturnService } from "../Service/SalesReturnService";
import {
  calcDiscountedGross,
  calcGST,
  calcGrandTotal,
  calcTotals,
} from "../../shared/EstimationCalculations";

// /salereturn-detail row → the table row shape the shared estimation
// calculations use (GrossAmount is taken as-is from grossAmt).
const mapReturnDetailToRow = (d) => ({
  ...d,
  ITEMID: d.itemId,
  TAGNO: d.tagNo,
  PCS: d.pcs,
  GRSWT: d.grswt,
  NETWT: d.netwt,
  RATE: d.rate,
  Rate: d.rate,
  WASTAGE: d.wastage,
  Wastage: d.wastage,
  MC: d.mc ?? 0,
  StoneAmount: d.stnAmt ?? 0,
  MiscAmount: d.miscAmt ?? 0,
  GrossAmount: d.grossAmt ?? 0,
  DISCOUNT: d.discount ?? 0,
  BOARD_RATE: d.boardRate,
  EMPID: d.empId,
  EMP: d.empId,
  SUBITEMID: d.subItemId,
  ITEMCTRID: d.itemCtrId,
  SNO: d.sno,
  TRANNO: d.tranNo,
  BATCHNO: d.batchNo,
});

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

// Sales Return screen state: the bill reference popup, the bill list,
// the loaded return rows and their totals. Picking a bill is compulsory
// while the grid is empty — `onExit` is called when the user cancels the
// reference popup with nothing loaded.
export const useSalesReturn = (apiBaseUrl, { onExit } = {}) => {
  const service = useMemo(() => new SalesReturnService(apiBaseUrl), [apiBaseUrl]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // { useDate, billDate, billDateApi, billNo } from ReturnRefModal
  const [returnRef, setReturnRef] = useState(null);
  const [refModalVisible, setRefModalVisible] = useState(true);

  const [bills, setBills] = useState([]);
  const [billsModalVisible, setBillsModalVisible] = useState(false);

  const hasData = rows.length > 0;
  const { totalGross, totalGST, totalGrand } = calcTotals(rows);

  // Grid emptied (first open, Clear All, last row deleted, failed load) →
  // ask for a bill again.
  useEffect(() => {
    if (!hasData && !refModalVisible && !billsModalVisible && !loading) {
      setRefModalVisible(true);
    }
  }, [hasData, refModalVisible, billsModalVisible, loading]);

  // Load one bill's items into the grid. Returns true on success.
  const loadBillDetail = async (billNo, billDateApi) => {
    setLoading(true);
    try {
      const data = await service.getBillDetail(billNo, billDateApi);
      if (data.length === 0) {
        Alert.alert("No Data", `No items found for Bill No ${billNo}.`);
        return false;
      }
      setRows(data.map(mapReturnDetailToRow));
      setReturnRef((prev) => ({ ...prev, billNo: String(billNo) }));
      return true;
    } catch (error) {
      Alert.alert("Error", errorMessage(error, "Failed to load bill."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Date only → list that day's bills to pick from.
  const loadBillsForDate = async (billDateApi) => {
    setLoading(true);
    try {
      setBills(await service.getBills(billDateApi));
      setBillsModalVisible(true);
    } catch (error) {
      Alert.alert("Error", errorMessage(error, "Failed to load bills."));
    } finally {
      setLoading(false);
    }
  };

  const handleRefDone = (selection) => {
    setReturnRef(selection);
    setRefModalVisible(false);
    if (selection.billNo) loadBillDetail(selection.billNo, selection.billDateApi);
    else loadBillsForDate(selection.billDateApi);
  };

  const handleRefClose = () => {
    // Nothing loaded yet → leave the screen instead of showing an empty grid.
    if (hasData) setRefModalVisible(false);
    else onExit?.();
  };

  // The list stays open until the bill loads, so a failed load leaves the
  // user on the list to pick another one.
  const handleBillSelect = async (bill) => {
    if (loading) return;
    const ok = await loadBillDetail(bill.billNo, returnRef?.billDateApi);
    if (ok) setBillsModalVisible(false);
  };

  const handleBillsClose = () => {
    setBillsModalVisible(false);
    // Nothing loaded yet → back to the date / bill no popup.
    if (!hasData) setRefModalVisible(true);
  };

  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setRows([]);
    setReturnRef(null);
  };

  return {
    rows,
    hasData,
    loading,
    returnRef,
    bills,
    refModalVisible,
    billsModalVisible,
    openRefModal: () => setRefModalVisible(true),
    handleRefDone,
    handleRefClose,
    handleBillSelect,
    handleBillsClose,
    removeRow,
    clearAll,
    calcRowGross: calcDiscountedGross,
    calcRowGST: calcGST,
    calcRowTotal: calcGrandTotal,
    totalGross,
    totalGST,
    totalGrand,
  };
};
