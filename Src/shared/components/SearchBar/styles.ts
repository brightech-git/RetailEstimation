// Phase 4 – Shared Components
import { StyleSheet } from "react-native";
import type { Theme } from "@design";

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.full,
      paddingHorizontal: theme.spacing.md,
      minHeight: 44,
    },
    icon: { marginRight: theme.spacing.sm },
    input: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      flex: 1,
      paddingVertical: theme.spacing.xs,
    },
    clear: { marginLeft: theme.spacing.sm },
  });
