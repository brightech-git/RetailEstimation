import { StyleSheet } from 'react-native';
import { moderateScale } from '../../../Utills/Scalling';

// This function will create styles based on the theme object from context
export const createHomeStyles = (theme) => {
  const { COLORS, SIZES, FONTS } = theme;
  
  return StyleSheet.create({
    scrollView: {
      backgroundColor: COLORS.background,
    },
    container: {
      flex: 1,
      padding: SIZES.padding,
      paddingBottom: moderateScale(80),
      backgroundColor: COLORS.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: moderateScale(8),
    },
    inputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: moderateScale(20),
      gap: moderateScale(8),
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: 0, // let flex children shrink instead of overflowing the row
    },
    // Relative widths for each input wrapper (Item ID : Tag No : Emp ID = 4 : 4 : 3)
    itemIdWrapper: {
      flex: 4,
    },
    tagNoWrapper: {
      flex: 4,
    },
    empIdWrapper: {
      flex: 3,
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    empNameText: {
      fontSize: moderateScale(10),
      color: COLORS.primary,
      fontWeight: '600',
      marginTop: moderateScale(2),
    },
    input: {
      flex: 1,
      minWidth: 0,
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      borderRadius: SIZES.radius_sm,
      backgroundColor: COLORS.input,
      paddingHorizontal: moderateScale(10),
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
    // Totals wrap onto a new line as whole items instead of squeezing each
    // label/amount pair onto two lines.
    totalsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      rowGap: moderateScale(8),
    },
    finalAmountDivider: {
      borderTopWidth: 1,
      borderColor: COLORS.borderColor,
      marginVertical: moderateScale(8),
    },
    finalAmount: {
      fontWeight: 'bold',
      fontSize: moderateScale(SIZES.fontLg || SIZES.font + 2),
      color: COLORS.primary,
    },
    totalsSectionLabel: {
      fontSize: moderateScale(SIZES.fontSm),
      fontWeight: '700',
      color: COLORS.primary,
      marginBottom: moderateScale(4),
      ...FONTS.subheading,
    },
    totalItem: {
      alignItems: 'center',
      flexGrow: 1,
      flexBasis: '22%',
      minWidth: moderateScale(80),
      paddingHorizontal: moderateScale(4),
    },
    finalAmountItem: {
      flex: 1,
      alignItems: 'center',
    },
    finalAmountBreakdown: {
      textAlign: 'center',
    },
    totalLabel: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.label,
      ...FONTS.subheading,
    },
    totalValue: {
      fontSize: moderateScale(SIZES.font),
      fontWeight: '600',
      color: COLORS.text,
      ...FONTS.text,
    },
    grandTotal: {
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    loader: {
      marginVertical: moderateScale(20),
    },
    tableContainer: {
      marginTop: moderateScale(10),
      marginBottom: moderateScale(10),
      borderRadius: SIZES.radius_sm,
      overflow: 'hidden',
    },
    headerRow: {
      flexDirection: 'row',
      backgroundColor: COLORS.outline,
      paddingVertical: moderateScale(6),
    },
    headerCell: {
      color: COLORS.buttonText,
      fontWeight: 'bold',
      paddingHorizontal: moderateScale(10),
      minWidth: moderateScale(80),
      textAlign: 'center',
      ...FONTS.fontSm,
    },
    dataRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: COLORS.borderColor,
      paddingVertical: moderateScale(6),
      backgroundColor: COLORS.surface,
    },
    cell: {
      minWidth: moderateScale(80),
      textAlign: 'center',
      paddingHorizontal: moderateScale(10),
      color: COLORS.text,
      fontSize: moderateScale(SIZES.fontXs),
      ...FONTS.fontXs,
    },
    trannoContainer: {
      marginTop: moderateScale(12),
      alignItems: 'center',
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
      minHeight: moderateScale(50),
      paddingHorizontal: moderateScale(6),
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
    quickPrintButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: moderateScale(10),
    },
    quickButton: {
      flex: 1,
      padding: moderateScale(12),
      borderRadius: moderateScale(8),
      alignItems: 'center',
    },
    thermalButton: {
      backgroundColor: '#007AFF',
    },
    htmlButton: {
      backgroundColor: '#34C759',
    },
    quickButtonText: {
      color: '#FFFFFF',
      fontSize: moderateScale(14),
      fontWeight: 'bold',
    },
    clearButton: {
      backgroundColor: "#444",
    },
    deleteButton: {
      backgroundColor: COLORS.danger,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(4),
      borderRadius: moderateScale(5),
    },
    deleteButtonText: {
      color: COLORS.buttonText,
      fontWeight: "bold",
      fontSize: moderateScale(SIZES.fontXs),
    },
    column: {
      width: moderateScale(120),
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateScale(8),
      borderRightWidth: 1,
      borderColor: COLORS.borderColor,
    },
    deleteCol: {
      width: moderateScale(80),
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateScale(8),
      borderRightWidth: 1,
      borderColor: COLORS.borderColor,
    },
    purchaseNavButton: {
      flex: 1,
      backgroundColor: COLORS.secondary,
      borderRadius: SIZES.radius,
      paddingVertical: moderateScale(12),
      paddingHorizontal: moderateScale(8),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: moderateScale(14),
      elevation: 3,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
    },
    purchaseNavButtonText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.font),
      fontWeight: 'bold',
      ...FONTS.text,
    },
    purchaseSectionHeader: {
      marginTop: moderateScale(16),
      marginBottom: moderateScale(6),
      borderLeftWidth: moderateScale(4),
      borderLeftColor: COLORS.secondary,
      paddingLeft: moderateScale(8),
    },
    purchaseSectionTitle: {
      fontSize: moderateScale(SIZES.font),
      fontWeight: '700',
      color: COLORS.secondary,
      ...FONTS.text,
    },

  });
};

// Default export for convenience
export default createHomeStyles;