import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; 
import { SafeAreaView } from "react-native-safe-area-context";
// You can change the icon library if you want

export default function CommonHeader({
  title = "Header",
  onLeftPress,
  onRightPress,
  leftIcon = "",
  rightIcon = "",
}) {
  return (
    <View style={styles.container}>
      {/* Left Icon */}
      <TouchableOpacity onPress={onLeftPress} style={styles.iconBox}>
        <Icon name={leftIcon} size={26} color="#000" />
      </TouchableOpacity>

      {/* Center Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right Icon */}
      <TouchableOpacity onPress={onRightPress} style={styles.iconBox}>
        <Icon name={rightIcon} size={26} color="#000" />
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
    backgroundColor: "#fff",
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
    color: "#000",
  },
});
