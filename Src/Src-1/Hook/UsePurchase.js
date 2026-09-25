import { useState, useMemo, useCallback } from "react";

// Builds a fresh, empty purchase-grid row. `categoryInfo` carries the
// selection made in the CategorySelectModal (category/categoryCode/item/
// itemId/subItem/itemType/ownership/description) — categoryCode and
// itemId are the CATCODE/ITEMID values the /category-search API returns,
// kept alongside the display labels for when the row is submitted.
const createEmptyRow = (categoryInfo) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  category: categoryInfo?.category || "",
  categoryCode: categoryInfo?.categoryCode || "",
  item: categoryInfo?.item || "",
  itemId: categoryInfo?.itemId || "",
  subItemId: categoryInfo?.subItemId || "",
  itemType: categoryInfo?.itemType || "",
  itemTypeId: categoryInfo?.itemTypeId || "",
  metalId: categoryInfo?.metalId || "",
  ownership: categoryInfo?.ownership || "",
  description: categoryInfo?.description || "",
  purity: categoryInfo?.purity || "",
  pcs: "",
  grswt: "",
  dustwt: "",
  wPercent: "",
  wastage: "",
  stnwt: "",
  rate: categoryInfo?.prate || "",
  boardrate: categoryInfo?.prate || "",
  gst: "",
  emp: "",
});

const toNum = (val) => {
  const n = parseFloat(val);
  return Number.isFinite(n) ? n : 0;
};

// Wastage = (Grswt - DustWt) * W% / 100
export const calcWastage = (row) => {
  const base = toNum(row.grswt) - toNum(row.dustwt);
  return (base * toNum(row.wPercent)) / 100;
};

// NetWt = (Grswt - DustWt) - Wastage - StnWt
export const calcNetWt = (row) => {
  const base = toNum(row.grswt) - toNum(row.dustwt);
  const wastage = calcWastage(row);
  return base - wastage - toNum(row.stnwt);
};

// Amount = NetWt * Rate, plus GST if provided (GST left blank/manual by
// default, per the sample data where GST has no value).
export const calcAmount = (row) => {
  const netWt = calcNetWt(row);
  const base = netWt * toNum(row.rate);
  const gstAmount = toNum(row.gst) ? base * (toNum(row.gst) / 100) : 0;
  return base + gstAmount;
};

export const usePurchase = () => {
  const [rows, setRows] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  // Id of the row whose first editable input (Purity) the screen should
  // auto-focus next — set right after the category modal closes for a
  // brand-new row. The screen clears it once it has acted on it.
  const [focusRowId, setFocusRowId] = useState(null);

  // Opens the category modal for a brand-new row.
  const openNewRowModal = useCallback(() => {
    setEditingRowId(null);
    setModalVisible(true);
  }, []);

  // Opens the category modal to edit an existing row's category fields.
  const openEditRowModal = useCallback((rowId) => {
    setEditingRowId(rowId);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingRowId(null);
  }, []);

  // Called when the modal's Done/Next button is pressed.
  const handleCategoryDone = useCallback(
    (categoryInfo) => {
      setRows((prev) => {
        if (editingRowId) {
          return prev.map((row) =>
            row.id === editingRowId ? { ...row, ...categoryInfo } : row
          );
        }
        const newRow = createEmptyRow(categoryInfo);
        setFocusRowId(newRow.id);
        return [...prev, newRow];
      });
      setModalVisible(false);
      setEditingRowId(null);
    },
    [editingRowId]
  );

  // The screen calls this right after it focuses (or attempts to focus)
  // the row's first input, so the same row doesn't get re-focused on
  // every re-render.
  const clearFocusRowId = useCallback(() => {
    setFocusRowId(null);
  }, []);

  const updateRowField = useCallback((rowId, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
    );
  }, []);

  const removeRow = useCallback((rowId) => {
    setRows((prev) => prev.filter((row) => row.id !== rowId));
  }, []);

  const clearAll = useCallback(() => {
    setRows([]);
  }, []);

  const editingRow = useMemo(
    () => rows.find((row) => row.id === editingRowId) || null,
    [rows, editingRowId]
  );

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.pcs += toNum(row.pcs);
        acc.grswt += toNum(row.grswt);
        acc.dustwt += toNum(row.dustwt);
        acc.wastage += calcWastage(row);
        acc.stnwt += toNum(row.stnwt);
        acc.netwt += calcNetWt(row);
        acc.amount += calcAmount(row);
        return acc;
      },
      {
        pcs: 0,
        grswt: 0,
        dustwt: 0,
        wastage: 0,
        stnwt: 0,
        netwt: 0,
        amount: 0,
      }
    );
  }, [rows]);

  return {
    rows,
    modalVisible,
    editingRow,
    focusRowId,
    clearFocusRowId,
    openNewRowModal,
    openEditRowModal,
    closeModal,
    handleCategoryDone,
    updateRowField,
    removeRow,
    clearAll,
    totals,
    calcWastage,
    calcNetWt,
    calcAmount,
  };
};

export default usePurchase;
