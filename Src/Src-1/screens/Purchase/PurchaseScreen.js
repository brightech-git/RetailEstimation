import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Footer from "../../Components/Footer/Footer";
import CommonHeader from "../../../Components/Header/CommonHeader";
import { useTheme } from "../../../Context/ThemeContext";
import { createPurchaseStyles } from "./PurchaseStyles";
import { usePurchase } from "../../Hook/UsePurchase";
import CategorySelectModal from "../../Components/Purchase/CategorySelectModal/CategorySelectModal";
import { usePurchaseContext } from "../../../Context/PurchaseContext";

const COLUMN_LABELS = [
  "Category",
  "Purity",
  "Pcs",
  "Grswt",
  "DustWt",
  "W%",
  "Wastage",
  "Stn wt",
  "Net WT",
  "Rate",
  "GST",
  "Amount",
  "Emp",
];

// Order the Tab/Next key should move focus through for each row. Wastage,
// Net WT and Amount are read-only (auto-calculated) so they're skipped.
const FOCUS_FIELDS = [
  "purity",
  "pcs",
  "grswt",
  "dustwt",
  "wPercent",
  "stnwt",
  "rate",
  "emp",
];

export default function PurchaseScreen() {
  const { theme } = useTheme();
  const styles = createPurchaseStyles(theme);
  const purchase = usePurchase();
  const navigation = useNavigation();
  const { savePurchaseRows } = usePurchaseContext();

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

  const handleSubmitEditing = (rowId, field) => {
    const idx = FOCUS_FIELDS.indexOf(field);
    const nextField = FOCUS_FIELDS[idx + 1];
    if (nextField) {
      focusField(rowId, nextField);
    }
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
      <CommonHeader
        title="Purchase"
        subtitle={
          purchase.rows.length > 0
            ? `${purchase.rows.length} item${purchase.rows.length > 1 ? "s" : ""} added`
            : "Old gold purchase entry"
        }
        rightIcon={purchase.rows.length > 0 ? "trash-outline" : undefined}
        onRightPress={purchase.clearAll}
      />

      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >

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
                <Text style={styles.categoryFieldText}>
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
                  <Text style={styles.totalLabel}>Grswt</Text>
                  <Text style={styles.totalValue}>
                    {purchase.totals.grswt.toFixed(3)}
                  </Text>
                </View>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>Net Wt</Text>
                  <Text style={styles.totalValue}>
                    {purchase.totals.netwt.toFixed(3)}
                  </Text>
                </View>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>Amount</Text>
                  <Text style={[styles.totalValue, styles.grandTotal]}>
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
                      <Text style={styles.headerCell}>{label}</Text>
                    </View>
                  ))}
                  <View style={styles.deleteCol}>
                    <Text style={styles.headerCell}>Delete</Text>
                  </View>
                </View>

                {purchase.rows.map((row) => {
                  const wastage = purchase.calcWastage(row);
                  const netWt = purchase.calcNetWt(row);
                  const amount = purchase.calcAmount(row);

                  return (
                    <View key={row.id} style={styles.dataRow}>
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
                        <Text style={styles.cellReadOnly}>
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
                        <Text style={styles.cellReadOnly}>
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
                        <Text style={styles.cellReadOnly}>
                          {row.gst || ""}
                        </Text>
                      </View>

                      <View style={styles.column}>
                        <Text style={styles.cellReadOnly}>
                          {amount ? amount.toFixed(2) : "0.00"}
                        </Text>
                      </View>

                      <View style={styles.column}>
                        <TextInput
                          ref={setInputRef(row.id, "emp")}
                          style={styles.cellInput}
                          value={row.emp}
                          onChangeText={(v) =>
                            purchase.updateRowField(row.id, "emp", v)
                          }
                          returnKeyType="done"
                          onSubmitEditing={() =>
                            handleSubmitEditing(row.id, "emp")
                          }
                        />
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
                    <Text style={styles.totalRowLabel}>PURCHASE TOT</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.totalRowValue}></Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.totalRowValue}>
                      {purchase.totals.pcs || ""}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.totalRowValue}>
                      {purchase.totals.grswt.toFixed(3)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.totalRowValue}>
                      {purchase.totals.dustwt.toFixed(3)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.totalRowValue}></Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.totalRowValue}>
                      {purchase.totals.wastage.toFixed(3)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.totalRowValue}>
                      {purchase.totals.stnwt.toFixed(3)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.totalRowValue}>
                      {purchase.totals.netwt.toFixed(3)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.totalRowValue}></Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.totalRowValue}></Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.totalRowValue}>
                      {purchase.totals.amount.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.totalRowValue}></Text>
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
              <Text style={styles.submitButtonText}>+ Add Item</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, styles.saveButton, purchase.rows.length === 0 && styles.disabledButton]}
              onPress={() => {
                savePurchaseRows(purchase.rows);
                navigation.goBack();
              }}
              disabled={purchase.rows.length === 0}
            >
              <Text style={styles.submitButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, styles.clearButton]}
              onPress={purchase.clearAll}
            >
              <Text style={styles.submitButtonText}>Clear All</Text>
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
