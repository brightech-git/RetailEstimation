import { StyleSheet } from "react-native";
import { moderateScale } from "../../Utills/Scalling";



export const createItemDetailsStyles = (theme) =>
  StyleSheet.create({
    itemCard: {
      backgroundColor: theme.COLORS.white,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.COLORS.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.COLORS.border,
      width: moderateScale(330),
      alignContent:"center",
      justifyContent:"center"
    },
    cardImageContainer: {
      alignItems: "center",
      marginBottom: 12,
    },
    imagePlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.COLORS.lightGray,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.COLORS.primaryLight,
    },
    imagePlaceholderIcon: {
      fontSize: 36,
    },
    cardTagSection: {
      alignItems: "center",
      marginBottom: 12,
    },
    cardTagNumber: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.COLORS.primary,
      backgroundColor: theme.COLORS.primaryLight + "20",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 6,
    },
    cardDivider: {
      height: 1,
      backgroundColor: theme.COLORS.border,
      marginVertical: 12,
    },
 
    cardDetailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    cardDetailLabel: {
      fontSize: 16,
      color: theme.COLORS.gray,
      fontWeight: "500",
      flex: 1,
      fontFamily: theme.FONTS.heading,
    },
    cardDetailValue: {
      fontSize: 17,
      color: theme.COLORS.h2,
      fontWeight: "600",
      flex: 1,
      textAlign: "left",
    },
    cardGrandTotalRow: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.COLORS.border,
    },
    cardGrandTotalLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.COLORS.primary,
    },
    cardGrandTotalValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.COLORS.success,
    },
  });