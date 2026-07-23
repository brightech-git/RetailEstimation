// Phase 4 – Shared Components
import { StyleSheet } from "react-native";
import type { Theme } from "@design";

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { alignSelf: "stretch" },
    label: {
      ...theme.typography.label,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    required: { color: theme.colors.danger },
    fieldRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      minHeight: 48,
    },
    fieldRowError: { borderColor: theme.colors.danger },
    fieldRowDisabled: { backgroundColor: theme.colors.divider },
    field: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      flex: 1,
      paddingVertical: theme.spacing.sm,
    },
    toggle: { paddingLeft: theme.spacing.sm },
    errorText: {
      ...theme.typography.caption,
      color: theme.colors.danger,
      marginTop: theme.spacing.xs,
    },
  });
