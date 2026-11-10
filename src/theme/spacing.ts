import {moderateScale} from './responsive';

/**
 * App spacing tokens — moderately scaled for small phones → tablets.
 * Prefer these over hard-coded paddings/margins.
 */
export const spacing = {
  none: 0,
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(48),
} as const;
