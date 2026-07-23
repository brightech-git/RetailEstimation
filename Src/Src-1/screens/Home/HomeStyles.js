import { StyleSheet } from 'react-native';
import { moderateScale } from '../../../Utills/Scalling';

// This function will create styles based on the theme object from context.
// Totals + table styles were removed after those blocks moved into
// @modules/estimation/components (TotalsCard, EstimationTable); only the styles
// still used by HomeScreen remain.
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: moderateScale(14),
      gap: moderateScale(8),
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: moderateScale(0),
    },
    itemIdWrapper: {
      flex: 0.45,
    },
    tagNoWrapper: {
      flex: 0.45,
    },
    empIdWrapper: {
      flex: 0.25,
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
      position: 'absolute',
      right: moderateScale(10),
      zIndex: 1,
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
    loader: {
      marginVertical: moderateScale(20),
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
      gap: moderateScale(8),
    },
    submitButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: SIZES.padding,
      borderRadius: SIZES.radius,
      alignItems: 'center',
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
    clearButton: {
      backgroundColor: '#444',
      marginLeft: 10,
    },
  });
};

// Default export for convenience
export default createHomeStyles;
