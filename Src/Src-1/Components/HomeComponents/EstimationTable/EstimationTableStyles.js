import { StyleSheet } from "react-native";

export const createTableStyles = (theme) => StyleSheet.create({
  tableContainer: {
    marginTop: 20,
    backgroundColor: theme.COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    maxHeight: 300,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 10,
  },
  headerCell: {
    width: 100,
    paddingHorizontal: 8,
    textAlign: "center",
    color: theme.COLORS.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  dataRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.border,
    paddingVertical: 8,
  },
  cell: {
    width: 100,
    paddingHorizontal: 8,
    textAlign: "center",
    color: theme.COLORS.text,
    fontSize: 12,
  },
});