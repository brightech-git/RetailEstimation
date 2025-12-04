import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function CommonHeader({
  title = "Header",
  onLeftPress,
  onRightPress,
  leftIcon = "menu",
  rightIcon = "notifications",
  backgroundColor = "#fff", // new prop
  titleColor = "#000",      // optional
  iconColor = "#000",       // optional
}) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Left Icon */}
      <TouchableOpacity onPress={onLeftPress} style={styles.iconBox}>
        <Icon name={leftIcon} size={26} color={iconColor} />
      </TouchableOpacity>

      {/* Center Title */}
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>

      {/* Right Icon */}
      <TouchableOpacity onPress={onRightPress} style={styles.iconBox}>
        <Icon name={rightIcon} size={26} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  iconBox: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
});
