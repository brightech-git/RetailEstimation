// Phase 2 – Design System
// Semantic color tokens — the single source of truth for color.
// Two palettes (light/dark) share the SAME keys, so components can switch
// theme without any conditional color logic.
//
// Values are derived from the app's existing palette so the look stays familiar.
// This does NOT migrate the old theme files — it is a new, standalone token set.

export interface ColorTokens {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;

  success: string;
  warning: string;
  danger: string;
  info: string;

  background: string;
  surface: string;
  border: string;
  divider: string;

  textPrimary: string;
  textSecondary: string;
  textDisabled: string;

  white: string;
  black: string;
  transparent: string;
  placeholder: string;
  overlay: string;
}

export const lightColors: ColorTokens = {
  primary: "#1C467C",
  primaryLight: "#6C8FBF",
  primaryDark: "#123256",
  secondary: "#3A6EA5",

  success: "#1B9721",
  warning: "#FFA000",
  danger: "#C62828",
  info: "#1565C0",

  background: "#FFFFFF",
  surface: "#F5F7FA",
  border: "#E5E5E5",
  divider: "#ECECEC",

  textPrimary: "#0D1B2A",
  textSecondary: "#4A4A4A",
  textDisabled: "#9AA0A6",

  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
  placeholder: "rgba(0,0,0,0.35)",
  overlay: "rgba(0,0,0,0.40)",
};

export const darkColors: ColorTokens = {
  primary: "#8CBBFF",
  primaryLight: "#B7D4FF",
  primaryDark: "#5E93E0",
  secondary: "#90CAF9",

  success: "#66BB6A",
  warning: "#FFB300",
  danger: "#EF5350",
  info: "#29B6F6",

  background: "#000000",
  surface: "#121212",
  border: "#2C2C2C",
  divider: "#1F1F1F",

  textPrimary: "#FFFFFF",
  textSecondary: "#BBBBBB",
  textDisabled: "#666666",

  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
  placeholder: "rgba(255,255,255,0.50)",
  overlay: "rgba(0,0,0,0.60)",
};
