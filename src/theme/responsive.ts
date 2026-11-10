import {Dimensions, PixelRatio} from 'react-native';

/** Design baseline (iPhone 11 / common RN mock width). */
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/** Avoid oversized UI on tablets / foldables. */
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.2;

export type DeviceType = 'phone' | 'phablet' | 'tablet';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getWindow = () => Dimensions.get('window');

/** Use the shorter side so landscape phones don't explode horizontal scale. */
export const getScaleWidth = () => {
  const {width, height} = getWindow();
  return Math.min(width, height);
};

export const getScaleHeight = () => {
  const {width, height} = getWindow();
  return Math.max(width, height);
};

export const getWidthScale = () =>
  clamp(getScaleWidth() / BASE_WIDTH, MIN_SCALE, MAX_SCALE);

export const getHeightScale = () =>
  clamp(getScaleHeight() / BASE_HEIGHT, MIN_SCALE, MAX_SCALE);

/** Horizontal scale from design px → device px. */
export const scale = (size: number): number =>
  PixelRatio.roundToNearestPixel(size * getWidthScale());

/** Vertical scale (useful for heights / vertical gaps). */
export const verticalScale = (size: number): number =>
  PixelRatio.roundToNearestPixel(size * getHeightScale());

/**
 * Moderate scale — prefers design size, gently follows screen size.
 * Best default for fonts, icons, radii, and paddings.
 */
export const moderateScale = (size: number, factor = 0.45): number =>
  PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor);

/** Width percentage of current window. */
export const wp = (percent: number): number => {
  const {width} = getWindow();
  return PixelRatio.roundToNearestPixel((width * percent) / 100);
};

/** Height percentage of current window. */
export const hp = (percent: number): number => {
  const {height} = getWindow();
  return PixelRatio.roundToNearestPixel((height * percent) / 100);
};

export const getDeviceType = (): DeviceType => {
  const shortSide = getScaleWidth();
  if (shortSide >= 768) {
    return 'tablet';
  }
  if (shortSide >= 414) {
    return 'phablet';
  }
  return 'phone';
};

export const isTablet = (): boolean => getDeviceType() === 'tablet';

/** Readable content column on large screens. */
export const getContentMaxWidth = (): number => {
  const type = getDeviceType();
  if (type === 'tablet') {
    return 720;
  }
  if (type === 'phablet') {
    return 560;
  }
  return getWindow().width;
};

export const getScreenHorizontalPadding = (): number => {
  if (isTablet()) {
    return moderateScale(32);
  }
  return moderateScale(24);
};

export const getCardWidth = (horizontalPadding?: number): number => {
  const pad = horizontalPadding ?? getScreenHorizontalPadding();
  const {width} = getWindow();
  const usable = Math.min(width, getContentMaxWidth()) - pad * 2;
  return Math.max(usable, 260);
};
