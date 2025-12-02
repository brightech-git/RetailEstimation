import { StyleSheet } from "react-native";

export const createActionButtonStyles = (theme) => StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  submitButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  printButton: {
    backgroundColor: theme.COLORS.secondary,
  },
  disabledButton: {
    backgroundColor: theme.COLORS.disabled,
  },
  submitButtonText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});