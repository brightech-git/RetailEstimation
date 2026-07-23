// Phase 4 – Shared Components
// Reusable labeled text input with optional required marker and error message.
// UI only — no business logic. Passes through all standard TextInput props.
import React from "react";
import { View, Text, TextInput } from "react-native";
import { theme } from "@design";
import { makeStyles } from "./styles";
import type { InputProps } from "./types";

const styles = makeStyles(theme);

export const Input: React.FC<InputProps> = ({
  label,
  error,
  required = false,
  disabled = false,
  containerStyle,
  style,
  editable,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      <TextInput
        editable={editable ?? !disabled}
        placeholderTextColor={theme.colors.placeholder}
        style={[
          styles.field,
          !!error && styles.fieldError,
          disabled && styles.fieldDisabled,
          style,
        ]}
        {...rest}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default Input;
