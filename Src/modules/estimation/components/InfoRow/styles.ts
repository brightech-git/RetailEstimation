// Phase 7 – Estimation Components
import { StyleSheet } from "react-native";
import type { Theme } from "@design";

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    item: { alignItems: "center" },
    label: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    value: {
      ...theme.typography.body,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    valueEmphasized: {
      fontWeight: "bold",
      color: theme.colors.primary,
    },
  });
