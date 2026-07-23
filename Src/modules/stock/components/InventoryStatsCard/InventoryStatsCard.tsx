// Phase 9 – Stock Components
// Extracted verbatim from Src-3 Home's inline InventoryStatsCard. Same layout,
// same percentages, same legend; hardcoded colors replaced with @design tokens.
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { theme } from "@design";
import { makeStyles } from "./styles";
import type { InventoryStatsCardProps } from "./types";

const styles = makeStyles(theme);

export const InventoryStatsCard: React.FC<InventoryStatsCardProps> = React.memo(
  ({ stats, loading, refreshing }) => {
    const checkedPct =
      stats.totalCount > 0 ? (stats.totalChecked / stats.totalCount) * 100 : 0;
    const uncheckedPct =
      stats.totalCount > 0 ? (stats.totalUnchecked / stats.totalCount) * 100 : 0;

    if (loading && !refreshing) {
      return (
        <View style={styles.card}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading inventory...</Text>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <Text style={styles.title}>Inventory Status</Text>
        <View style={styles.total}>
          <Text style={styles.totalLabel}>Total Items</Text>
          <Text style={styles.totalNumber}>{stats.totalCount}</Text>
        </View>
        <View style={styles.bar}>
          <View style={[styles.barFill, styles.checked, { flex: checkedPct }]} />
          <View style={[styles.barFill, styles.unchecked, { flex: uncheckedPct }]} />
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, styles.checked]} />
            <Text style={styles.label}>Checked • {stats.totalChecked}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, styles.unchecked]} />
            <Text style={styles.label}>Unchecked • {stats.totalUnchecked}</Text>
          </View>
        </View>
      </View>
    );
  }
);

InventoryStatsCard.displayName = "InventoryStatsCard";

export default InventoryStatsCard;
