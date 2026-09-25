import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DatePicker from "../../../../Components/DatePicker/DatePicker";
import { useTheme } from "../../../../Context/ThemeContext";
import { createReturnRefModalStyles } from "./ReturnRefModalStyles";

// DD/MM/YYYY, matching how the billdate is shown on the SALES RETURN modal.
export const formatDisplayDate = (date = new Date()) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};

// YYYY-MM-DD, the billDate format the salereturn APIs expect.
export const formatApiDate = (date = new Date()) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// SALES RETURN entry modal — shown when the screen first opens.
// SALE BILLDATE ticked (default): bill no is optional. Date only → the
//   screen lists that day's bills to pick from; date + bill no → that bill
//   loads directly.
// Unticked: bill no is required and is looked up without a date.
const ReturnRefModal = ({ visible, onClose, onDone }) => {
  const { theme } = useTheme();
  const styles = createReturnRefModalStyles(theme);

  const [useDate, setUseDate] = useState(true);
  const [billDateObj, setBillDateObj] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [billNo, setBillNo] = useState("");

  useEffect(() => {
    if (!visible) return;
    setUseDate(true);
    setBillDateObj(new Date());
    setShowPicker(false);
    setBillNo("");
  }, [visible]);

  const handleSelectDate = (selectedDate) => {
    setBillDateObj(selectedDate);
    setShowPicker(false);
  };

  const handleOk = () => {
    const trimmedBillNo = billNo.trim();
    if (!useDate && !trimmedBillNo) {
      Alert.alert("Bill No Required", "Enter the Sale Bill No, or tick Sale Bill Date.");
      return;
    }
    onDone({
      useDate,
      billDate: useDate ? formatDisplayDate(billDateObj) : "",
      billDateApi: useDate ? formatApiDate(billDateObj) : "",
      billNo: trimmedBillNo,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderBar}>
                <Text style={styles.modalHeaderText}>Sales Return</Text>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.titleText}>SALES RETURN</Text>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  activeOpacity={0.7}
                  onPress={() => setUseDate((prev) => !prev)}
                >
                  <View style={[styles.checkboxBox, useDate && styles.checkboxBoxChecked]}>
                    {useDate && <Text style={styles.checkboxTick}>✓</Text>}
                  </View>
                  <Text style={styles.fieldLabel}>SALE BILLDATE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.fieldInput,
                    styles.dateFieldRow,
                    !useDate && styles.fieldInputDisabled,
                  ]}
                  activeOpacity={0.7}
                  disabled={!useDate}
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={[styles.dateFieldText, !useDate && styles.dateFieldTextDisabled]}>
                    {formatDisplayDate(billDateObj)}
                  </Text>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={useDate ? theme.COLORS.primary : theme.COLORS.placeholder}
                  />
                </TouchableOpacity>

                <DatePicker
                  visible={showPicker}
                  value={billDateObj}
                  onClose={() => setShowPicker(false)}
                  onSelect={handleSelectDate}
                />

                <Text style={styles.secondFieldLabel}>SALE BILLNO</Text>

                <TextInput
                  style={styles.fieldInput}
                  value={billNo}
                  onChangeText={(text) => setBillNo(text.replace(/[^0-9]/g, ""))}
                  keyboardType="number-pad"
                  placeholder={useDate ? "Optional — leave empty to pick from list" : "Required"}
                  placeholderTextColor={theme.COLORS.placeholder}
                  onSubmitEditing={handleOk}
                  returnKeyType="done"
                />
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.okBtn} onPress={handleOk} activeOpacity={0.8}>
                  <Text style={styles.okBtnText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReturnRefModal;
