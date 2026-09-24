// 📁 src/Utills/Scalling.js
import { Dimensions, Platform, PixelRatio } from "react-native";

// The app rotates (portrait + landscape), so sizes are scaled against the
// device's short / long side rather than the current width / height. That
// keeps fonts, paddings and radii identical in both orientations; layout
// that should react to rotation uses useLayout() from Utills/Theme instead.
const { width, height } = Dimensions.get("window");
const shortSide = Math.min(width, height);
const longSide = Math.max(width, height);

// 🔍 Determine if device is a tablet (same answer in either orientation)
const isTablet = shortSide >= 600;

// ⚖️ Base guideline dimensions (portrait)
const guidelineBaseWidth = isTablet ? 834 : 375;   // iPad Air width vs iPhone
const guidelineBaseHeight = isTablet ? 1194 : 812; // iPad Air height vs iPhone X

// 🔹 Scalers
export const scale = (size) => (shortSide / guidelineBaseWidth) * size;
export const verticalScale = (size) => (longSide / guidelineBaseHeight) * size;

// Smooth scaling to avoid overshoot on tablets
export const moderateScale = (size, factor = isTablet ? 0.7 : 0.5) =>
  size + (scale(size) - size) * factor;

// Device info that does not change with rotation. For the current
// width / height / orientation use useLayout() from Utills/Theme.
export const DEVICE = {
  shortSide,
  longSide,
  isTablet,
  pixelRatio: PixelRatio.get(),
  platform: Platform.OS,
};
