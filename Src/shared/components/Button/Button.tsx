// Phase 4 – Shared Components
// Reusable button. Variants: primary | secondary | outline. Supports disabled
// and loading. UI only — no navigation, no API, no business logic.
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { theme } from "@design";
import { makeStyles } from "./styles";
import type { ButtonProps } from "./types";

const styles = makeStyles(theme);

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const isOutline = variant === "outline";
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isOutline ? theme.colors.primary : theme.colors.white}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline ? styles.textOnOutline : styles.textOnFilled,
            textStyle,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
