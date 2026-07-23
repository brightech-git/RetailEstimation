// Phase 4 – Shared Components
import { StyleSheet } from "react-native";
import type { Theme } from "@design";

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    padded: { padding: theme.spacing.md },
  });
