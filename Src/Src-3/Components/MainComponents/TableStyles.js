import { StyleSheet, Dimensions } from "react-native";
import { fontFor, SIZES } from "../../../Utills/Theme";

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
      fontSize: SIZES.h5,
      fontFamily: fontFor("600"),
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
      fontSize: SIZES.font,
      color: theme.COLORS.text,
      marginRight: 8,
      fontFamily: fontFor(),
    },
    filterArrow: {
      fontSize: 10,
      color: theme.COLORS.textLight,
      fontFamily: fontFor(),
    },
    filterInfoContainer: {
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    filterInfoText: {
      fontSize: SIZES.fontXs,
      color: theme.COLORS.textLight,
      fontStyle: "italic",
      fontFamily: fontFor(),
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
      fontFamily: fontFor("bold"),
      fontSize: SIZES.fontSm,
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
      fontSize: SIZES.font,
      textAlign: "center",
      paddingHorizontal: 4,
      color: theme.COLORS.text,
      fontFamily: fontFor(),
    },
    checkedText: {
      color: theme.COLORS.info,
      fontFamily: fontFor("500"),
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
      fontSize: SIZES.font,
      fontFamily: fontFor(),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.COLORS.backdrop,
      justifyContent: "center",
      alignItems: "center",
    },
    dropdownContainer: {
      backgroundColor: theme.COLORS.cardBackground,
      borderRadius: 8,
      width: width * 0.7,
      maxWidth: 300,
      shadowColor: theme.COLORS.shadowDark,
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
      fontFamily: fontFor(),
    },
    dropdownItemTextSelected: {
      color: theme.COLORS.primary,
      fontFamily: fontFor("600"),
    },
    checkmark: {
      color: theme.COLORS.primary,
      fontSize: SIZES.fontLg,
      fontFamily: fontFor("bold"),
    },
    loadMoreButton: {
      backgroundColor: theme.COLORS.primary,
      paddingVertical: 14,
      borderRadius: 8,
      paddingHorizontal: 12,
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
      textAlign: "center",
      color: theme.COLORS.buttonText,
      fontFamily: fontFor("600"),
      fontSize: SIZES.font,
    },
    allLoadedContainer: {
      backgroundColor: theme.COLORS.success,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 16,
    },
    allLoadedText: {
      textAlign: "center",
      color: theme.COLORS.white,
      fontFamily: fontFor("600"),
      fontSize: SIZES.font,
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
      fontSize: SIZES.fontLg,
      fontFamily: fontFor("bold"),
    },
  });

export default getStyles;
