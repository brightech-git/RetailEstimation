import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { createActionButtonStyles } from "./ActionButtonStyles";

const ActionButtons = ({
  theme,
  loading,
  estBatchNo,
  onSubmit,
  onPrint,
  styles: parentStyles,
}) => {
  const styles = createActionButtonStyles(theme);

  return (
    <View style={[styles.actionButtonsContainer, parentStyles?.actionButtonsContainer]}>
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.submitButton,
          styles.printButton,
          !estBatchNo && styles.disabledButton,
        ]}
        onPress={onPrint}
        disabled={!estBatchNo}
      >
        <Text style={styles.submitButtonText}>Print Slip</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;