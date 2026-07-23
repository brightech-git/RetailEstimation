// Phase 2 – Design System
// Assembles the tokens into complete theme objects. Only `colors` differ
// between light and dark; spacing/typography/radius/shadow/elevation are shared.
import { lightColors, darkColors, type ColorTokens } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { radius } from "./radius";
import { shadow } from "./shadow";
import { elevation } from "./elevation";

export type ThemeMode = "light" | "dark";

export interface Theme {
  mode: ThemeMode;
  colors: ColorTokens;
  spacing: typeof spacing;
  typography: typeof typography;
  radius: typeof radius;
  shadow: typeof shadow;
  elevation: typeof elevation;
}

export const lightTheme: Theme = {
  mode: "light",
  colors: lightColors,
  spacing,
  typography,
  radius,
  shadow,
  elevation,
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: darkColors,
  spacing,
  typography,
  radius,
  shadow,
  elevation,
};

/** Default theme (light), matching the app's current default. */
export const theme: Theme = lightTheme;

/** Helper to pick a theme by mode. */
export const getTheme = (mode: ThemeMode): Theme =>
  mode === "dark" ? darkTheme : lightTheme;
