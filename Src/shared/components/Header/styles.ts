// Phase 4 – Shared Components
import { StyleSheet } from "react-native";
import type { Theme } from "@design";

const SIDE = 40; // fixed side slot width so the title stays centered

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 56,
      ...theme.shadow.sm,
    },
    side: { width: SIDE, justifyContent: "center" },
    sideRight: { alignItems: "flex-end" },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    title: { ...theme.typography.subtitle, color: theme.colors.white },
    subtitle: { ...theme.typography.caption, color: theme.colors.white, opacity: 0.85 },
    iconBtn: { padding: theme.spacing.xs },
  });
