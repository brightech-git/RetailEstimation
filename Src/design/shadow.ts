// Phase 2 – Design System
// Cross-platform shadow presets. Each preset combines iOS shadow props with a
// matching Android `elevation`, so a single spread works on both platforms:
//   <View style={[styles.card, shadow.md]} />
import type { ViewStyle } from "react-native";
import { elevation } from "./elevation";

type ShadowStyle = Pick<
  ViewStyle,
  "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "elevation"
>;

export const shadow = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: elevation.none,
  },
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: elevation.sm,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: elevation.md,
  },
  lg: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: elevation.lg,
  },
} satisfies Record<string, ShadowStyle>;

export type Shadow = typeof shadow;
export type ShadowKey = keyof Shadow;
