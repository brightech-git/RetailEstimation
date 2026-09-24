import { StyleSheet } from "react-native";
import { moderateScale } from "../../../../Utills/Scalling";
import { fontFor } from "../../../../Utills/Theme";

export const createCategorySelectModalStyles = (theme) => {
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
      maxWidth: moderateScale(420),
      maxHeight: "85%",
      backgroundColor: COLORS.surface,
      borderRadius: SIZES.radius,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: COLORS.borderColor,
    },
    modalHeaderBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: COLORS.primary,
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(14),
    },
    modalHeaderText: {
      flex: 1,
      marginRight: moderateScale(8),
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.font),
      ...FONTS.text,
      fontFamily: fontFor("700"),
    },
    closeIconBtn: {
      padding: moderateScale(4),
    },
    closeIconText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.font),
      fontFamily: fontFor("700"),
    },
    modalBody: {
      paddingHorizontal: moderateScale(16),
      paddingTop: moderateScale(14),
    },
    fieldGroup: {
      marginBottom: moderateScale(14),
    },
    fieldLabel: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.label,
      marginBottom: moderateScale(6),
      ...FONTS.subheading,
    },
    dropdownField: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      borderRadius: SIZES.radius_sm,
      backgroundColor: COLORS.input,
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(10),
    },
    dropdownFieldDisabled: {
      opacity: 0.5,
    },
    // Takes the remaining width so long values ellipsize before the caret
    dropdownFieldText: {
      flex: 1,
      marginRight: moderateScale(8),
      fontSize: moderateScale(SIZES.font),
      color: COLORS.text,
      ...FONTS.font,
    },
    dropdownCaret: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.iconPrimary,
      fontFamily: fontFor(),
    },
    dropdownList: {
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      borderRadius: SIZES.radius_sm,
      backgroundColor: COLORS.surface,
      marginTop: moderateScale(4),
      elevation: 4,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
    },
    searchWrapper: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(6),
      borderBottomWidth: 1,
      borderBottomColor: COLORS.outline,
      backgroundColor: COLORS.surfaceVariant,
    },
    searchIcon: {
      fontSize: moderateScale(SIZES.fontSm),
      marginRight: moderateScale(6),
      fontFamily: fontFor(),
    },
    searchInput: {
      flex: 1,
      minWidth: 0,
      fontSize: moderateScale(SIZES.font),
      color: COLORS.text,
      paddingVertical: moderateScale(4),
      ...FONTS.font,
    },
    searchClearIcon: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.label,
      paddingHorizontal: moderateScale(6),
      fontFamily: fontFor(),
    },
    dropdownScroll: {
      maxHeight: moderateScale(140),
    },
    dropdownOption: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(12),
      borderBottomWidth: 1,
      borderBottomColor: COLORS.outline,
    },
    dropdownOptionText: {
      fontSize: moderateScale(SIZES.font),
      color: COLORS.text,
      ...FONTS.font,
    },
    fieldErrorText: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.danger,
      marginTop: moderateScale(-8),
      marginBottom: moderateScale(10),
      ...FONTS.fontXs,
    },
    ownershipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: moderateScale(14),
    },
    ownershipOption: {
      flexDirection: "row",
      alignItems: "center",
      width: "50%",
      paddingRight: moderateScale(6),
      marginBottom: moderateScale(10),
    },
    radioOuter: {
      width: moderateScale(18),
      height: moderateScale(18),
      borderRadius: moderateScale(9),
      borderWidth: 2,
      borderColor: COLORS.borderColor,
      alignItems: "center",
      justifyContent: "center",
      marginRight: moderateScale(8),
    },
    radioOuterActive: {
      borderColor: COLORS.primary,
    },
    radioDot: {
      width: moderateScale(9),
      height: moderateScale(9),
      borderRadius: moderateScale(4.5),
      backgroundColor: COLORS.primary,
    },
    ownershipLabel: {
      flexShrink: 1,
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.text,
      ...FONTS.font,
    },
    descriptionInput: {
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      borderRadius: SIZES.radius_sm,
      backgroundColor: COLORS.input,
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(10),
      fontSize: moderateScale(SIZES.font),
      color: COLORS.text,
      ...FONTS.font,
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
    doneBtn: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(22),
      borderRadius: SIZES.radius_sm,
      backgroundColor: COLORS.primary,
    },
    doneBtnText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.font),
      ...FONTS.text,
      fontFamily: fontFor("700"),
    },
  });
};

export default createCategorySelectModalStyles;
