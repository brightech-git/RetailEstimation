// Phase 9 – Stock Components
import { StyleSheet } from "react-native";
import type { Theme } from "@design";

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.white,
      margin: theme.spacing.md,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      ...theme.shadow.md,
    },
    title: {
      ...theme.typography.title,
      fontWeight: "700",
      color: theme.colors.primary,
      marginBottom: theme.spacing.md,
    },
    total: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderColor: theme.colors.divider,
    },
    totalLabel: { ...theme.typography.body, color: theme.colors.textSecondary },
    totalNumber: {
      ...theme.typography.heading,
      fontWeight: "800",
      color: theme.colors.primary,
    },
    bar: {
      height: 14,
      borderRadius: theme.radius.sm,
      overflow: "hidden",
      flexDirection: "row",
      marginVertical: theme.spacing.md,
      backgroundColor: theme.colors.divider,
    },
    barFill: { height: "100%" },
    checked: { backgroundColor: theme.colors.success },
    unchecked: { backgroundColor: theme.colors.danger },
    legend: { flexDirection: "row", justifyContent: "space-around" },
    legendItem: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
    dot: { width: 10, height: 10, borderRadius: theme.radius.full },
    label: { ...theme.typography.body, color: theme.colors.textSecondary },
    loadingText: {
      ...theme.typography.body,
      marginTop: theme.spacing.sm,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });
