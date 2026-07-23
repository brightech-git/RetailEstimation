// Phase 8 – Rate Components
import { StyleSheet } from "react-native";
import type { Theme } from "@design";

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    rowEmphasized: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    label: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      flex: 1,
    },
    value: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      fontWeight: "600",
      flex: 1,
    },
    labelEmphasized: {
      ...theme.typography.subtitle,
      fontWeight: "bold",
      color: theme.colors.primary,
      flex: 1,
    },
    valueEmphasized: {
      ...theme.typography.subtitle,
      fontWeight: "bold",
      color: theme.colors.success,
      flex: 1,
      textAlign: "right",
    },
  });
