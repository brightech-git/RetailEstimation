// Phase 4 – Shared Components
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface CardProps {
  children: ReactNode;
  /** Apply inner padding (default true). */
  padded?: boolean;
  /** Shadow depth (default "sm"). */
  shadow?: "none" | "sm" | "md" | "lg";
  style?: StyleProp<ViewStyle>;
}
