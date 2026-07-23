import { StyleSheet } from "react-native";
import { moderateScale } from "../../../Utills/Scalling";

// Trimmed to the styles actually used by Home.js. The card styles moved into
// @modules/rate/components (ItemDetailsCard); dead totals/table/modal/dropdown/
// employee-id/input blocks were removed.
export const createHomeStyles = (theme) => {
  const { COLORS, SIZES, FONTS } = theme;

  return StyleSheet.create({
    scrollView: {
      backgroundColor: COLORS.background,
    },
    container: {
      flex: 1,
      padding: SIZES.padding,
      backgroundColor: COLORS.background,
    },
    loader: {
      marginVertical: moderateScale(20),
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: moderateScale(20),
      gap: moderateScale(10),
    },
    submitButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: SIZES.padding,
      borderRadius: SIZES.radius,
      alignItems: "center",
      width: "40%",
      height: moderateScale(50),
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 3,
    },
    printButton: {
      backgroundColor: COLORS.secondary,
    },
    submitButtonText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.font),
      ...FONTS.text,
    },
    disabledButton: {
      backgroundColor: COLORS.placeholder,
      opacity: 0.6,
    },
    itemsContainer: {
      marginTop: moderateScale(20),
      marginBottom: moderateScale(20),
    },
    cardsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: moderateScale(5),
    },
    combinedInputContainer: {
      marginBottom: 20,
    },
    combinedInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
    },
    combinedInput: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: theme.COLORS.border,
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 16,
      color: theme.COLORS.text,
      backgroundColor: theme.COLORS.cardBackground,
    },
    scannerButton: {
      height: 50,
      width: 50,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 10,
      backgroundColor: theme.COLORS.cardBackground,
      borderWidth: 1,
      borderColor: theme.COLORS.border,
      borderRadius: 8,
    },
    errorText: {
      color: theme.COLORS.error,
      fontSize: 14,
      marginLeft: 10,
      marginBottom: 5,
    },
    helperText: {
      color: theme.COLORS.placeholder,
      fontSize: 12,
      marginLeft: 10,
      fontStyle: "italic",
    },
    fetchButton: {
      backgroundColor: theme.COLORS.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      marginLeft: 8,
      justifyContent: "center",
      alignItems: "center",
      height: moderateScale(50),
      width: moderateScale(80),
    },
    fetchButtonText: {
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
    },
  });
};

export default createHomeStyles;
