import { StyleSheet } from "react-native";
import { moderateScale } from "../../../Utills/Scalling";

export const createHomeStyles = (theme) => {
  const { COLORS, SIZES, FONTS } = theme;

  return StyleSheet.create({
    scrollView: {
      backgroundColor: COLORS.background,
    },
    container: {
      flex: 1,
      padding: SIZES.padding,
      backgroundColor: COLORS.background,
    },
    inputRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateScale(14),
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginHorizontal: moderateScale(4),
      height: moderateScale(50),
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      borderRadius: SIZES.radius_sm,
      backgroundColor: COLORS.input,
      paddingHorizontal: SIZES.padding,
      paddingVertical: moderateScale(6),
      fontSize: moderateScale(SIZES.font),
      color: COLORS.text,
      ...FONTS.font,
    },
    scanButton: {
      paddingLeft: moderateScale(6),
    },
    scanIcon: {
      fontSize: moderateScale(15),
      color: COLORS.iconPrimary,
    },
    dropdown: {
      backgroundColor: COLORS.surface,
      borderColor: COLORS.borderColor,
      borderWidth: 1,
      borderRadius: SIZES.radius_sm,
      maxHeight: moderateScale(140),
      marginTop: moderateScale(2),
      marginBottom: moderateScale(10),
      zIndex: 10,
      elevation: 5,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
    },
    dropdownItem: {
      padding: SIZES.padding,
      borderBottomColor: COLORS.borderColor,
      borderBottomWidth: 1,
    },
    dropdownText: {
      color: COLORS.text,
      ...FONTS.font,
    },
    totalsContainer: {
      backgroundColor: COLORS.outline,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      marginBottom: moderateScale(10),
      borderWidth: 1,
      borderColor: COLORS.borderColor,
    },
    totalsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    totalItem: {
      alignItems: "center",
    },
    totalLabel: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.label,
      ...FONTS.subheading,
    },
    totalValue: {
      fontSize: moderateScale(SIZES.font),
      fontWeight: "600",
      color: COLORS.text,
      ...FONTS.text,
    },
    grandTotal: {
      fontWeight: "bold",
      color: COLORS.primary,
    },
    loader: {
      marginVertical: moderateScale(20),
    },
    trannoContainer: {
      marginTop: moderateScale(12),
      alignItems: "center",
      padding: moderateScale(10),
      backgroundColor: COLORS.surfaceVariant,
      borderRadius: SIZES.radius_sm,
    },
    trannoText: {
      fontSize: moderateScale(SIZES.font),
      color: COLORS.primary,
      ...FONTS.text,
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: moderateScale(20),
      marginBottom: moderateScale(30),
      gap: moderateScale(8),
    },
    submitButton: {
      backgroundColor: COLORS.primary,
      borderRadius: SIZES.radius,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      height: moderateScale(50),
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 3,
    },
    printButton: {
      backgroundColor: COLORS.secondary,
    },
    submitButtonText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.font),
      ...FONTS.text,
    },
    disabledButton: {
      backgroundColor: COLORS.placeholder,
      opacity: 0.6,
    },
    printButtonsContainer: {
      flexDirection: 'column',
      gap: moderateScale(10),
    },

    // ===== NEW CARD STYLES (MATCHING THE IMAGE) =====
    itemsContainer: {
      marginTop: moderateScale(20),
      marginBottom: moderateScale(20),
    },

    itemsTitle: {
      fontSize: moderateScale(18),
      fontWeight: "bold",
      color: COLORS.text,
      marginBottom: moderateScale(15),
      textAlign: "center",
      ...FONTS.heading,
    },

    cardsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: moderateScale(5),
    },

    itemCard: {
      width: "48%", // Two cards per row
      backgroundColor: "#FFFFFF",
      borderRadius: moderateScale(12),
      borderWidth: 1,
      borderColor: "#E0E0E0",
      marginBottom: moderateScale(15),
      overflow: "hidden",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },

    cardImageContainer: {
      backgroundColor: "#F5F5F5",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: moderateScale(20),
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },

    imagePlaceholder: {
      width: moderateScale(100),
      height: moderateScale(100),
      backgroundColor: "#FFFFFF",
      borderRadius: moderateScale(8),
      borderWidth: 2,
      borderColor: "#E0E0E0",
      borderStyle: "dashed",
      justifyContent: "center",
      alignItems: "center",
    },

    imagePlaceholderIcon: {
      fontSize: moderateScale(40),
    },

    cardTagSection: {
      paddingVertical: moderateScale(12),
      alignItems: "center",
      backgroundColor: "#FAFAFA",
    },

    cardTagNumber: {
      fontSize: moderateScale(18),
      fontWeight: "bold",
      color: "#333333",
      ...FONTS.heading,
    },

    cardDivider: {
      height: 1,
      backgroundColor: "#E0E0E0",
    },

    cardDetailsSection: {
      padding: moderateScale(12),
    },

    cardDetailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingVertical: moderateScale(6),
    },

    cardDetailLabel: {
      fontSize: moderateScale(12),
      color: "#666666",
      flex: 1,
      ...FONTS.text,
    },

    cardDetailValue: {
      fontSize: moderateScale(12),
      color: "#333333",
      fontWeight: "500",
      flex: 1,
      textAlign: "right",
      ...FONTS.text,
    },

    cardGrandTotalRow: {
      paddingTop: moderateScale(10),
      paddingBottom: moderateScale(4),
    },

    cardGrandTotalLabel: {
      fontSize: moderateScale(14),
      fontWeight: "bold",
      color: "#333333",
      flex: 1,
      ...FONTS.heading,
    },

    cardGrandTotalValue: {
      fontSize: moderateScale(16),
      fontWeight: "bold",
      color: "#000000",
      flex: 1,
      textAlign: "right",
      ...FONTS.heading,
    },

    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(20),
    },

    modalContent: {
      backgroundColor: COLORS.cardBackground,
      borderRadius: moderateScale(15),
      width: '100%',
      maxWidth: 400,
      maxHeight: '80%',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: moderateScale(20),
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      backgroundColor: COLORS.primary,
    },

    modalTitle: {
      fontSize: moderateScale(20),
      fontWeight: 'bold',
      color: '#FFFFFF',
    },

    closeButton: {
      width: moderateScale(30),
      height: moderateScale(30),
      borderRadius: moderateScale(15),
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    closeButtonText: {
      fontSize: moderateScale(20),
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
     employeeIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(15),
    paddingHorizontal: moderateScale(10),
  },
  employeeIdLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: theme.COLORS.text,
    marginRight: moderateScale(8),
  },
  employeeIdValue: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: theme.COLORS.primary,
  },

  // Combined input container
  combinedInputContainer: {
    marginBottom: moderateScale(20),
  },
  combinedInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(5),
  },
  combinedInput: {
    flex: 1,
    height: moderateScale(50),
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(15),
    fontSize: moderateScale(16),
    color: theme.COLORS.text,
    backgroundColor: theme.COLORS.cardBackground,
  },
  scannerButton: {
    height: moderateScale(50),
    width: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(10),
    backgroundColor: theme.COLORS.cardBackground,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: moderateScale(8),
  },

  // Error and helper text
  errorText: {
    color: theme.COLORS.error,
    fontSize: moderateScale(14),
    marginLeft: moderateScale(10),
    marginBottom: moderateScale(5),
  },
  helperText: {
    color: theme.COLORS.placeholder,
    fontSize: moderateScale(12),
    marginLeft: moderateScale(10),
    fontStyle: 'italic',
  },
  fetchButton: {
    backgroundColor: theme.COLORS.primary,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(10),
    marginLeft: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    height: moderateScale(50),
    width: moderateScale(80),
  },
  fetchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
    textAlign: "center",
  },

  });
};

export default createHomeStyles;