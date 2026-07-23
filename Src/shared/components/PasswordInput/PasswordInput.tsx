// Phase 4 – Shared Components
// Password field with show/hide toggle. UI only.
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@design";
import { makeStyles } from "./styles";
import type { PasswordInputProps } from "./types";

const styles = makeStyles(theme);

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  required = false,
  disabled = false,
  containerStyle,
  style,
  editable,
  ...rest
}) => {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      <View
        style={[
          styles.fieldRow,
          !!error && styles.fieldRowError,
          disabled && styles.fieldRowDisabled,
        ]}
      >
        <TextInput
          secureTextEntry={hidden}
          editable={editable ?? !disabled}
          placeholderTextColor={theme.colors.placeholder}
          style={[styles.field, style]}
          {...rest}
        />
        <TouchableOpacity
          onPress={() => setHidden((v) => !v)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.toggle}
        >
          <Ionicons
            name={hidden ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default PasswordInput;
