// Phase 2 – Design System
// Typography presets built on the fonts ALREADY loaded by App.js
// (TrajanPro, TrajanProBold, DMSerif, DancingScript, Domine, Fancy).
// This file does NOT change font loading — it only references font families
// by the names App.js registered.
import type { TextStyle } from "react-native";

/** Font family names, exactly as registered in App.js useFonts(). */
export const fontFamily = {
  displayBold: "TrajanProBold",
  display: "TrajanPro",
  serif: "DMSerif",
  script: "DancingScript",
  body: "Domine",
  fancy: "Fancy",
} as const;

export interface TypographyVariants {
  display: TextStyle;
  heading: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  button: TextStyle;
  label: TextStyle;
}

export const typography: TypographyVariants = {
  display: { fontFamily: fontFamily.displayBold, fontSize: 32, lineHeight: 40 },
  heading: { fontFamily: fontFamily.displayBold, fontSize: 24, lineHeight: 32 },
  title: { fontFamily: fontFamily.serif, fontSize: 20, lineHeight: 28 },
  subtitle: { fontFamily: fontFamily.serif, fontSize: 16, lineHeight: 24 },
  body: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fontFamily.body, fontSize: 12, lineHeight: 16 },
  button: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 20, fontWeight: "600" },
  label: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 18 },
};

export type TypographyKey = keyof TypographyVariants;
