// Phase 4 – Shared Components
import type { StyleProp, ViewStyle, TextInputProps } from "react-native";

// Same surface as Input, minus secureTextEntry (managed internally).
export interface PasswordInputProps extends Omit<TextInputProps, "secureTextEntry"> {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}
