import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Footer from "../../../Components/Footer/Footer";
import CommonHeader from "../../../Components/Header/CommonHeader";
import { useTheme } from "../../../Context/ThemeContext";
import { createPurchaseStyles } from "./PurchaseStyles";
import { usePurchase } from "../../Hook/UsePurchase";
import CategorySelectModal from "../../Components/Purchase/CategorySelectModal/CategorySelectModal";
import { usePurchaseContext } from "../../../Context/PurchaseContext";
import { useApiBaseUrl } from "../../../Config/Config";
import { EmployeeService } from "../../Service/EmployeeService";
import QuickEstimateHeader from "../../Components/Header/PurchaseHeader";

const COLUMN_LABELS = [
  "Category",
  "Purity",
  "Pcs",
  "Grswt",
  "DustWt",
  "Wast %",
  "Wastage",
  "Stn wt",
  "Net WT",
  "Rate",
  "GST",
  "Amount",
  "Emp",
];

// Order the Tab/Next key should move focus through for each row. Wastage,
// Net WT are read-only (auto-calculated) so they're skipped.
// Amount is now editable. Emp is last.
const FOCUS_FIELDS = [
  "purity",
  "pcs",
  "grswt",
  "dustwt",
  "wPercent",
  "rate",
  "amount",
  "emp",
];

export default function PurchaseScreen() {
  const { theme } = useTheme();
  const styles = createPurchaseStyles(theme);
  const API_BASE_URL = useApiBaseUrl();

  const purchase = usePurchase();
  const navigation = useNavigation();
  const { savePurchaseRows, clearPurchaseRows } = usePurchaseContext();

  // Clear any previously saved rows when entering this screen,
  // so Home only shows rows after an explicit Save — same as sales.
  useEffect(() => {
    clearPurchaseRows();
  }, []);

  // Map of "<rowId>-<field>" -> TextInput ref, so "next" on the keyboard
  // can jump straight to the next field in FOCUS_FIELDS order.
  const inputRefs = useRef({});

  const setInputRef = (rowId, field) => (node) => {
    const key = `${rowId}-${field}`;
    if (node) {
      inputRefs.current[key] = node;
    } else {
      delete inputRefs.current[key];
    }
  };

  const focusField = (rowId, field) => {
    const ref = inputRefs.current[`${rowId}-${field}`];
    ref?.focus?.();
  };

  const validateRow = (row) => {
    const missing = [];
    if (!row?.purity) missing.push("Purity");
    if (!row?.grswt) missing.push("Grswt");
    if (!row?.rate) missing.push("Rate");
    // Emp ID is compulsory per row and must be loaded (Enter on Emp)
    if (!row?.emp || !row?.empVerified)
      missing.push("Emp ID (press Enter to load)");
    return missing;
  };

  const handleEmpChange = (rowId, value) => {
    purchase.updateRowField(rowId, "emp", value);
    purchase.updateRowField(rowId, "empVerified", false);
    purchase.updateRowField(rowId, "empName", "");
  };

  // Look up the row's typed Emp ID; on success mark it loaded and return
  // the updated row, otherwise alert and return null.
  const loadRowEmployee = async (row) => {
    const empId = String(row?.emp || "").trim();
    if (!empId) {
      Alert.alert("Missing Employee", "Please enter Emp ID.");
      return null;
    }
    if (isNaN(Number(empId))) {
      Alert.alert("Invalid Employee ID", "Employee ID must be a number.");
      return null;
    }
    try {
      const found = await new EmployeeService(API_BASE_URL).getEmployeeById(
        empId,
      );
      if (!found) {
        Alert.alert("Not Found", `No employee found with ID ${empId}.`);
        return null;
      }
      const emp = String(found.empId);
      purchase.updateRowField(row.id, "emp", emp);
      purchase.updateRowField(row.id, "empVerified", true);
      purchase.updateRowField(row.id, "empName", found.empName || "");
      return { ...row, emp, empVerified: true, empName: found.empName || "" };
    } catch (error) {
      Alert.alert("Failed to load employee", error.message || "Unknown error");
      return null;
    }
  };

  const handleSubmitEditing = async (rowId, field) => {
    const idx = FOCUS_FIELDS.indexOf(field);
    const nextField = FOCUS_FIELDS[idx + 1];
    if (nextField) {
      focusField(rowId, nextField);
      return;
    }
    let row = purchase.rows.find((r) => r.id === rowId);
    if (field === "emp") {
      row = await loadRowEmployee(row);
      if (!row) {
        focusField(rowId, "emp");
        return;
      }
    }
    const missing = validateRow(row);
    if (missing.length > 0) {
      Alert.alert("Required Fields", `Please fill: ${missing.join(", ")}`);
      return;
    }
    purchase.openNewRowModal();
  };

  // After the category modal closes for a brand-new row, auto-focus that
  // row's first input (Purity) so the user can start typing immediately.
  useEffect(() => {
    if (!purchase.focusRowId) return;
    const rowId = purchase.focusRowId;
    const timer = setTimeout(() => {
      focusField(rowId, FOCUS_FIELDS[0]);
      purchase.clearFocusRowId();
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchase.focusRowId]);

  return (
    <>
      <QuickEstimateHeader />
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* Category trigger row — tapping opens the selection modal for a new row */}
          <View style={styles.inputRow}>
            <View style={styles.categoryWrapper}>
              <Text style={styles.fieldLabel}>Category</Text>
              <TouchableOpacity
                style={styles.categoryField}
                onPress={purchase.openNewRowModal}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryFieldText} numberOfLines={1}>
                  Tap to add purchase item
                </Text>
                <Text style={styles.categoryFieldCaret}>▾</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Totals summary */}
          {purchase.rows.length > 0 && (
            <View style={styles.totalsContainer}>
              <View style={styles.totalsRow}>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel} numberOfLines={1}>
                    Grswt
                  </Text>
                  <Text
                    style={styles.totalValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {purchase.totals.grswt.toFixed(3)}
                  </Text>
                </View>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel} numberOfLines={1}>
                    Net Wt
                  </Text>
                  <Text
                    style={styles.totalValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {purchase.totals.netwt.toFixed(3)}
                  </Text>
                </View>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel} numberOfLines={1}>
                    Amount
                  </Text>
                  <Text
                    style={[styles.totalValue, styles.grandTotal]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    ₹{purchase.totals.amount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Purchase grid */}
          {purchase.rows.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator
              style={styles.tableContainer}
            >
              <View>
                <View style={styles.headerRow}>
                  {COLUMN_LABELS.map((label, idx) => (
                    <View key={`header-${idx}`} style={styles.column}>
                      <Text
                        style={styles.headerCell}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.7}
                      >
                        {label}
                      </Text>
                    </View>
                  ))}
                  <View style={styles.deleteCol}>
                    <Text
                      style={styles.headerCell}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      Delete
                    </Text>
                  </View>
                </View>

                {purchase.rows.map((row, rowIndex) => {
                  const wastage = purchase.calcWastage(row);
                  const netWt = purchase.calcNetWt(row);
                  const autoAmount = purchase.calcAmount(row);
                  // Use manual override if set, else auto-calculated
                  const displayAmount = row.manualAmount != null
                    ? row.manualAmount
                    : autoAmount.toFixed(2);
                  const isAlt = rowIndex % 2 === 1;

                  return (
                    <View
                      key={row.id}
                      style={[styles.dataRow, isAlt && styles.dataRowAlt]}
                    >
                      {/* Category — reopens the modal to edit selection */}
                      <TouchableOpacity
                        style={styles.column}
                        onPress={() => purchase.openEditRowModal(row.id)}
                      >
                        <Text style={styles.cellCategory} numberOfLines={2}>
                          {row.category || "-"}
                        </Text>
                      </TouchableOpacity>

                      <View style={styles.column}>
                        <TextInput
                          ref={setInputRef(row.id, "purity")}
                          style={styles.cellInput}
                          keyboardType="decimal-pad"
                          value={row.purity}
                          onChangeText={(v) =>
                            purchase.updateRowField(row.id, "purity", v)
                          }
                          returnKeyType="next"
                          onSubmitEditing={() =>
                            handleSubmitEditing(row.id, "purity")
                          }
                          blurOnSubmit={false}
                        />
                      </View>

                      <View style={styles.column}>
                        <TextInput
                          ref={setInputRef(row.id, "pcs")}
                          style={styles.cellInput}
                          keyboardType="number-pad"
                          value={row.pcs}
                          onChangeText={(v) =>
                            purchase.updateRowField(row.id, "pcs", v)
                          }
                          returnKeyType="next"
                          onSubmitEditing={() =>
                            handleSubmitEditing(row.id, "pcs")
                          }
                          blurOnSubmit={false}
                        />
                      </View>

                      <View style={styles.column}>
                        <TextInput
                          ref={setInputRef(row.id, "grswt")}
                          style={styles.cellInput}
                          keyboardType="decimal-pad"
                          value={row.grswt}
                          onChangeText={(v) =>
                            purchase.updateRowField(row.id, "grswt", v)
                          }
                          returnKeyType="next"
                          onSubmitEditing={() =>
                            handleSubmitEditing(row.id, "grswt")
                          }
                          blurOnSubmit={false}
                        />
                      </View>

                      <View style={styles.column}>
                        <TextInput
                          ref={setInputRef(row.id, "dustwt")}
                          style={styles.cellInput}
                          keyboardType="decimal-pad"
                          value={row.dustwt}
                          onChangeText={(v) =>
                            purchase.updateRowField(row.id, "dustwt", v)
                          }
                          returnKeyType="next"
                          onSubmitEditing={() =>
                            handleSubmitEditing(row.id, "dustwt")
                          }
                          blurOnSubmit={false}
                        />
                      </View>

                      <View style={styles.column}>
                        <TextInput
                          ref={setInputRef(row.id, "wPercent")}
                          style={styles.cellInput}
                          keyboardType="decimal-pad"
                          value={row.wPercent}
                          onChangeText={(v) =>
                            purchase.updateRowField(row.id, "wPercent", v)
                          }
                          returnKeyType="next"
                          onSubmitEditing={() =>
                            handleSubmitEditing(row.id, "wPercent")
                          }
                          blurOnSubmit={false}
                        />
                      </View>

                      <View style={styles.column}>
                        <Text
                          style={styles.cellReadOnly}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.7}
                        >
                          {wastage ? wastage.toFixed(3) : "0.000"}
                        </Text>
                      </View>

                      <View style={styles.column}>
                        <TextInput
                          ref={setInputRef(row.id, "stnwt")}
                          style={styles.cellInput}
                          keyboardType="decimal-pad"
                          value={row.stnwt}
                          onChangeText={(v) =>
                            purchase.updateRowField(row.id, "stnwt", v)
                          }
                          returnKeyType="next"
                          onSubmitEditing={() =>
                            handleSubmitEditing(row.id, "stnwt")
                          }
                          blurOnSubmit={false}
                        />
                      </View>

                      <View style={styles.column}>
                        <Text
                          style={styles.cellReadOnly}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.7}
                        >
                          {netWt ? netWt.toFixed(3) : "0.000"}
                        </Text>
                      </View>

                      <View style={styles.column}>
                        <TextInput
                          ref={setInputRef(row.id, "rate")}
                          style={styles.cellInput}
                          keyboardType="decimal-pad"
                          value={row.rate}
                          onChangeText={(v) =>
                            purchase.updateRowField(row.id, "rate", v)
                          }
                          returnKeyType="next"
                          onSubmitEditing={() =>
                            handleSubmitEditing(row.id, "rate")
                          }
                          blurOnSubmit={false}
                        />
                      </View>

                      <View style={styles.column}>
                        <Text
                          style={styles.cellReadOnly}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.7}
                        >
                          {row.gst || ""}
                        </Text>
                      </View>

                      <View style={styles.column}>
                        <TextInput
                          ref={setInputRef(row.id, "amount")}
                          style={styles.cellInput}
                          keyboardType="decimal-pad"
                          value={String(displayAmount)}
                          onChangeText={(v) =>
                            purchase.updateRowField(row.id, "manualAmount", v)
                          }
                          onFocus={() => {
                            // Pre-fill with auto-calc if no manual value yet
                            if (row.manualAmount == null)
                              purchase.updateRowField(row.id, "manualAmount", autoAmount.toFixed(2));
                          }}
                          onBlur={() => {
                            // If cleared, revert to auto-calc
                            if (!row.manualAmount || row.manualAmount === "")
                              purchase.updateRowField(row.id, "manualAmount", null);
                          }}
                          returnKeyType="next"
                          onSubmitEditing={() =>
                            handleSubmitEditing(row.id, "amount")
                          }
                          blurOnSubmit={false}
                        />
                      </View>

                      <View style={styles.column}>
                        <TextInput
                          ref={setInputRef(row.id, "emp")}
                          style={styles.cellInput}
                          keyboardType="number-pad"
                          value={row.emp}
                          onChangeText={(v) => handleEmpChange(row.id, v)}
                          returnKeyType="done"
                          onSubmitEditing={() =>
                            handleSubmitEditing(row.id, "emp")
                          }
                          blurOnSubmit={false}
                        />
                        {!!row.empName && (
                          <Text style={styles.cellReadOnly} numberOfLines={1}>
                            {row.empName}
                          </Text>
                        )}
                      </View>

                      <View style={styles.deleteCol}>
                        <TouchableOpacity
                          onPress={() => purchase.removeRow(row.id)}
                          style={styles.deleteButton}
                        >
                          <Text style={styles.deleteButtonText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}

                {/* Purchase total row */}
                <View style={styles.totalRowLine}>
                  <View style={styles.column}>
                    <Text
                      style={styles.totalRowLabel}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      PURCHASE TOT
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text
                      style={styles.totalRowValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    ></Text>
                  </View>
                  <View style={styles.column}>
                    <Text
                      style={styles.totalRowValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      {purchase.totals.pcs || ""}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text
                      style={styles.totalRowValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      {purchase.totals.grswt.toFixed(3)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text
                      style={styles.totalRowValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      {purchase.totals.dustwt.toFixed(3)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text
                      style={styles.totalRowValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    ></Text>
                  </View>
                  <View style={styles.column}>
                    <Text
                      style={styles.totalRowValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      {purchase.totals.wastage.toFixed(3)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text
                      style={styles.totalRowValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      {purchase.totals.stnwt.toFixed(3)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text
                      style={styles.totalRowValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      {purchase.totals.netwt.toFixed(3)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text
                      style={styles.totalRowValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    ></Text>
                  </View>
                  <View style={styles.column}>
                    <Text
                      style={styles.totalRowValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    ></Text>
                  </View>
                  <View style={styles.column}>
                    <Text
                      style={styles.totalRowValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    >
                      {purchase.totals.amount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text
                      style={styles.totalRowValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                    ></Text>
                  </View>
                  <View style={styles.deleteCol} />
                </View>
              </View>
            </ScrollView>
          )}

          {/* Action buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={purchase.openNewRowModal}
            >
              <Text
                style={styles.submitButtonText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                + Add Item
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                styles.saveButton,
                purchase.rows.length === 0 && styles.disabledButton,
              ]}
              onPress={() => {
                const invalid = purchase.rows.find(
                  (r) => validateRow(r).length > 0,
                );
                if (invalid) {
                  const missing = validateRow(invalid);
                  Alert.alert(
                    "Required Fields",
                    `Please fill: ${missing.join(", ")}`,
                  );
                  return;
                }
                savePurchaseRows(purchase.rows);
                navigation.goBack();
              }}
              disabled={purchase.rows.length === 0}
            >
              <Text
                style={styles.submitButtonText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                Save
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, styles.clearButton]}
              onPress={purchase.clearAll}
            >
              <Text
                style={styles.submitButtonText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                Clear All
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Footer />

      <CategorySelectModal
        visible={purchase.modalVisible}
        initialValue={purchase.editingRow}
        onClose={purchase.closeModal}
        onDone={purchase.handleCategoryDone}
      />
    </>
  );
}
