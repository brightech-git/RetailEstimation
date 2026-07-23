// Phase 7 – Estimation Components
import { StyleSheet } from "react-native";
import type { Theme } from "@design";

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
  });
