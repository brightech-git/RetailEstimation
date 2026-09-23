// 📁 Src/Components/Header/CommonHeaderStyles.js
import { StyleSheet, Platform, StatusBar } from "react-native";
import { moderateScale } from "../../Utills/Scalling";

export const createCommonHeaderStyles = (theme) => {
  const { COLORS, FONTS } = theme;

  return StyleSheet.create({
    gradientBackground: {
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      borderBottomLeftRadius: moderateScale(12),
      borderBottomRightRadius: moderateScale(12),
      elevation: 6,
      shadowColor: "#000",
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
      fontWeight: "700",
      color: COLORS.buttonText,
      textAlign: "center",
      ...FONTS.heading,
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
