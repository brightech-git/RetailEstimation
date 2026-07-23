// Phase 8 – Rate Components
import { StyleSheet } from "react-native";
import type { Theme } from "@design";

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      width: 330,
      backgroundColor: theme.colors.white,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignContent: "center",
      justifyContent: "center",
      ...theme.shadow.md,
    },
    imageContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    imagePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.colors.primaryLight,
    },
    imagePlaceholderIcon: {
      fontSize: 36,
    },
    piecesBadge: {
      position: "absolute",
      top: 4,
      right: 4,
      minWidth: 20,
      height: 20,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    piecesText: {
      ...theme.typography.caption,
      color: theme.colors.white,
      fontWeight: "bold",
    },
    tagSection: {
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    tagNumber: {
      ...theme.typography.title,
      fontWeight: "bold",
      color: theme.colors.primary,
      backgroundColor: theme.colors.primaryLight + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.sm,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.sm,
    },
    detailsSection: {},
  });
