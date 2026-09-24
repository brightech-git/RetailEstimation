// 📁 Src/Components/Header/CommonHeaderStyles.js
import { StyleSheet, Platform, StatusBar } from "react-native";
import { moderateScale } from "../../Utills/Scalling";
import { fontFor } from "../../Utills/Theme";

export const createCommonHeaderStyles = (theme) => {
  const { COLORS, FONTS } = theme;

  return StyleSheet.create({
    gradientBackground: {
      // The app root is already wrapped in a SafeAreaView (edge-to-edge is on),
      // so adding StatusBar.currentHeight here would double the top gap.
      borderBottomLeftRadius: moderateScale(12),
      borderBottomRightRadius: moderateScale(12),
      elevation: 6,
      shadowColor: COLORS.shadowDark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    container: {
      minHeight: moderateScale(56),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: moderateScale(4),
      paddingVertical: moderateScale(6),
    },
    sideSlot: {
      width: moderateScale(44),
      alignItems: "flex-start",
      justifyContent: "center",
    },
    rightSlot: {
      alignItems: "flex-end",
    },
    iconButton: {
      width: moderateScale(40),
      height: moderateScale(40),
      alignItems: "center",
      justifyContent: "center",
    },
    iconSize: moderateScale(24),
    titleWrapper: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: moderateScale(4),
    },
    title: {
      fontSize: moderateScale(18),
      color: COLORS.buttonText,
      textAlign: "center",
      ...FONTS.heading,
      fontFamily: fontFor("700"),
    },
    subtitle: {
      fontSize: moderateScale(12),
      color: COLORS.buttonText,
      opacity: 0.85,
      textAlign: "center",
      marginTop: moderateScale(2),
      ...FONTS.subheading,
    },
  });
};

export default createCommonHeaderStyles;
