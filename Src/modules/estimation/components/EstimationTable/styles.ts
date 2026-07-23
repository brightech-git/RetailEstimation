// Phase 7 – Estimation Components
import { StyleSheet } from "react-native";
import type { Theme } from "@design";

const COL_WIDTH = 120; // matches the previous inline table column width
const DELETE_COL_WIDTH = 80;

export const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.sm,
      borderRadius: theme.radius.sm,
      overflow: "hidden",
    },
    headerRow: {
      flexDirection: "row",
      backgroundColor: theme.colors.divider,
    },
    dataRow: {
      flexDirection: "row",
      backgroundColor: theme.colors.background,
    },
    column: {
      width: COL_WIDTH,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      borderRightWidth: 1,
      borderColor: theme.colors.border,
    },
    deleteCol: {
      width: DELETE_COL_WIDTH,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      borderRightWidth: 1,
      borderColor: theme.colors.border,
    },
    headerCell: {
      ...theme.typography.caption,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.colors.textPrimary,
    },
    cell: {
      ...theme.typography.caption,
      textAlign: "center",
      color: theme.colors.textPrimary,
    },
    deleteButton: {
      backgroundColor: theme.colors.danger,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.sm,
    },
    deleteButtonText: {
      color: theme.colors.white,
      fontWeight: "bold",
    },
  });
