import { StyleSheet } from "react-native";

export const createDropdownStyles = (theme) => StyleSheet.create({
  dropdown: {
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: 8,
    maxHeight: 200,
    marginTop: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.border,
  },
  dropdownText: {
    fontSize: 16,
    color: theme.COLORS.text,
  },
});