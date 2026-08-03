import { StyleSheet } from 'react-native';
import { moderateScale } from '../../../Utills/Scalling';

export const createEstimationPreviewModalStyles = (theme) => {
  const { COLORS, SIZES, FONTS } = theme;
  
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.overlay,
    },
    modalContent: {
      backgroundColor: COLORS.surface,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      width: "95%",
      height: "95%",
      borderWidth: 1,
      borderColor: COLORS.borderColor,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: moderateScale(16),
    },
    modalTitle: {
      fontSize: moderateScale(SIZES.h5),
      textAlign: "center",
      color: COLORS.title,
      ...FONTS.h5,
      flex: 1,
      
    },
    closeButton: {
      padding: moderateScale(4),
    },
    printerStatusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: moderateScale(12),
      backgroundColor: COLORS.surfaceVariant,
      borderRadius: SIZES.radius_sm,
      marginBottom: moderateScale(12),
      borderWidth: 1,
      borderColor: COLORS.outline,
    },
    statusIndicator: {
      width: moderateScale(8),
      height: moderateScale(8),
      borderRadius: moderateScale(4),
    },
    statusTextContainer: {
      flex: 1,
      marginLeft: moderateScale(12),
    },
    printerStatusText: {
      fontSize: moderateScale(SIZES.font),
      fontWeight: '600',
      ...FONTS.font,
    },
    statusDescription: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.textLight,
      marginTop: moderateScale(2),
      ...FONTS.fontSm,
    },
    statusError: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.danger,
      marginTop: moderateScale(2),
      ...FONTS.fontXs,
    },
    loadingIndicator: {
      marginLeft: moderateScale(10),
    },
    refreshButton: {
      padding: moderateScale(8),
    },
    printerDetails: {
      backgroundColor: COLORS.primaryLight,
      padding: moderateScale(12),
      borderRadius: SIZES.radius_sm,
      marginBottom: moderateScale(12),
    },
    printerInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: moderateScale(4),
    },
    printerInfo: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.text,
      marginLeft: moderateScale(8),
      ...FONTS.fontSm,
    },
    lastChecked: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.textLight,
      fontStyle: 'italic',
      ...FONTS.fontXs,
    },
    errorContainer: {
      backgroundColor: COLORS.warning + '20',
      padding: moderateScale(16),
      borderRadius: SIZES.radius_sm,
      marginBottom: moderateScale(12),
      alignItems: 'center',
    },
    errorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: moderateScale(8),
    },
    errorTitle: {
      fontSize: moderateScale(SIZES.h6),
      color: COLORS.danger,
      marginLeft: moderateScale(8),
      ...FONTS.h6,
    },
    errorText: {
      fontSize: moderateScale(SIZES.font),
      color: COLORS.text,
      textAlign: 'center',
      marginBottom: moderateScale(8),
      ...FONTS.font,
    },
    errorSubText: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.textLight,
      textAlign: 'center',
      ...FONTS.fontSm,
    },
    troubleshootList: {
      marginTop: moderateScale(8),
      width: '100%',
    },
    troubleshootItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: moderateScale(6),
    },
    troubleshootText: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.text,
      marginLeft: moderateScale(8),
      ...FONTS.fontSm,
    },
    connectionActionButtons: {
      flexDirection: 'row',
      marginTop: moderateScale(12),
      gap: moderateScale(8),
    },
    checkConnectionButton: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: COLORS.info,
      padding: moderateScale(10),
      borderRadius: SIZES.radius_sm,
      alignItems: 'center',
      justifyContent: 'center',
      gap: moderateScale(8),
    },
    setupPrinterButton: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: COLORS.primary,
      padding: moderateScale(10),
      borderRadius: SIZES.radius_sm,
      alignItems: 'center',
      justifyContent: 'center',
      gap: moderateScale(8),
    },
    checkConnectionText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.fontSm),
      fontWeight: '600',
      ...FONTS.fontSm,
    },
    setupPrinterText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.fontSm),
      fontWeight: '600',
      ...FONTS.fontSm,
    },
    errorStateContainer: {
      alignItems: 'center',
      padding: moderateScale(20),
      flex: 1,
      justifyContent: 'center',
    },
    errorIcon: {
      marginBottom: moderateScale(16),
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: moderateScale(8),
    },
    detailText: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.text,
      marginLeft: moderateScale(8),
      ...FONTS.fontSm,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: moderateScale(12),
      marginBottom: moderateScale(20),
      width: '100%',
    },
    primaryButton: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: COLORS.primary,
      paddingVertical: moderateScale(12),
      paddingHorizontal: moderateScale(16),
      borderRadius: SIZES.radius_sm,
      alignItems: 'center',
      justifyContent: 'center',
      gap: moderateScale(8),
    },
    secondaryButton: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: COLORS.surfaceVariant,
      paddingVertical: moderateScale(12),
      paddingHorizontal: moderateScale(16),
      borderRadius: SIZES.radius_sm,
      alignItems: 'center',
      justifyContent: 'center',
      gap: moderateScale(8),
      borderWidth: 1,
      borderColor: COLORS.primary,
    },
    primaryButtonText: {
      fontSize: moderateScale(SIZES.font),
      color: COLORS.buttonText,
      fontWeight: '600',
      ...FONTS.font,
    },
    secondaryButtonText: {
      fontSize: moderateScale(SIZES.font),
      color: COLORS.primary,
      fontWeight: '600',
      ...FONTS.font,
    },
    quickPreview: {
      backgroundColor: COLORS.surfaceVariant,
      padding: moderateScale(16),
      borderRadius: SIZES.radius_sm,
      width: '100%',
    },
    previewTitle: {
      fontSize: moderateScale(SIZES.h6),
      color: COLORS.title,
      marginBottom: moderateScale(8),
      ...FONTS.h6,
    },
    previewContent: {
      gap: moderateScale(4),
    },
    previewText: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.text,
      ...FONTS.fontSm,
    },
    previewContainer: {
      flex: 1,
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      borderRadius: SIZES.radius_sm,
      marginBottom: moderateScale(15),
      backgroundColor: "#e0e0e0",
    },
    previewWebView: {
      flex: 1,
      backgroundColor: "#fff",
    },
    previewContentContainer: {
      paddingBottom: moderateScale(20),
    },
    section: {
      marginBottom: moderateScale(10),
    },
    label: {
      fontSize: moderateScale(SIZES.fontSm),
      fontWeight: 'bold',
      color: COLORS.text,
      marginBottom: moderateScale(2),
      ...FONTS.fontSm,
    },
    underline: {
      borderBottomWidth: 1,
      borderBottomColor: COLORS.text,
      marginBottom: moderateScale(8),
    },
    dashedLine: {
      borderBottomWidth: 1,
      borderBottomColor: COLORS.textLight,
      borderStyle: "dashed",
      marginVertical: moderateScale(8),
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateScale(4),
    },
    tableHeader: {
      backgroundColor: COLORS.primaryLight,
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(8),
      borderRadius: SIZES.radius_sm,
    },
    itemContainer: {
      marginBottom: moderateScale(8),
      paddingLeft: moderateScale(5),
    },
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: moderateScale(2),
    },
    // Column widths matching receipt format
    colDesc: {
      flex: 4,
      textAlign: "left",
    },
    colWeight: {
      flex: 1.5,
      textAlign: "right",
    },
    colVA: {
      flex: 1,
      textAlign: "right",
    },
    colAmount: {
      flex: 1.5,
      textAlign: "right",
    },
    text: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.text,
      ...FONTS.fontXs,
    },
    boldText: {
      fontSize: moderateScale(SIZES.fontXs),
      fontWeight: 'bold',
      color: COLORS.text,
      ...FONTS.fontXs,
    },
    totalsSection: {
      marginTop: moderateScale(10),
    },
    grandTotalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: moderateScale(8),
      backgroundColor: COLORS.primaryLight,
      padding: moderateScale(8),
      borderRadius: SIZES.radius_sm,
    },
    grandTotalText: {
      fontSize: moderateScale(SIZES.font),
      fontWeight: 'bold',
      color: COLORS.primary,
      ...FONTS.font,
    },
    footer: {
      alignItems: "center",
      marginTop: moderateScale(10),
      paddingTop: moderateScale(10),
      borderTopWidth: 1,
      borderTopColor: COLORS.borderColor,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: moderateScale(10),
    },
    cancelButton: {
      flexDirection: 'row',
      backgroundColor: COLORS.secondary,
      padding: moderateScale(12),
      borderRadius: SIZES.radius,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: moderateScale(8),
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 3,
    },
    printButton: {
      flexDirection: 'row',
      backgroundColor: COLORS.primary,
      padding: moderateScale(12),
      borderRadius: SIZES.radius,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: moderateScale(8),
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 3,
    },
    printButtonDisabled: {
      backgroundColor: COLORS.placeholder,
      opacity: 0.6,
    },
    buttonText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.font),
      fontWeight: '600',
      ...FONTS.font,
    },
    connectionActions: {
      marginBottom: moderateScale(12),
    },
    // Add these to your createEstimationPreviewModalStyles function in EstimationPreviewModalStyles.js

printCountContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingVertical: 5,
  backgroundColor: theme.COLORS.cardBackground,
  borderBottomWidth: 1,
  borderBottomColor: theme.COLORS.border,
  position: 'relative',
  zIndex: 10,
},

printCountLabel: {
  fontSize: 16,
  fontWeight: '600',
  color: theme.COLORS.text,
},

printCountSelector: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 8,
  backgroundColor: theme.COLORS.background,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: theme.COLORS.border,
  minWidth: 80,
  justifyContent: 'space-between',
},

printCountText: {
  fontSize: 16,
  fontWeight: '600',
  color: theme.COLORS.primary,
  marginRight: 4,
},

printOptionsDropdown: {
  position: 'absolute',
  top: 60,
  right: 16,
  backgroundColor: "#fff",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: theme.COLORS.border,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  zIndex: 1000,
  minWidth: 160,
  maxHeight: 250,
  overflow: 'hidden',
},

printOption: {
  paddingHorizontal: 16,
  paddingVertical: 7,
  borderBottomWidth: 1,
  borderBottomColor: theme.COLORS.borderLight,
},

printOptionSelected: {
  backgroundColor: theme.COLORS.primary + '20',
},

printOptionText: {
  fontSize: 14,
  color: theme.COLORS.text,
},

printOptionTextSelected: {
  color: theme.COLORS.primary,
  fontWeight: '600',
},

customPrintContainer: {
  flexDirection: 'row',
  padding: 12,
  borderTopWidth: 1,
  borderTopColor: theme.COLORS.borderLight,
  alignItems: 'center',
},

customPrintInput: {
  flex: 1,
  paddingHorizontal: 10,
  paddingVertical: 8,
  backgroundColor: theme.COLORS.background,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: theme.COLORS.border,
  fontSize: 14,
  color: theme.COLORS.text,
  marginRight: 8,
},

customPrintButton: {
  backgroundColor: theme.COLORS.primary,
  padding: 8,
  borderRadius: 4,
  justifyContent: 'center',
  alignItems: 'center',
},
  });
};

export default createEstimationPreviewModalStyles;