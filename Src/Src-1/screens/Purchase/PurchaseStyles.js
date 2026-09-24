import { StyleSheet } from "react-native";
import { moderateScale } from "../../../Utills/Scalling";
import { fontFor } from "../../../Utills/Theme";

export const createPurchaseStyles = (theme) => {
  const { COLORS, SIZES, FONTS } = theme;

  return StyleSheet.create({
    scrollView: {
      backgroundColor: COLORS.background,
    },
    container: {
      flex: 1,
      padding: SIZES.padding,
      paddingBottom: moderateScale(80),
      backgroundColor: COLORS.background,
    },
    title: {
      fontSize: moderateScale(SIZES.h5),
      color: COLORS.title,
      marginBottom: moderateScale(16),
      ...FONTS.h5,
      fontFamily: fontFor("700"),
    },
    inputRow: {
      flexDirection: "row",
      marginBottom: moderateScale(16),
    },
    categoryWrapper: {
      flex: 1,
    },
    fieldLabel: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.label,
      marginBottom: moderateScale(6),
      ...FONTS.subheading,
    },
    categoryField: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      borderRadius: SIZES.radius_sm,
      backgroundColor: COLORS.input,
      paddingHorizontal: SIZES.padding,
      paddingVertical: moderateScale(12),
    },
    categoryFieldText: {
      flex: 1,
      marginRight: moderateScale(8),
      fontSize: moderateScale(SIZES.font),
      color: COLORS.text,
      ...FONTS.font,
    },
    categoryFieldCaret: {
      fontSize: moderateScale(SIZES.font),
      color: COLORS.iconPrimary,
      fontFamily: fontFor(),
    },
    totalsContainer: {
      backgroundColor: COLORS.outline,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      marginBottom: moderateScale(10),
      borderWidth: 1,
      borderColor: COLORS.borderColor,
    },
    // Totals wrap onto a new line as whole items instead of squeezing each
    // label/amount pair onto two lines.
    totalsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      rowGap: moderateScale(8),
    },
    totalItem: {
      alignItems: "center",
      flexGrow: 1,
      flexBasis: "30%",
      minWidth: moderateScale(80),
      paddingHorizontal: moderateScale(4),
    },
    totalLabel: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.label,
      ...FONTS.subheading,
    },
    totalValue: {
      fontSize: moderateScale(SIZES.font),
      color: COLORS.text,
      ...FONTS.text,
      fontFamily: fontFor("600"),
    },
    grandTotal: {
      fontFamily: fontFor("bold"),
      color: COLORS.primary,
    },
    tableContainer: {
      marginTop: moderateScale(10),
      marginBottom: moderateScale(10),
      borderRadius: SIZES.radius_sm,
      overflow: "hidden",
    },
    headerRow: {
      flexDirection: "row",
      backgroundColor: COLORS.outline,
      paddingVertical: moderateScale(6),
    },
    headerCell: {
      color: COLORS.buttonText,
      paddingHorizontal: moderateScale(6),
      textAlign: "center",
      ...FONTS.fontSm,
      fontFamily: fontFor("bold"),
    },
    dataRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: COLORS.borderColor,
      paddingVertical: moderateScale(4),
      backgroundColor: COLORS.surface,
      alignItems: "center",
    },
    column: {
      width: moderateScale(100),
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(4),
      borderRightWidth: 1,
      borderColor: COLORS.borderColor,
    },
    deleteCol: {
      width: moderateScale(70),
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateScale(8),
      borderRightWidth: 1,
      borderColor: COLORS.borderColor,
    },
    cellCategory: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.danger,
      textAlign: "center",
      ...FONTS.fontXs,
      fontFamily: fontFor("700"),
    },
    cellInput: {
      width: "100%",
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.text,
      textAlign: "center",
      paddingVertical: moderateScale(4),
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      borderRadius: moderateScale(4),
      backgroundColor: COLORS.input,
      ...FONTS.fontXs,
    },
    cellReadOnly: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.text,
      textAlign: "center",
      ...FONTS.fontXs,
      fontFamily: fontFor("600"),
    },
    totalRowLine: {
      flexDirection: "row",
      backgroundColor: COLORS.surfaceVariant,
      paddingVertical: moderateScale(8),
      borderTopWidth: 2,
      borderColor: COLORS.borderColor,
      alignItems: "center",
    },
    totalRowLabel: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.danger,
      textAlign: "center",
      ...FONTS.fontXs,
      fontFamily: fontFor("700"),
    },
    totalRowValue: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.danger,
      textAlign: "center",
      ...FONTS.fontXs,
      fontFamily: fontFor("700"),
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: moderateScale(20),
      marginBottom: moderateScale(30),
      gap: moderateScale(8),
    },
    submitButton: {
      backgroundColor: COLORS.primary,
      borderRadius: SIZES.radius,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      minHeight: moderateScale(50),
      paddingHorizontal: moderateScale(6),
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 3,
    },
    saveButton: {
      backgroundColor: COLORS.secondary,
    },
    clearButton: {
      backgroundColor: COLORS.neutralButton,
    },
    disabledButton: {
      backgroundColor: COLORS.placeholder,
      opacity: 0.6,
    },
    submitButtonText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.font),
      ...FONTS.text,
    },
    deleteButton: {
      backgroundColor: COLORS.danger,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(4),
      borderRadius: moderateScale(5),
    },
    deleteButtonText: {
      color: COLORS.buttonText,
      fontFamily: fontFor("bold"),
      fontSize: moderateScale(SIZES.fontXs),
    },
  });
};

export default createPurchaseStyles;
