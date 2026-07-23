// Phase 4 – Shared Components
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { Edge } from "react-native-safe-area-context";

export interface ScreenContainerProps {
  children: ReactNode;
  /** Apply horizontal + vertical padding (default true). */
  padded?: boolean;
  /** Override background (default theme.colors.background). */
  backgroundColor?: string;
  /** Wrap in KeyboardAvoidingView (default false). */
  keyboardAvoiding?: boolean;
  /** Safe-area edges to apply (default top/bottom/left/right). */
  edges?: readonly Edge[];
  style?: StyleProp<ViewStyle>;
}
