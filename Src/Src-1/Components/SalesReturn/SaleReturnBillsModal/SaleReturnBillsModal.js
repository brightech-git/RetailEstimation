import React from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../../../Context/ThemeContext";
import { createReturnRefModalStyles } from "../ReturnRefModal/ReturnRefModalStyles";

// Lists the sale bills for the chosen date (/salereturn-bills) so the user
// can pick which bill to return. One row per item line, so a bill with
// several items shows up once per item. When `required` (nothing loaded
// yet) the backdrop can't dismiss it — a bill must be picked, or "Change
// Date" goes back to the date / bill no popup.
const SaleReturnBillsModal = ({ visible, billDate, bills = [], required = false, loading = false, onClose, onSelect }) => {
  const { theme } = useTheme();
  const styles = createReturnRefModalStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={required ? undefined : onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderBar}>
                <Text style={styles.modalHeaderText}>
                  Select Bill{billDate ? ` — ${billDate}` : ""}
                </Text>
              </View>

              {loading && (
                <ActivityIndicator
                  color={theme.COLORS.primary}
                  style={{ paddingVertical: 8 }}
                />
              )}

              <FlatList
                style={styles.billList}
                data={bills}
                keyExtractor={(item, index) => `${item.batchNo || item.billNo}-${index}`}
                ListEmptyComponent={
                  <Text style={styles.billEmptyText}>No bills found for this date.</Text>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.billRow}
                    activeOpacity={0.7}
                    disabled={loading}
                    onPress={() => onSelect(item)}
                  >
                    <View style={styles.billRowTop}>
                      <Text style={styles.billNoText}>Bill No: {item.billNo}</Text>
                      <Text style={styles.billAmountText}>
                        ₹ {Number(item.amount || 0).toFixed(2)}
                      </Text>
                    </View>
                    <Text style={styles.billSubText} numberOfLines={1}>
                      {item.itemId} - {item.itemName}
                    </Text>
                    <Text style={styles.billSubText} numberOfLines={1}>
                      {item.catName} · Wt: {Number(item.grswt || 0).toFixed(3)}
                    </Text>
                  </TouchableOpacity>
                )}
              />

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.cancelBtnText}>{required ? "Change Date" : "Cancel"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SaleReturnBillsModal;
