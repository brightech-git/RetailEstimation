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
      marginHorizontal: moderateScale(0), // Remove horizontal margin since we have gap
    },
    // Specific widths for each input wrapper
    itemIdWrapper: {
      flex: 0.45, // 45% width for Item ID
    },
    tagNoWrapper: {
      flex: 0.45, // 45% width for Tag No
    },
    empIdWrapper: {
      flex: 0.25,
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    empNameText: {
      fontSize: moderateScale(10),
      color: COLORS.primary,
      fontWeight: '600',
      marginTop: moderateScale(2),
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
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    totalItem: {
      alignItems: 'center',
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

  });
};

// Default export for convenience
export default createHomeStyles;