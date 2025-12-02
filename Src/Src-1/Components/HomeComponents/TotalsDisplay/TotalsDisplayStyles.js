import { StyleSheet } from "react-native";

export const createTotalsStyles = (theme) => StyleSheet.create({
  totalsContainer: {
    backgroundColor: theme.COLORS.card,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalItem: {
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: theme.COLORS.text,
    marginBottom: 5,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.COLORS.primary,
  },
  grandTotal: {
    color: theme.COLORS.success,
  },
});