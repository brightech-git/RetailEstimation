import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useTheme } from '../../../Context/ThemeContext';
import { fontFor, SIZES, LAYOUT } from "../../../Utills/Theme";

const { width } = Dimensions.get('window');

const Toast = ({ visible, message, type = 'info', duration = 3000, onHide }) => {
  const { theme } = useTheme();
  const { COLORS, FONTS, SIZES } = theme;
  const styles = getStyles(COLORS);
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: -100,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) onHide();
    });
  };

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: COLORS.success,
          borderColor: COLORS.success,
        };
      case 'error':
        return {
          backgroundColor: COLORS.danger,
          borderColor: COLORS.danger,
        };
      case 'warning':
        return {
          backgroundColor: COLORS.warning,
          borderColor: COLORS.warning,
          
        };
      case 'info':
      default:
        return {
          backgroundColor: COLORS.primary,
          borderColor: COLORS.secondary,
          color: COLORS.white,
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={hideToast}
        style={[styles.toast, getToastStyle()]}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{getIcon()}</Text>
        </View>
        <Text style={[FONTS.font, styles.message]} numberOfLines={2}>
          {message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const getStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 50 : 40,
      left: 20,
      right: 20,
      zIndex: 9999,
      alignItems: 'center',
    },
    toast: {
      width: width - 40,
      maxWidth: LAYOUT.toastMaxWidth,
      minHeight: 60,
      borderRadius: SIZES.radius,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: COLORS.shadowDark,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: COLORS.onPrimaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    icon: {
      fontSize: SIZES.h5,
      color: COLORS.buttonText,
      fontFamily: fontFor('bold'),
    },
    message: {
      flex: 1,
      color: COLORS.buttonText,
      fontSize: SIZES.font,
      lineHeight: 20,
      fontFamily: fontFor(),
    },
  });

export default Toast;
