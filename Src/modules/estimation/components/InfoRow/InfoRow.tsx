// Phase 7 – Estimation Components
// A centered label/value pair. Reused for each figure in the totals summary.
import React from "react";
import { View, Text } from "react-native";
import { theme } from "@design";
import { makeStyles } from "./styles";
import type { InfoRowProps } from "./types";

const styles = makeStyles(theme);

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, emphasized = false }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, emphasized && styles.valueEmphasized]}>{value}</Text>
    </View>
  );
};

export default InfoRow;
