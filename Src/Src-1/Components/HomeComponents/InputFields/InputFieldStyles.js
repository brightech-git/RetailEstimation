import { StyleSheet } from "react-native";

export const createInputStyles = (theme) => StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  inputWrapper: {
    marginHorizontal: 5,
    position: "relative",
  },

  Iteminput: {
    height: 50,
    width: 110,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: theme.COLORS.text,
    backgroundColor: theme.COLORS.inputBackground,
  },

  Taginput: {
    height: 50,
    width: 150,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: theme.COLORS.text,
    backgroundColor: theme.COLORS.inputBackground,
  },

  Empinput: {
    height: 50,
    width: 90,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: theme.COLORS.text,
    backgroundColor: theme.COLORS.inputBackground,
  },

  scanButton: {
    position: "absolute",
    right: 10,
    top: 12,
  },

  scanIcon: {
    fontSize: 20,
  },
});
