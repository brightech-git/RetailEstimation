// Phase 8 – Rate Components
// A horizontal label/value row. Reused for every detail line in ItemDetailsCard
// (and emphasized for the grand-total line).
import React from "react";
import { View, Text } from "react-native";
import { theme } from "@design";
import { makeStyles } from "./styles";
import type { InfoRowProps } from "./types";

const styles = makeStyles(theme);

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, emphasized = false }) => {
  return (
    <View style={[styles.row, emphasized && styles.rowEmphasized]}>
      <Text style={emphasized ? styles.labelEmphasized : styles.label}>{label}</Text>
      <Text style={emphasized ? styles.valueEmphasized : styles.value}>{value}</Text>
    </View>
  );
};

export default InfoRow;
