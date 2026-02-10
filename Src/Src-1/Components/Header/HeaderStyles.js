import { StyleSheet, Platform, Dimensions } from "react-native";
import { scale, verticalScale, moderateScale } from "../../Utills/Scalling";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

/**
 * Responsive font sizes
 */
const FONT_SIZES = {
  small: isTablet ? 16 : 12,
  medium: isTablet ? 18 : 14,
  large: isTablet ? 22 : 16,
  heading: isTablet ? 24 : 16,
};

export default function getStyles(theme) {
  const { COLORS, FONTS, SIZES } = theme;

  return StyleSheet.create({
    /* --------------------------------------------------------------------- */
    /* GRADIENT BACKGROUND                                                   */
    /* --------------------------------------------------------------------- */
    gradientBackground: {
      flex: 1,
      borderBottomLeftRadius: moderateScale(12),
      borderBottomRightRadius: moderateScale(12),
      marginBottom: verticalScale(10),
      paddingTop: Platform.OS === "ios" ? verticalScale(30) : verticalScale(10),
    },

    scrollContainer: {
      paddingVertical: verticalScale(5),
      paddingHorizontal: scale(10),
      alignItems: "center",
    },

    /* --------------------------------------------------------------------- */
    /* LOADER                                                                */
    /* --------------------------------------------------------------------- */
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loaderText: {
      ...FONTS.font,
      color: COLORS.text,
      marginTop: 8,
      textAlign: "center",
    },

    /* --------------------------------------------------------------------- */
    /* HEADER SECTION                                                        */
    /* --------------------------------------------------------------------- */
    topSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: verticalScale(8),
      paddingHorizontal: scale(10),
      position: "relative",
    },

    iconContainer: {
      padding: scale(6),
    },
    iconSize: isTablet ? 36 : 28,

    /* --------------------------------------------------------------------- */
    /* COMPANY SECTION                                                       */
    /* --------------------------------------------------------------------- */
    companySection: {
      position: "absolute",
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      pointerEvents: "none",
    },
    companyLogo: {
      width: isTablet ? scale(50) : scale(30),
      height: isTablet ? scale(50) : scale(30),
      marginRight: scale(8),
      borderRadius: moderateScale(15),
    },
    companyName: {
      maxWidth: "70%",
      textAlign: "center",
      color: COLORS.buttonText,
      fontSize: FONT_SIZES.heading,
      letterSpacing: scale(1),
      ...FONTS.heading,
    },

    /* --------------------------------------------------------------------- */
    /* INFO CARD                                                             */
    /* --------------------------------------------------------------------- */
    infoCard: {
      backgroundColor: theme.isDarkMode
        ? COLORS.surfaceVariant
        : "rgba(255,255,255,0.95)",
      borderRadius: moderateScale(12),
      paddingVertical: verticalScale(12),
      paddingHorizontal: scale(15),
      width: "100%",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    infoSection: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: verticalScale(6),
      borderBottomWidth: 0.3,
      borderBottomColor: COLORS.borderColor,
    },
    label: {
      ...FONTS.subheading,
      color: COLORS.text,
      marginRight: scale(8),
      fontSize: SIZES.h6,
    },
    value: {
      ...FONTS.text,
      color: COLORS.primary,
      fontWeight: "600",
    },
    updatedText: {
      marginTop: verticalScale(8),
      textAlign: "right",
      color: COLORS.textLight,
      fontSize: FONT_SIZES.small,
      ...FONTS.text,
    },

    /* --------------------------------------------------------------------- */
    /* DRAWER – FIXED POSITION & ALIGNMENT                                   */
   /* -------------------------------------------------------------------------- */
/* 🎚️ FIXED DRAWER STYLES — FULL BACKGROUND + SMOOTH CONTENT DISPLAY         */
/* -------------------------------------------------------------------------- */
drawerOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0, 0, 0, 0.38)",
  zIndex: 1000,
},

drawerContainer: {
  position: "absolute",
  top: 0,
  right: 0,
  width: width * 0.75, // 75% of screen width
  height: 850, // Fixed height
  backgroundColor: theme.isDarkMode
    ? COLORS.surface
    : COLORS.background, // ✅ Use theme background (or "#000" for solid)
  borderTopLeftRadius: moderateScale(20),
  borderBottomLeftRadius: moderateScale(20),
  paddingTop: Platform.OS === "ios" ? verticalScale(50) : verticalScale(30),
  paddingHorizontal: scale(15),
  elevation: 20,
  shadowColor: "#000",
  shadowOpacity: 0.35,
  shadowRadius: 15,
  shadowOffset: { width: -4, height: 0 },
  zIndex: 2000,
  overflow: "hidden", // ✅ Ensures background fills entire drawer
},

closeDrawer: {
  position: "absolute",
  top: Platform.OS === "ios" ? verticalScale(40) : verticalScale(0), // small top margin
  right: scale(2),                                                  // aligns to right edge
  zIndex: 2100,
  padding: scale(6),
  backgroundColor: "rgba(0,0,0,0.05)",                               // light touch background
  borderRadius: moderateScale(20),
  alignSelf: "flex-end",                                             // ensures right alignment
},


drawerHeader: {
  alignItems: "flex-start",
  marginBottom: verticalScale(30),
  paddingBottom: verticalScale(15),
  borderBottomWidth: 0.6,
  borderBottomColor: COLORS.borderColor,
},

drawerLogo: {
  width: scale(150),
  height: scale(80),
  borderRadius: moderateScale(14),
  marginBottom: verticalScale(8),
  // backgroundColor: COLORS.surfaceVariant,
},

drawerCompanyName: {
  ...FONTS.h5,
  color: COLORS.primary,
  textAlign: "center",
  fontWeight: "700",
  letterSpacing: 0.5,
  fontSize: isTablet ? 20 : 17,
},

drawerItem: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: verticalScale(14),
  paddingHorizontal: scale(12),
  borderRadius: moderateScale(12),
  marginBottom: verticalScale(10),
  backgroundColor: theme.isDarkMode
    ? COLORS.surfaceVariant
    : "rgba(245,245,245,0.9)",
},

drawerText: {
  ...FONTS.fontLg,
  color: COLORS.text,
  marginLeft: scale(14),
  fontWeight: "600",
  fontSize: isTablet ? 18 : 15,
},
 // 🔒 Admin Authentication Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: theme.COLORS.card,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.COLORS.title,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.COLORS.text,
    textAlign: 'center',
    opacity: 0.8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: theme.COLORS.inputBackground || '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.COLORS.text,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
  },
  inputError: {
    borderColor: theme.COLORS.danger,
    borderWidth: 2,
  },
  errorText: {
    color: theme.COLORS.danger,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: theme.COLORS.gray + '20',
    borderWidth: 1,
    borderColor: theme.COLORS.gray,
  },
  cancelButtonText: {
    color: theme.COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: theme.COLORS.primary,
  },
  submitButtonText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  credentialsHint: {
    marginTop: 20,
    padding: 10,
    backgroundColor: theme.COLORS.warning + '20',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.COLORS.warning,
  },
  hintText: {
    color: theme.COLORS.warning,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // In your HeaderStyles.js, add these to the returned styles object
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
},
modalContainer: {
  width: "90%",
  backgroundColor: theme.COLORS.card,
  borderRadius: 12,
  padding: 20,
  maxWidth: 400,
},
modalHeader: {
  marginBottom: 20,
},
modalTitle: {
  fontSize: 20,
  fontWeight: "bold",
  color: theme.COLORS.title,
  marginBottom: 8,
  textAlign: "center",
},
modalSubtitle: {
  fontSize: 14,
  color: theme.COLORS.text,
  textAlign: "center",
  marginBottom: 5,
},
inputContainer: {
  marginBottom: 15,
},
inputLabel: {
  fontSize: 14,
  fontWeight: "600",
  color: theme.COLORS.text,
  marginBottom: 8,
},
textInput: {
  borderWidth: 1,
  borderColor: theme.COLORS.border,
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
  color: theme.COLORS.text,
  backgroundColor: theme.COLORS.inputBackground,
},
inputError: {
  borderColor: theme.COLORS.danger,
},
errorText: {
  color: theme.COLORS.danger,
  fontSize: 14,
  textAlign: "center",
  marginVertical: 10,
},
modalButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 20,
},
modalButton: {
  flex: 1,
  padding: 14,
  borderRadius: 8,
  alignItems: "center",
  marginHorizontal: 5,
},
cancelButton: {
  backgroundColor: theme.COLORS.gray,
},
submitButton: {
  backgroundColor: theme.COLORS.primary,
},
cancelButtonText: {
  color: theme.COLORS.white,
  fontWeight: "bold",
  fontSize: 16,
},
submitButtonText: {
  color: theme.COLORS.white,
  fontWeight: "bold",
  fontSize: 16,
},
credentialsHint: {
  marginTop: 15,
  padding: 10,
  backgroundColor: theme.COLORS.infoLight,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: theme.COLORS.info,
},
hintText: {
  color: theme.COLORS.info,
  fontSize: 12,
  textAlign: "center",
},
  });
}