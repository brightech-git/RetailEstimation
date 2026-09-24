// 📁 src/Screens/Login/LoginStyles.js
import { StyleSheet, Dimensions } from "react-native";
import { moderateScale } from "../../../Utills/Scalling";
import { fontFor } from "../../../Utills/Theme";

const { width } = Dimensions.get("window");

export const getStyles = (theme) => {
  const { COLORS, FONTS, SIZES } = theme;

  return StyleSheet.create({
    gradient: { flex: 1, width: "100%", height: "100%" },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: SIZES.padding,
    },
    content: {
      width: "100%",
      alignItems: "center",
      maxWidth: moderateScale(480),
    },
    logoContainer: {
      width: "100%",
      alignItems: "center",
      marginBottom: moderateScale(25),
    },
    title: {
      color: COLORS.warning,
      textAlign: "center",
      fontSize: moderateScale(28),
      lineHeight: moderateScale(38),
      letterSpacing: 2,
      ...FONTS.heading,
    },
    // Second line of the title; sized so "Jewellery Estimation" fits one line
    titleAccent: {
      color: COLORS.notification,
      ...FONTS.heading,
      fontSize: moderateScale(22),
      letterSpacing: 0.5,
    },
    subtitle: {
      color: COLORS.textLight,
      marginTop: moderateScale(6),
      textAlign: "center",
      ...FONTS.body,
      fontSize: moderateScale(16),
    },
    formContainer: {
      width: "100%",
      borderRadius: SIZES.radius_lg,
      overflow: "hidden",
    },
    glassBackground: {
      borderRadius: SIZES.radius_lg,
      borderWidth: 1.5,
      borderColor: COLORS.borderColor,
    },
    formInner: { padding: SIZES.padding * 1.5 },
    formTitle: {
      color: COLORS.title,
      textAlign: "center",
      marginBottom: moderateScale(22),
      ...FONTS.h5,
    },
    input1: {
      width: "100%",
      height: moderateScale(54),
      paddingHorizontal: moderateScale(16),
      backgroundColor: COLORS.input,
      borderRadius: SIZES.radius,
      color: COLORS.text,
      marginBottom: moderateScale(16),
      ...FONTS.text,
      textTransform: "capitalize",
    },
    input: {
      width: "100%",
      height: moderateScale(54),
      paddingHorizontal: moderateScale(16),
      backgroundColor: COLORS.input,
      borderRadius: SIZES.radius,
      color: COLORS.text,
      marginBottom: moderateScale(16),
      ...FONTS.text,
    },
    // --- Dropdown Button (Cost ID) ---
    dropdownButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: COLORS.input,
      borderRadius: SIZES.radius,
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      paddingHorizontal: moderateScale(16),
      paddingVertical: moderateScale(14),
      marginBottom: moderateScale(16),
      height: moderateScale(54),
    },
    dropdownButtonText: {
      fontSize: moderateScale(16),
      color: COLORS.text,
      flex: 1,
      ...FONTS.text,
    },
    dropdownPlaceholder: {
      color: COLORS.placeholder,
    },
    dropdownArrow: {
      fontSize: moderateScale(14),
      color: COLORS.placeholder,
      marginLeft: moderateScale(8),
      fontFamily: fontFor(),
    },
    // --- Modal Styles ---
    modalOverlay: {
      flex: 1,
      backgroundColor: COLORS.backdrop,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: width * 0.85,
      maxWidth: 480,
      maxHeight: "70%",
      backgroundColor: COLORS.card,
      borderRadius: SIZES.radius_lg,
      padding: moderateScale(20),
      ...(theme.SHADOW?.medium || {
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }),
    },
    modalTitle: {
      fontSize: moderateScale(18),
      color: COLORS.title,
      marginBottom: moderateScale(16),
      textAlign: "center",
      ...FONTS.h5,
      fontFamily: fontFor("600"),
    },
    modalItem: {
      paddingVertical: moderateScale(12),
      paddingHorizontal: moderateScale(16),
      borderRadius: SIZES.radius,
      marginBottom: moderateScale(4),
    },
    modalItemSelected: {
      backgroundColor: COLORS.primary + "20", // 20% opacity
    },
    modalItemText: {
      fontSize: moderateScale(16),
      color: COLORS.text,
      ...FONTS.text,
    },
    modalItemTextSelected: {
      color: COLORS.primary,
      fontFamily: fontFor("500"),
    },
    modalEmptyText: {
      textAlign: "center",
      color: COLORS.placeholder,
      marginVertical: moderateScale(20),
      ...FONTS.text,
    },
    modalCloseButton: {
      marginTop: moderateScale(16),
      paddingVertical: moderateScale(12),
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: COLORS.borderColor,
    },
    modalCloseText: {
      fontSize: moderateScale(16),
      color: COLORS.primary,
      ...FONTS.subheading,
      fontFamily: fontFor("500"),
    },
    // --- Existing Styles ---
    button: {
      width: "100%",
      height: moderateScale(56),
      borderRadius: SIZES.radius,
      overflow: "hidden",
      marginTop: moderateScale(10),
      elevation: 6,
    },
    gradientButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: SIZES.radius,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: {
      color: COLORS.buttonText,
      ...FONTS.subheading,
      fontSize: moderateScale(18),
      letterSpacing: 1,
    },
    toggleThemeBtn: { marginTop: 20, alignSelf: "center" },
    toggleThemeText: { color: COLORS.text, ...FONTS.text },
  });
};