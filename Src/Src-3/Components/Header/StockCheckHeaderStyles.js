// 📁 Src/Src-3/Components/Header/StockCheckHeaderStyles.js
import { StyleSheet, Platform, StatusBar } from "react-native";

export default function getStyles(theme) {
  const { COLORS } = theme;

  return StyleSheet.create({
    gradientBackground: {
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    container: {
      height: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
    },
    iconButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "700",
      color: COLORS.buttonText,
    },
  });
}
