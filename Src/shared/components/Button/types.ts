// Phase 4 – Shared Components
import type { StyleProp, ViewStyle, TextStyle } from "react-native";

export type ButtonVariant = "primary" | "secondary" | "outline";

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant; // default "primary"
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}
