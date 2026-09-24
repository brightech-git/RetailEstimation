// 📁 Src/Components/Footer/Footer.js
// Single footer shared by Src-1, Src-2 and Src-3 screens. Colours and fonts
// come from the app theme (Src/Utills/Theme.js) so it follows light/dark mode.
import React from "react";
import { View, Text, StyleSheet, Platform, I18nManager } from "react-native";
import { useTheme } from "../../Context/ThemeContext";

const Footer = ({
  companyName = "© 2026 Brightech Software Services Pvt Ltd",
  style,
  testID = "footer-component",
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View
      style={[styles.footer, style]}
      testID={testID}
      accessible={true}
      accessibilityLabel="App footer"
    >
      <Text style={styles.companyName} numberOfLines={1}>
        {companyName}
      </Text>
    </View>
  );
};

const getStyles = (theme) => {
  const { COLORS, SIZES, FONTS } = theme;

  return StyleSheet.create({
    footer: {
      backgroundColor: COLORS.background,
      paddingVertical: Platform.select({ ios: 10, android: 8, default: 10 }),
      paddingHorizontal: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: COLORS.outline,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 40,
    },
    companyName: {
      fontSize: SIZES.fontSm,
      color: COLORS.primary,
      textAlign: "center",
      writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
      ...FONTS.subheading,
    },
  });
};

export default React.memo(Footer);
