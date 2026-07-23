// Phase 4 – Shared Components
import type { StyleProp, ViewStyle } from "react-native";

export interface LoaderProps {
  size?: "small" | "large"; // default "large"
  color?: string; // default theme.colors.primary
  /** Fill the available space and center (default false = inline). */
  fullScreen?: boolean;
  /** Optional text under the spinner. */
  label?: string;
  style?: StyleProp<ViewStyle>;
}
