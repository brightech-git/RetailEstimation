import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../../Context/ThemeContext"; // Adjust path as needed
import { createFooterStyles } from "./FooterStyles"; // Adjust path as needed

const Footer = ({
  companyName = "© 2026 Brightech Software Services Pvt Ltd",
  style,
  testID = "footer-component",
}) => {
  const { theme } = useTheme();
  const styles = createFooterStyles(theme);
  const navigation = useNavigation();

  return (
    <>
      {/* Footer Text */}
      <View
        style={[styles.footer, style]}
        testID={testID}
        accessible={true}
        accessibilityLabel="App footer"
      >
        <Text style={styles.companyName}>{companyName}</Text>
      </View>

      {/* Floating Home Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: theme.COLORS.primary,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 5,
        }}
        onPress={() => navigation.navigate("Home")} // Replace with your target page name
      >
        <Icon name="home" size={28} color="#fff" />
      </TouchableOpacity>
    </>
  );
};

export default React.memo(Footer);
