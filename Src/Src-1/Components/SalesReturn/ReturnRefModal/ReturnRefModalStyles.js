import { StyleSheet } from "react-native";
import { moderateScale } from "../../../../Utills/Scalling";
import { fontFor } from "../../../../Utills/Theme";

export const createReturnRefModalStyles = (theme) => {
  const { COLORS, SIZES, FONTS } = theme;

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: COLORS.overlay,
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(16),
    },
    modalCard: {
      width: "100%",
      maxWidth: moderateScale(360),
      backgroundColor: COLORS.surface,
      borderRadius: SIZES.radius,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: COLORS.borderColor,
    },
    modalHeaderBar: {
      backgroundColor: COLORS.outline,
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(14),
    },
    modalHeaderText: {
      color: COLORS.text,
      fontSize: moderateScale(SIZES.font),
      ...FONTS.text,
      fontFamily: fontFor("700"),
    },
    modalBody: {
      paddingHorizontal: moderateScale(18),
      paddingTop: moderateScale(16),
      paddingBottom: moderateScale(6),
    },
    titleText: {
      textAlign: "center",
      fontSize: moderateScale(SIZES.fontLg || SIZES.font + 4),
      color: COLORS.primary,
      letterSpacing: 1,
      marginBottom: moderateScale(18),
      ...FONTS.subheading,
      fontFamily: fontFor("800"),
    },
    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateScale(8),
    },
    checkboxBox: {
      width: moderateScale(18),
      height: moderateScale(18),
      borderRadius: moderateScale(3),
      borderWidth: 1.5,
      borderColor: COLORS.borderColor,
      alignItems: "center",
      justifyContent: "center",
      marginRight: moderateScale(8),
      backgroundColor: COLORS.input,
    },
    checkboxBoxChecked: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    checkboxTick: {
      color: COLORS.buttonText,
      fontSize: moderateScale(12),
      fontFamily: fontFor("900"),
    },
    fieldLabel: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.label,
      ...FONTS.subheading,
      fontFamily: fontFor("700"),
    },
    fieldInput: {
      borderWidth: 1,
      borderColor: COLORS.primary,
      borderRadius: SIZES.radius_sm,
      backgroundColor: COLORS.input,
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(9),
      fontSize: moderateScale(SIZES.font),
      color: COLORS.text,
      marginBottom: moderateScale(16),
      ...FONTS.font,
    },
    fieldInputDisabled: {
      borderColor: COLORS.borderColor,
      backgroundColor: COLORS.surfaceVariant,
      color: COLORS.placeholder,
    },
    dateFieldRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    dateFieldText: {
      fontSize: moderateScale(SIZES.font),
      color: COLORS.text,
      ...FONTS.font,
    },
    dateFieldTextDisabled: {
      color: COLORS.placeholder,
    },
    secondFieldLabel: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.label,
      marginBottom: moderateScale(6),
      ...FONTS.subheading,
      fontFamily: fontFor("700"),
    },
    modalFooter: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: moderateScale(16),
      paddingVertical: moderateScale(12),
      borderTopWidth: 1,
      borderTopColor: COLORS.outline,
      backgroundColor: COLORS.surface,
    },
    cancelBtn: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(18),
      borderRadius: SIZES.radius_sm,
      marginRight: moderateScale(10),
      backgroundColor: COLORS.outline,
    },
    cancelBtnText: {
      color: COLORS.text,
      fontSize: moderateScale(SIZES.font),
      ...FONTS.text,
      fontFamily: fontFor("600"),
    },
    okBtn: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(22),
      borderRadius: SIZES.radius_sm,
      backgroundColor: COLORS.primary,
    },
    okBtnText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.font),
      ...FONTS.text,
      fontFamily: fontFor("700"),
    },
  });
};

export default createReturnRefModalStyles;
