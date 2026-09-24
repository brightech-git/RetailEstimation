import { StyleSheet, Platform } from "react-native";
import { scale, verticalScale, moderateScale, DEVICE } from "../../../Utills/Scalling";

// Same tablet test as the theme (shorter side >= 600dp) so every screen agrees
const { isTablet } = DEVICE;

/**
 * Responsive font sizes
 */
const FONT_SIZES = {
  small: isTablet ? 16 : 12,
  medium: isTablet ? 18 : 14,
  large: isTablet ? 22 : 16,
  heading: isTablet ? 24 : 16,
};

export default function getStyles(theme) {
  const { COLORS, FONTS, SIZES } = theme;

  return StyleSheet.create({
    /* --------------------------------------------------------------------- */
    /* GRADIENT BACKGROUND                                                   */
    /* --------------------------------------------------------------------- */
    gradientBackground: {
      flex: 1,
      borderBottomLeftRadius: moderateScale(12),
      borderBottomRightRadius: moderateScale(12),
      marginBottom: verticalScale(10),
      paddingTop: Platform.OS === "ios" ? verticalScale(30) : verticalScale(10),
    },

    scrollContainer: {
      paddingVertical: verticalScale(5),
      paddingHorizontal: scale(10),
      alignItems: "center",
    },

    /* --------------------------------------------------------------------- */
    /* LOADER                                                                */
    /* --------------------------------------------------------------------- */
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loaderText: {
      ...FONTS.font,
      color: COLORS.text,
      marginTop: 8,
      textAlign: "center",
    },

    /* --------------------------------------------------------------------- */
    /* HEADER SECTION                                                        */
    /* --------------------------------------------------------------------- */
    topSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: verticalScale(8),
      paddingHorizontal: scale(10),
      position: "relative",
    },

    iconContainer: {
      padding: scale(6),
    },
    iconSize: isTablet ? 36 : 28,

    /* --------------------------------------------------------------------- */
    /* COMPANY SECTION                                                       */
    /* --------------------------------------------------------------------- */
    companySection: {
      position: "absolute",
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      pointerEvents: "none",
    },
    companyLogo: {
      width: isTablet ? scale(50) : scale(30),
      height: isTablet ? scale(50) : scale(30),
      marginRight: scale(8),
      borderRadius: moderateScale(15),
    },
    companyName: {
      maxWidth: "70%",
      textAlign: "center",
      color: COLORS.buttonText,
      fontSize: FONT_SIZES.heading,
      letterSpacing: scale(1),
      ...FONTS.heading,
    },

    /* --------------------------------------------------------------------- */
    /* INFO CARD                                                             */
    /* --------------------------------------------------------------------- */
    infoCard: {
      backgroundColor: COLORS.headerCard,
      borderRadius: moderateScale(12),
      paddingVertical: verticalScale(12),
      paddingHorizontal: scale(12),
      width: "100%",
      elevation: 3,
      shadowColor: COLORS.shadowDark,
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    infoSection: {
      flexDirection: "row",
    },
    infoColumn: {
      flex: 1,
    },
    columnDivider: {
      width: 1,
      // backgroundColor: COLORS.borderColor,
      marginHorizontal: scale(6),
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: verticalScale(6),
      borderBottomWidth: 0.3,
      borderBottomColor: COLORS.borderColor,
    },
    // Label keeps its natural width; the value takes the remaining space and
    // shrinks/ellipsizes instead of pushing either onto a second line.
    label: {
      ...FONTS.subheading,
      color: COLORS.text,
      fontSize: moderateScale(FONT_SIZES.small),
      flexShrink: 0,
      marginRight: scale(4),
    },
    value: {
      ...FONTS.text,
      color: COLORS.primary,
      fontSize: moderateScale(FONT_SIZES.small),
      flex: 1,
      minWidth: 0,
      textAlign: "right",
    },
    updatedText: {
      marginTop: verticalScale(4),
      textAlign: "right",
      color: COLORS.textLight,
      fontSize: FONT_SIZES.small,
      ...FONTS.text,
      flexShrink: 1,
    },
  });
}
