import { StyleSheet } from "react-native";
import { moderateScale } from "../../Utills/Scalling";
import { fontFor } from "../../Utills/Theme";

export const createDatePickerStyles = (theme) => {
  const { COLORS, SIZES, FONTS } = theme;

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: COLORS.overlay,
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(16),
    },
    card: {
      width: "100%",
      maxWidth: moderateScale(340),
      backgroundColor: COLORS.surface,
      borderRadius: SIZES.radius,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: COLORS.borderColor,
    },
    monthNavRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: COLORS.primary,
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(8),
    },
    navButton: {
      width: moderateScale(32),
      height: moderateScale(32),
      borderRadius: moderateScale(16),
      alignItems: "center",
      justifyContent: "center",
    },
    navButtonText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(18),
      fontFamily: fontFor("700"),
    },
    monthLabel: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.font),
      ...FONTS.subheading,
      fontFamily: fontFor("700"),
    },
    weekRow: {
      flexDirection: "row",
      paddingTop: moderateScale(10),
      paddingHorizontal: moderateScale(8),
    },
    weekDayCell: {
      flex: 1,
      alignItems: "center",
      paddingBottom: moderateScale(6),
    },
    weekDayText: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.label,
      ...FONTS.fontXs,
      fontFamily: fontFor("700"),
    },
    grid: {
      paddingHorizontal: moderateScale(8),
      paddingBottom: moderateScale(10),
    },
    dayRow: {
      flexDirection: "row",
    },
    dayCell: {
      flex: 1,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      margin: moderateScale(2),
    },
    dayCircle: {
      width: "80%",
      height: "80%",
      maxWidth: moderateScale(34),
      maxHeight: moderateScale(34),
      borderRadius: moderateScale(17),
      alignItems: "center",
      justifyContent: "center",
    },
    dayCircleToday: {
      borderWidth: 1.5,
      borderColor: COLORS.primary,
    },
    dayCircleSelected: {
      backgroundColor: COLORS.primary,
    },
    dayText: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.text,
      ...FONTS.font,
    },
    dayTextSelected: {
      color: COLORS.buttonText,
      fontFamily: fontFor("700"),
    },
    monthCell: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: moderateScale(6),
    },
    monthPill: {
      minWidth: moderateScale(64),
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(8),
      borderRadius: SIZES.radius_sm,
      alignItems: "center",
      justifyContent: "center",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: moderateScale(14),
      paddingVertical: moderateScale(10),
      borderTopWidth: 1,
      borderTopColor: COLORS.outline,
    },
    todayBtn: {
      paddingVertical: moderateScale(8),
      paddingHorizontal: moderateScale(12),
    },
    todayBtnText: {
      color: COLORS.primary,
      fontSize: moderateScale(SIZES.fontSm),
      ...FONTS.subheading,
      fontFamily: fontFor("700"),
    },
    cancelBtn: {
      paddingVertical: moderateScale(8),
      paddingHorizontal: moderateScale(12),
    },
    cancelBtnText: {
      color: COLORS.label,
      fontSize: moderateScale(SIZES.fontSm),
      ...FONTS.font,
    },
  });
};

export default createDatePickerStyles;
