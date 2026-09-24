import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

// SALES RETURN entry modal — shown when the screen first opens. The
// checkbox picks which reference the return is looked up by: checked
// (default) = Sale Bill Date, unchecked = Sale Bill No (optional).
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
    onDone({
      mode: useDate ? "date" : "billno",
      billDate: useDate ? formatDisplayDate(billDateObj) : "",
      billNo: !useDate ? billNo.trim() : "",
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
                  style={[styles.fieldInput, useDate && styles.fieldInputDisabled]}
                  value={billNo}
                  onChangeText={setBillNo}
                  editable={!useDate}
                  placeholder="Optional"
                  placeholderTextColor={theme.COLORS.placeholder}
                  autoCapitalize="characters"
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
