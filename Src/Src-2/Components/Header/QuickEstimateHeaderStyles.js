// 📁 Src/Src-2/Components/Header/QuickEstimateHeaderStyles.js
import { StyleSheet, Platform, StatusBar } from "react-native";
import { scale, verticalScale, moderateScale } from "../../Utills/Scalling";

export const createQuickEstimateHeaderStyles = (theme) => {
  const { COLORS, SIZES, FONTS } = theme;

  return StyleSheet.create({
    gradientBackground: {
      borderBottomLeftRadius: moderateScale(SIZES.radius_lg),
      borderBottomRightRadius: moderateScale(SIZES.radius_lg),
      overflow: "hidden",
    },
    headerContainer: {
      backgroundColor: "transparent",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: verticalScale(4) },
      shadowOpacity: 0.6,
      shadowRadius: moderateScale(8),
      elevation: 12,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.borderColor,
      overflow: "hidden",
      position: "relative",
      minHeight: verticalScale(90),
    },
    menuButton: {
      position: "absolute",
      top:
        Platform.OS === "android"
          ? (StatusBar.currentHeight || 0) + scale(6)
          : scale(10),
      right: scale(10),
      zIndex: 10,
      padding: scale(6),
    },
    companySection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: scale(8),
      marginTop: scale(-15),
    },
    companyLogo: {
      width: scale(40),
      height: scale(40),
      borderRadius: moderateScale(20), 
      marginRight: scale(10),
      marginTop: verticalScale(5),
    },
    companyName: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.h6),
      letterSpacing: scale(1),
      textShadowColor: COLORS.shadow,
      textShadowOffset: { width: 0, height: verticalScale(1) },
      textShadowRadius: moderateScale(8),
      ...FONTS.heading,
    },
    pageTitle: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.fontSm),
      opacity: 0.9,
      marginTop: verticalScale(2),
      ...FONTS.subheading,
    },
    bottomSection: {
      paddingHorizontal: scale(SIZES.padding),
      paddingVertical: verticalScale(12),
      minHeight: verticalScale(60),
    },
    dateTimeContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: scale(18),
    },
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    timeLabel: {
      color: COLORS.buttonText,
      marginRight: scale(8),
      ...FONTS.subheading,
      fontSize: moderateScale(SIZES.fontSm),
      textShadowColor: COLORS.shadow,
      textShadowOffset: { width: 0, height: verticalScale(1) },
      textShadowRadius: moderateScale(4),
    },
    dateText: {
      color: COLORS.buttonText,
      ...FONTS.text,
      fontSize: moderateScale(SIZES.font),
      textShadowColor: COLORS.shadow,
      textShadowOffset: { width: 0, height: verticalScale(1) },
      textShadowRadius: moderateScale(4),
    },
  });
};

export default createQuickEstimateHeaderStyles;
