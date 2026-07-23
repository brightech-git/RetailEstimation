// Phase 4 – Shared Components
import type { ComponentProps } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { Ionicons } from "@expo/vector-icons";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  /** Optional right-side action icon (Ionicons name). */
  rightIcon?: IoniconName;
  onRightPress?: () => void;
  style?: StyleProp<ViewStyle>;
}
