// Phase 4 – Shared Components
import { StyleSheet } from "react-native";
import type { Theme } from "@design";

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.colors.background },
    flex: { flex: 1 },
    padded: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md },
  });
