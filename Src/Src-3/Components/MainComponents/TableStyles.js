import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginTop: 20,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: theme.COLORS.border,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    formTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.COLORS.title,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.COLORS.surfaceVariant,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.COLORS.border,
    },
    filterButtonText: {
      fontSize: 14,
      color: theme.COLORS.text,
      marginRight: 8,
    },
    filterArrow: {
      fontSize: 10,
      color: theme.COLORS.textLight,
    },
    filterInfoContainer: {
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    filterInfoText: {
      fontSize: 12,
      color: theme.COLORS.textLight,
      fontStyle: "italic",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: theme.COLORS.primary,
      paddingVertical: 12,
      paddingHorizontal: 4,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    headerCell: {
      color: theme.COLORS.buttonText,
      fontWeight: "bold",
      fontSize: 14,
      textAlign: "center",
      paddingHorizontal: 4,
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 10,
      paddingHorizontal: 4,
      minHeight: 45,
      alignItems: "center",
    },
    evenRow: {
      backgroundColor: theme.COLORS.cardBackground,
    },
    oddRow: {
      backgroundColor: theme.COLORS.surfaceVariant,
    },
    checkedRow: {
      backgroundColor: theme.COLORS.primaryLight,
    },
    rowCell: {
      fontSize: 14,
      textAlign: "center",
      paddingHorizontal: 4,
      color: theme.COLORS.text,
    },
    checkedText: {
      color: theme.COLORS.info,
      fontWeight: "500",
    },
    emptyContainer: {
      padding: 40,
      alignItems: "center",
      backgroundColor: theme.COLORS.cardBackground,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    },
    emptyText: {
      color: theme.COLORS.textLight,
      fontSize: 14,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    dropdownContainer: {
      backgroundColor: theme.COLORS.cardBackground,
      borderRadius: 8,
      width: width * 0.7,
      maxWidth: 300,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "hidden",
    },
    dropdownItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.COLORS.border,
    },
    dropdownItemSelected: {
      backgroundColor: theme.COLORS.primaryLight,
    },
    dropdownItemText: {
      fontSize: 15,
      color: theme.COLORS.text,
    },
    dropdownItemTextSelected: {
      color: theme.COLORS.primary,
      fontWeight: "600",
    },
    checkmark: {
      color: theme.COLORS.primary,
      fontSize: 16,
      fontWeight: "bold",
    },
    loadMoreButton: {
      backgroundColor: theme.COLORS.primary,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 16,
      elevation: 2,
    },
    loadMoreButtonDisabled: {
      backgroundColor: theme.COLORS.gray,
      opacity: 0.7,
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    loadMoreText: {
      color: theme.COLORS.buttonText,
      fontWeight: "600",
      fontSize: 14,
    },
    allLoadedContainer: {
      backgroundColor: theme.COLORS.success,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 16,
    },
    allLoadedText: {
      color: theme.COLORS.white,
      fontWeight: "600",
      fontSize: 14,
    },
    printButton: {
      backgroundColor: theme.COLORS.info,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignSelf: "flex-end",
      margin: 10,
    },
    printText: {
      color: theme.COLORS.white,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default getStyles;
