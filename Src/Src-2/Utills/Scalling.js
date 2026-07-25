import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const isTablet = Math.min(width, height) >= 600;

const guidelineBaseWidth = isTablet ? 834 : 375;
const guidelineBaseHeight = isTablet ? 1194 : 812;

export const scale = (size) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = isTablet ? 0.7 : 0.5) =>
  size + (scale(size) - size) * factor;

export const DEVICE = {
  width,
  height,
  isTablet,
  isLandscape: width > height,
  pixelRatio: PixelRatio.get(),
  platform: Platform.OS,
};
