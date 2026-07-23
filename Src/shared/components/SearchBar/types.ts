// Phase 4 – Shared Components
import type { StyleProp, ViewStyle } from "react-native";

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string; // default "Search..."
  /** Show a clear (x) button when there is text. */
  onClear?: () => void;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}
