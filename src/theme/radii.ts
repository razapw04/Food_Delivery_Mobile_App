import {moderateScale} from './responsive';

export const radii = {
  sm: moderateScale(4),
  md: moderateScale(8),
  lg: moderateScale(16),
  pill: 999,
} as const;
