import { StyleSheet } from "react-native";
import { moderateScale } from "../../../Utills/Scalling";
import { fontFor } from "../../../Utills/Theme";



export const createItemDetailsStyles = (theme) =>
  StyleSheet.create({
    itemCard: {
      backgroundColor: theme.COLORS.white,
      borderRadius: moderateScale(12),
      padding: moderateScale(16),
      marginBottom: moderateScale(16),
      shadowColor: theme.COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.COLORS.border,
      // two cards per row on tablets (the parent grid wraps), one on phones
      alignSelf: theme.LAYOUT.isTablet ? "flex-start" : "center",
      width: theme.LAYOUT.isTablet ? "48.5%" : "95%",
    },
    cardImageContainer: {
      alignItems: "center",
      marginBottom: 12,
    },
    imagePlaceholder: {
      width: moderateScale(80),
      height: moderateScale(80),
      borderRadius: moderateScale(40),
      backgroundColor: theme.COLORS.lightGray,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.COLORS.primaryLight,
    },
    imagePlaceholderIcon: {
      fontSize: moderateScale(36),
      fontFamily: fontFor(),
    },
    cardTagSection: {
      alignItems: "center",
      marginBottom: 12,
    },
    cardTagNumber: {
      maxWidth: "100%",
      fontSize: moderateScale(20),
      fontFamily: fontFor("bold"),
      color: theme.COLORS.primary,
      backgroundColor: theme.COLORS.primaryLight + "20",
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(4),
      borderRadius: moderateScale(6),
    },
    cardDivider: {
      height: 1,
      backgroundColor: theme.COLORS.border,
      marginVertical: moderateScale(12),
    },
    // Label keeps its natural width; the value fills the rest and wraps
    // right-aligned (long item names) instead of pushing the label down.
    cardDetailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: moderateScale(8),
    },
    cardDetailLabel: {
      fontSize: moderateScale(14),
      color: theme.COLORS.gray,
      fontFamily: theme.FONTS.body.fontFamily,
      flexShrink: 0,
      marginRight: moderateScale(12),
    },
    cardDetailValue: {
      fontSize: moderateScale(15),
      color: theme.COLORS.title,
      fontFamily: theme.FONTS.subheading.fontFamily,
      flex: 1,
      minWidth: 0,
      textAlign: "right",
    },
    cardGrandTotalRow: {
      marginTop: moderateScale(8),
      paddingTop: moderateScale(8),
      borderTopWidth: 1,
      borderTopColor: theme.COLORS.border,
    },
    cardGrandTotalLabel: {
      fontSize: moderateScale(16),
      fontFamily: theme.FONTS.heading.fontFamily,
      color: theme.COLORS.primary,
      flexShrink: 0,
      marginRight: moderateScale(12),
    },
    cardGrandTotalValue: {
      fontSize: moderateScale(18),
      fontFamily: theme.FONTS.heading.fontFamily,
      color: theme.COLORS.success,
      flex: 1,
      minWidth: 0,
      textAlign: "right",
    },
  });