// Phase 4 – Shared Components
import { StyleSheet } from "react-native";
import type { Theme } from "@design";

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      minHeight: 48,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.md,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    fullWidth: { alignSelf: "stretch" },

    // variants
    primary: { backgroundColor: theme.colors.primary },
    secondary: { backgroundColor: theme.colors.secondary },
    outline: {
      backgroundColor: theme.colors.transparent,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    disabled: { opacity: 0.5 },

    // text
    text: { ...theme.typography.button },
    textOnFilled: { color: theme.colors.white },
    textOnOutline: { color: theme.colors.primary },
  });
