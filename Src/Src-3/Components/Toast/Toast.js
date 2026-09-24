import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { useTheme } from "../../../Context/ThemeContext";
import { fontFor, SIZES } from "../../../Utills/Theme";

const ToastMessage = ({ visible, message, color, onHide }) => {
  const { theme } = useTheme();
  const { COLORS } = theme;
  const styles = getStyles(COLORS);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible && message) {
      // Slide in
      Animated.timing(slideAnim, {
        toValue: 20,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Stay for 2 seconds, then slide out
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onHide();
          });
        }, 2000);
      });
    } else {
      // Reset position when hidden
      slideAnim.setValue(-100);
    }
  }, [visible, message]);

  if (!visible || !message) return null;

  const backgroundColor =
    color === "red" ? COLORS.danger : color === "green" ? COLORS.success : color || COLORS.primary;

  return (
    <Animated.View 
      style={[
        styles.toastContainer, 
        { 
          backgroundColor,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.toastContent}>
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    borderRadius: 8,
    zIndex: 9999,
    elevation: 10,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  toastContent: {
    padding: 16,
    alignItems: "center",
  },
  toastText: {
    color: COLORS.buttonText,
    textAlign: "center",
    fontFamily: fontFor("600"),
    fontSize: SIZES.font,
  },
});

export default ToastMessage;