import { StyleSheet, Platform } from "react-native";
import { moderateScale } from "../../../Utills/Scalling";
import { fontFor } from "../../../Utills/Theme";

export const createPrinterSettingsStyles = (theme, layout) => {
  const { COLORS, SIZES, FONTS } = theme;

  return StyleSheet.create({
    // ===========================================
    // CONTAINER & LAYOUT
    // ===========================================
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
      padding: moderateScale(SIZES.padding),
    },
    
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.background,
      padding: moderateScale(SIZES.padding),
    },
    
    loadingText: {
      fontSize: moderateScale(SIZES.font),
      color: COLORS.textLight,
      marginTop: moderateScale(16),
      ...FONTS.font,
    },

    // ===========================================
    // HEADER
    // ===========================================
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateScale(20),
      paddingHorizontal: moderateScale(4),
    },
    
    backButton: {
      backgroundColor: COLORS.secondary,
      width: moderateScale(44),
      height: moderateScale(44),
      borderRadius: moderateScale(22),
      justifyContent: "center",
      alignItems: "center",
      ...Platform.select({
        ios: {
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    
    mainTitle: {
      fontSize: moderateScale(SIZES.h4),
      color: COLORS.title,
      flex: 1,
      textAlign: "center",
      marginHorizontal: moderateScale(12),
      ...FONTS.h4,
      fontFamily: fontFor("700"),
    },
    
    refreshButton: {
      backgroundColor: COLORS.primary,
      width: moderateScale(44),
      height: moderateScale(44),
      borderRadius: moderateScale(22),
      justifyContent: "center",
      alignItems: "center",
      ...Platform.select({
        ios: {
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    
    disabledButton: {
      backgroundColor: COLORS.placeholder,
      opacity: 0.5,
    },

    // ===========================================
    // COMPACT CURRENT PRINTER
    // ===========================================
    compactCurrentPrinter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: COLORS.primaryLight,
      borderLeftWidth: moderateScale(3),
      borderLeftColor: COLORS.primary,
      borderRadius: moderateScale(SIZES.radius_sm),
      padding: moderateScale(12),
      marginBottom: moderateScale(16),
      ...Platform.select({
        ios: {
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 2,
        },
      }),
    },

    compactPrinterInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: moderateScale(12),
    },

    compactPrinterIcon: {
      width: moderateScale(36),
      height: moderateScale(36),
      borderRadius: moderateScale(18),
      backgroundColor: COLORS.surface,
      justifyContent: "center",
      alignItems: "center",
    },

    compactPrinterDetails: {
      flex: 1,
    },

    compactPrinterHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateScale(8),
      marginBottom: moderateScale(4),
    },

    compactPrinterName: {
      fontSize: moderateScale(SIZES.font),
      color: COLORS.text,
      ...FONTS.font,
      fontFamily: fontFor("700"),
    },

    compactActiveBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.success,
      paddingHorizontal: moderateScale(8),
      paddingVertical: moderateScale(2),
      borderRadius: moderateScale(10),
      gap: moderateScale(4),
    },

    compactActiveDot: {
      width: moderateScale(6),
      height: moderateScale(6),
      borderRadius: moderateScale(3),
      backgroundColor: COLORS.buttonText,
    },

    compactActiveBadgeText: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.buttonText,
      letterSpacing: moderateScale(0.5),
      ...FONTS.fontXs,
      fontFamily: fontFor("700"),
    },

    compactPrinterAddress: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.textLight,
      fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
      ...FONTS.fontSm,
    },

    compactClearButton: {
      width: moderateScale(32),
      height: moderateScale(32),
      borderRadius: moderateScale(16),
      backgroundColor: COLORS.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: COLORS.danger,
    },

    // ===========================================
    // FORM SECTION
    // ===========================================
    // Tablet or landscape: form + list in two columns; phone portrait: stacked
    columns: layout.wide
      ? { flexDirection: "row", alignItems: "flex-start", gap: moderateScale(16) }
      : {},

    formSection: {
      ...(layout.wide && { flex: 1 }),
      backgroundColor: COLORS.surface,
      padding: moderateScale(SIZES.padding),
      borderRadius: moderateScale(SIZES.radius),
      marginBottom: moderateScale(16),
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      ...Platform.select({
        ios: {
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    
    formHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateScale(16),
      paddingBottom: moderateScale(12),
      borderBottomWidth: 1,
      borderBottomColor: COLORS.borderColor,
    },

    formTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 1,
      gap: moderateScale(8),
    },
    
    sectionTitle: {
      fontSize: moderateScale(SIZES.h6),
      color: COLORS.title,
      ...FONTS.h6,
      fontFamily: fontFor("700"),
    },

    cancelEditButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateScale(4),
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(6),
      borderRadius: moderateScale(SIZES.radius_sm),
      backgroundColor: `${COLORS.danger}15`,
    },
    
    cancelEditText: {
      color: COLORS.danger,
      fontSize: moderateScale(SIZES.fontSm),
      ...FONTS.fontSm,
      fontFamily: fontFor("700"),
    },

    inputGroup: {
      marginBottom: moderateScale(14),
    },
    
    label: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.text,
      marginBottom: moderateScale(6),
      ...FONTS.fontSm,
      fontFamily: fontFor("600"),
    },

    optionalText: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.textLight,
      ...FONTS.fontXs,
      fontFamily: fontFor("400"),
    },

    requiredText: {
      color: COLORS.danger,
      fontFamily: fontFor("700"),
    },

    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: COLORS.borderColor,
      borderRadius: moderateScale(SIZES.radius_sm),
      backgroundColor: COLORS.input,
      paddingHorizontal: moderateScale(12),
      minHeight: moderateScale(48),
    },

    inputIcon: {
      marginRight: moderateScale(8),
    },
    
    input: {
      flex: 1,
      color: COLORS.text,
      fontSize: moderateScale(SIZES.font),
      ...FONTS.font,
      paddingVertical: moderateScale(12),
    },
    
    saveButton: {
      flexDirection: "row",
      backgroundColor: COLORS.primary,
      padding: moderateScale(14),
      borderRadius: moderateScale(SIZES.radius),
      alignItems: "center",
      justifyContent: "center",
      gap: moderateScale(8),
      marginTop: moderateScale(16),
      minHeight: moderateScale(52),
      ...Platform.select({
        ios: {
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.25,
          shadowRadius: 5,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    
    saveButtonDisabled: {
      backgroundColor: COLORS.placeholder,
      opacity: 0.6,
      ...Platform.select({
        ios: {
          shadowOpacity: 0,
        },
        android: {
          elevation: 0,
        },
      }),
    },
    
    buttonText: {
      
      fontSize: moderateScale(SIZES.font),
      letterSpacing: moderateScale(0.5),
      ...FONTS.font,
      color: COLORS.buttonText,
      fontFamily: fontFor("700"),
    },

    // ===========================================
    // SAVED PRINTERS SECTION
    // ===========================================
    savedPrintersSection: {
      ...(layout.wide && { flex: 1 }),
      backgroundColor: COLORS.surface,
      padding: moderateScale(SIZES.padding),
      borderRadius: moderateScale(SIZES.radius),
      marginBottom: moderateScale(24),
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      ...Platform.select({
        ios: {
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateScale(16),
      flexWrap: "wrap",
      gap: moderateScale(8),
    },

    sectionTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateScale(8),
    },

    printerCountBadge: {
      backgroundColor: COLORS.primary,
      borderRadius: moderateScale(12),
      paddingHorizontal: moderateScale(8),
      paddingVertical: moderateScale(2),
      minWidth: moderateScale(24),
      alignItems: "center",
    },

    printerCountText: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.buttonText,
      ...FONTS.fontXs,
      fontFamily: fontFor("700"),
    },
    
    sectionActions: {
      flexDirection: "row",
      gap: moderateScale(8),
    },
    
    viewAllButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateScale(4),
      backgroundColor: COLORS.surface,
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(6),
      borderRadius: moderateScale(SIZES.radius_sm),
      borderWidth: 1,
      borderColor: COLORS.primary,
    },

    viewAllButtonText: {
      color: COLORS.primary,
      fontSize: moderateScale(SIZES.fontSm),
      ...FONTS.fontSm,
      fontFamily: fontFor("700"),
    },
    
    clearAllButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateScale(4),
      backgroundColor: COLORS.danger,
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(6),
      borderRadius: moderateScale(SIZES.radius_sm),
      ...Platform.select({
        ios: {
          shadowColor: COLORS.danger,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 3,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    
    clearAllButtonText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.fontSm),
      ...FONTS.fontSm,
      fontFamily: fontFor("700"),
    },

    // ===========================================
    // PRINTER ITEM
    // ===========================================
    // On narrow screens the action buttons wrap below the printer details
    // instead of squeezing the name into a thin column.
    printerItem: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      rowGap: moderateScale(8),
      padding: moderateScale(12),
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      backgroundColor: COLORS.surfaceVariant || COLORS.background,
      marginBottom: moderateScale(10),
      borderRadius: moderateScale(SIZES.radius_sm),
      ...Platform.select({
        ios: {
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        },
        android: {
          elevation: 1,
        },
      }),
    },
    
    currentPrinterItem: {
      borderLeftWidth: moderateScale(3),
      borderLeftColor: COLORS.primary,
      backgroundColor: COLORS.primaryLight,
      borderColor: COLORS.primary,
      ...Platform.select({
        ios: {
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    
    printerInfo: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: moderateScale(150),
      marginRight: moderateScale(10),
    },

    printerNameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateScale(8),
      marginBottom: moderateScale(4),
      flexWrap: "wrap",
    },
    
    printerName: {
      flexShrink: 1,
      fontSize: moderateScale(SIZES.font),
      color: COLORS.text,
      ...FONTS.font,
      fontFamily: fontFor("700"),
    },
    
    printerAddress: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.textLight,
      fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
      ...FONTS.fontSm,
    },
    
    currentBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.success,
      paddingHorizontal: moderateScale(8),
      paddingVertical: moderateScale(3),
      borderRadius: moderateScale(10),
      gap: moderateScale(4),
    },

    activeDot: {
      width: moderateScale(6),
      height: moderateScale(6),
      borderRadius: moderateScale(3),
      backgroundColor: COLORS.buttonText,
    },
    
    currentBadgeText: {
      fontSize: moderateScale(SIZES.fontXs),
      color: COLORS.buttonText,
      letterSpacing: moderateScale(0.5),
      ...FONTS.fontXs,
      fontFamily: fontFor("800"),
    },
    
    printerActions: {
      flexDirection: "row",
      gap: moderateScale(6),
      marginLeft: "auto",
    },
    
    actionButton: {
      width: moderateScale(32),
      height: moderateScale(32),
      borderRadius: moderateScale(16),
      justifyContent: "center",
      alignItems: "center",
      ...Platform.select({
        ios: {
          shadowColor: COLORS.shadowDark,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    
    selectButton: {
      backgroundColor: COLORS.success,
    },
    
    editButton: {
      backgroundColor: COLORS.info,
    },

    connButton: {
      backgroundColor: COLORS.success,
    },

    connStatusText: {
      fontSize: moderateScale(SIZES.fontXs),
      marginTop: moderateScale(2),
      ...FONTS.fontXs,
      fontFamily: fontFor('600'),
    },
    
    deleteButton: {
      backgroundColor: COLORS.danger,
    },

    // ===========================================
    // EMPTY STATE
    // ===========================================
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      padding: moderateScale(32),
      backgroundColor: COLORS.background,
      borderRadius: moderateScale(SIZES.radius_sm),
      marginVertical: moderateScale(8),
    },
    
    emptyStateIcon: {
      marginBottom: moderateScale(12),
      opacity: 0.5,
    },
    
    emptyText: {
      fontSize: moderateScale(SIZES.font),
      color: COLORS.textLight,
      textAlign: "center",
      marginBottom: moderateScale(4),
      ...FONTS.font,
      fontFamily: fontFor("600"),
    },
    
    emptySubtext: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.textLight,
      textAlign: "center",
      opacity: 0.7,
      lineHeight: moderateScale(20),
      ...FONTS.fontSm,
    },

    // ===========================================
    // MODAL
    // ===========================================
    modalOverlay: {
      flex: 1,
      backgroundColor: COLORS.backdrop,
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(SIZES.padding),
    },
    
    modalContent: {
      backgroundColor: COLORS.surface,
      borderRadius: moderateScale(SIZES.radius_lg || SIZES.radius),
      padding: moderateScale(SIZES.padding),
      width: "100%",
      maxHeight: "85%",
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      ...Platform.select({
        ios: {
          shadowColor: COLORS.shadowDark,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
      }),
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateScale(16),
    },
    
    modalTitle: {
      flex: 1,
      marginRight: moderateScale(8),
      fontSize: moderateScale(SIZES.h5),
      color: COLORS.title,
      ...FONTS.h5,
      fontFamily: fontFor("800"),
    },

    modalCloseButton: {
      width: moderateScale(36),
      height: moderateScale(36),
      borderRadius: moderateScale(18),
      backgroundColor: COLORS.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
    },

    searchWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: COLORS.borderColor,
      borderRadius: moderateScale(SIZES.radius_sm),
      backgroundColor: COLORS.input,
      paddingHorizontal: moderateScale(12),
      marginBottom: moderateScale(16),
      minHeight: moderateScale(48),
    },

    searchIcon: {
      marginRight: moderateScale(8),
    },
    
    searchInput: {
      flex: 1,
      color: COLORS.text,
      fontSize: moderateScale(SIZES.font),
      ...FONTS.font,
      paddingVertical: moderateScale(12),
    },
    
    fullList: {
      maxHeight: moderateScale(450),
    },

    // ===========================================
    // CONFIRMATION MODAL
    // ===========================================
    confirmModal: {
      backgroundColor: COLORS.surface,
      borderRadius: moderateScale(SIZES.radius_lg || SIZES.radius),
      padding: moderateScale(24),
      width: "100%",
      maxWidth: moderateScale(380),
      alignItems: "center",
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      ...Platform.select({
        ios: {
          shadowColor: COLORS.shadowDark,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
      }),
    },

    confirmIconContainer: {
      width: moderateScale(80),
      height: moderateScale(80),
      borderRadius: moderateScale(40),
      backgroundColor: `${COLORS.danger}15`,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: moderateScale(16),
    },
    
    confirmTitle: {
      fontSize: moderateScale(SIZES.h5),
      color: COLORS.title,
      marginBottom: moderateScale(12),
      textAlign: "center",
      ...FONTS.h5,
      fontFamily: fontFor("800"),
    },
    
    confirmMessage: {
      fontSize: moderateScale(SIZES.fontSm),
      color: COLORS.text,
      textAlign: "center",
      marginBottom: moderateScale(24),
      lineHeight: moderateScale(22),
      ...FONTS.fontSm,
    },
    
    confirmButtons: {
      flexDirection: "row",
      gap: moderateScale(12),
      width: "100%",
    },
    
    confirmButton: {
      flex: 1,
      padding: moderateScale(14),
      borderRadius: moderateScale(SIZES.radius),
      alignItems: "center",
      minHeight: moderateScale(48),
      justifyContent: "center",
      ...Platform.select({
        ios: {
          shadowColor: COLORS.shadowDark,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    
    cancelConfirmButton: {
      backgroundColor: COLORS.secondary,
    },

    cancelConfirmButtonText: {
      color: COLORS.text,
      fontSize: moderateScale(SIZES.font),
      letterSpacing: moderateScale(0.5),
      ...FONTS.font,
      fontFamily: fontFor("700"),
    },
    
    deleteConfirmButton: {
      backgroundColor: COLORS.danger,
    },
    
    confirmButtonText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(SIZES.font),
      letterSpacing: moderateScale(0.5),
      ...FONTS.font,
      fontFamily: fontFor("700"),
    },
  });
};

export default createPrinterSettingsStyles;