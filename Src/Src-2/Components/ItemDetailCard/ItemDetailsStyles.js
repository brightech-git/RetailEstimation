import { StyleSheet } from "react-native";
import { moderateScale } from "../../Utills/Scalling";



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
      alignSelf: "center",
      width: "95%",
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
    },
    cardTagSection: {
      alignItems: "center",
      marginBottom: 12,
    },
    cardTagNumber: {
      fontSize: moderateScale(20),
      fontWeight: "bold",
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
    cardDetailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: moderateScale(8),
    },
    cardDetailLabel: {
      fontSize: moderateScale(16),
      color: theme.COLORS.gray,
      fontWeight: "500",
      flex: 1,
    },
    cardDetailValue: {
      fontSize: moderateScale(17),
      color: theme.COLORS.h2,
      fontWeight: "600",
      flex: 1,
      textAlign: "left",
    },
    cardGrandTotalRow: {
      marginTop: moderateScale(8),
      paddingTop: moderateScale(8),
      borderTopWidth: 1,
      borderTopColor: theme.COLORS.border,
    },
    cardGrandTotalLabel: {
      fontSize: moderateScale(16),
      fontWeight: "bold",
      color: theme.COLORS.primary,
    },
    cardGrandTotalValue: {
      fontSize: moderateScale(18),
      fontWeight: "bold",
      color: theme.COLORS.success,
    },
  });