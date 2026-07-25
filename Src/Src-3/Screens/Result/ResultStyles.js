import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.COLORS.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    formCard: {
      backgroundColor: theme.COLORS.cardBackground,
      margin: 16,
      borderRadius: 12,
      padding: 20,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    toast: {
      position: "absolute",
      top: 20,
      left: 0,
      right: 0,
      zIndex: 9999,
      elevation: 10,
    },

    // Warning
    warningContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.isDarkMode ? "rgba(255, 193, 7, 0.15)" : "#fff3cd",
      borderWidth: 1,
      borderColor: theme.COLORS.warning,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    warningText: {
      marginLeft: 10,
      color: theme.COLORS.warning,
      fontSize: 14,
      fontWeight: "500",
      flex: 1,
    },

    // Stats
    statsContainerTop: {
      backgroundColor: theme.COLORS.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.COLORS.border,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    statsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    statsTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.COLORS.primary,
    },
    statsTotal: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.COLORS.title,
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: theme.COLORS.lightGray,
      borderRadius: 4,
      overflow: "hidden",
      flexDirection: "row",
      marginBottom: 16,
    },
    progressChecked: {
      height: "100%",
      backgroundColor: theme.COLORS.success,
    },
    progressUnchecked: {
      height: "100%",
      backgroundColor: theme.COLORS.danger,
    },
    statsDetails: {
      flexDirection: "column",
      justifyContent: "space-between",
      gap: 5,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    statDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 8,
    },
    checkedDot: {
      backgroundColor: theme.COLORS.success,
    },
    uncheckedDot: {
      backgroundColor: theme.COLORS.danger,
    },
    statLabel: {
      fontSize: 18,
      color: theme.COLORS.textLight,
      marginRight: 6,
    },
    statValue: {
      fontSize: 24,
      fontWeight: "600",
    },
    checkedValue: {
      color: theme.COLORS.success,
    },
    uncheckedValue: {
      color: theme.COLORS.danger,
    },

    // Filter Summary
    filterSummaryContainer: {
      backgroundColor: theme.COLORS.surfaceVariant,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.COLORS.border,
      borderLeftWidth: 4,
      borderLeftColor: theme.COLORS.primary,
    },
    filterSummaryTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.COLORS.primary,
      marginBottom: 12,
    },
    filterList: {
      marginBottom: 10,
    },
    filterRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
    },
    filterRowLabel: {
      width: 90,
      fontSize: 14,
      color: theme.COLORS.textLight,
      fontWeight: "600",
    },
    filterRowValue: {
      flex: 1,
      fontSize: 14,
      color: theme.COLORS.primary,
      fontWeight: "700",
      marginLeft: 10,
    },
    filterTagId: {
      color: theme.COLORS.textLight,
      fontWeight: "500",
      fontSize: 13,
    },
    filteredCount: {
      fontSize: 14,
      color: theme.COLORS.textLight,
      fontStyle: "italic",
      marginTop: 8,
    },

    // Mode Toggle
    modeToggleContainer: {
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.COLORS.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.COLORS.title,
      marginBottom: 12,
    },
    modeToggle: {
      flexDirection: "row",
      alignItems: "center",
    },
    modeOption: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 32,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    activeMode: {
      backgroundColor: theme.COLORS.primaryLight,
    },
    modeText: {
      marginLeft: 8,
      fontSize: 15,
      color: theme.COLORS.textLight,
    },
    activeModeText: {
      color: theme.COLORS.primary,
      fontWeight: "600",
    },

    // Recently Updated
    recentUpdateContainer: {
      backgroundColor: theme.COLORS.primaryLight,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.COLORS.border,
      borderLeftWidth: 4,
      borderLeftColor: theme.COLORS.primary,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    recentUpdateHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.COLORS.border,
    },
    recentUpdateTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.COLORS.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: theme.COLORS.primary,
      paddingVertical: 8,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    headerCell: {
      color: theme.COLORS.buttonText,
      fontWeight: "700",
      textAlign: "center",
      fontSize: 14,
    },
    tableRow: {
      flexDirection: "row",
      backgroundColor: theme.COLORS.surfaceVariant,
      paddingVertical: 10,
    },
    cell: {
      textAlign: "center",
      color: theme.COLORS.text,
      fontSize: 14,
    },

    // Loading
    loadingContainer: {
      padding: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    loadingText: {
      marginTop: 10,
      color: theme.COLORS.textLight,
      fontSize: 14,
    },
  });

export default getStyles;
