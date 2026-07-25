// 📁 Src/Components/Sidebar/SidebarStyles.js
import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

export default function getStyles(theme) {
  const { COLORS, FONTS } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: Platform.OS === "ios" ? 10 : 20,
      paddingBottom: 30,
    },

    /* Header */
    drawerHeader: {
      alignItems: "flex-start",
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 0.6,
      borderBottomColor: COLORS.borderColor,
    },
    drawerLogo: {
      width: isTablet ? 90 : 70,
      height: isTablet ? 90 : 70,
      borderRadius: isTablet ? 45 : 35,
      marginBottom: 10,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: COLORS.primary,
    },
    drawerCompanyName: {
      ...FONTS.h5,
      color: COLORS.primary,
      fontWeight: "700",
      letterSpacing: 0.3,
      fontSize: isTablet ? 20 : 17,
    },
    drawerUsername: {
      ...FONTS.fontSm,
      color: COLORS.textLight,
      marginTop: 4,
    },

    /* Theme switch row */
    themeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: COLORS.surfaceVariant,
      marginBottom: 12,
    },

    divider: {
      height: 1,
      backgroundColor: COLORS.outline,
      marginVertical: 10,
    },

    /* Nav items */
    drawerItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 13,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: COLORS.surfaceVariant,
    },
    drawerItemActive: {
      backgroundColor: COLORS.primary,
    },
    drawerItemLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginLeft: 12,
    },
    drawerText: {
      ...FONTS.fontLg,
      color: COLORS.text,
      fontWeight: "600",
      fontSize: isTablet ? 17 : 15,
    },
    drawerTextActive: {
      color: COLORS.buttonText,
    },
    badge: {
      backgroundColor: COLORS.success,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginLeft: 8,
    },
    badgeText: {
      color: COLORS.white,
      fontSize: 10,
      fontWeight: "bold",
    },

    /* Modals (admin auth / change password auth) */
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContainer: {
      width: "90%",
      maxWidth: 400,
      backgroundColor: COLORS.card,
      borderRadius: 16,
      padding: 22,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
    },
    modalHeader: {
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: COLORS.title,
      marginBottom: 6,
      textAlign: "center",
    },
    modalSubtitle: {
      fontSize: 14,
      color: COLORS.textLight,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: COLORS.input,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
      color: COLORS.text,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    inputError: {
      borderColor: COLORS.danger,
      borderWidth: 2,
    },
    errorText: {
      color: COLORS.danger,
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 12,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
      marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: COLORS.lightGray,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    cancelButtonText: {
      color: COLORS.text,
      fontSize: 16,
      fontWeight: "600",
    },
    submitButton: {
      backgroundColor: COLORS.primary,
    },
    submitButtonText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
}
