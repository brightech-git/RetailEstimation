// Phase 4 – Shared Components
import type { StyleProp, ViewStyle, TextInputProps } from "react-native";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}
