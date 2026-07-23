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
    field: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 48,
    },
    fieldError: { borderColor: theme.colors.danger },
    fieldDisabled: {
      backgroundColor: theme.colors.divider,
      color: theme.colors.textDisabled,
    },
    errorText: {
      ...theme.typography.caption,
      color: theme.colors.danger,
      marginTop: theme.spacing.xs,
    },
  });
