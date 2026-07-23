// Phase 7 – Estimation Components
// Totals summary (Gross / GST / Grand Total). Replaces the inline totals block
// in HomeScreen. Value formatting matches the original exactly: ₹ + toFixed(2)
// (no thousands grouping), so the displayed numbers are unchanged.
import React from "react";
import { View } from "react-native";
import { theme } from "@design";
import { InfoRow } from "../InfoRow";
import { makeStyles } from "./styles";
import type { TotalsCardProps } from "./types";

const styles = makeStyles(theme);

const money = (value: number) => `₹${Number(value).toFixed(2)}`;

export const TotalsCard: React.FC<TotalsCardProps> = ({ gross, gst, grand }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <InfoRow label="Gross Amount" value={money(gross)} />
        <InfoRow label="GST Amount" value={money(gst)} />
        <InfoRow label="Grand Total" value={money(grand)} emphasized />
      </View>
    </View>
  );
};

export default TotalsCard;
