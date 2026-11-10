import {
  getContentMaxWidth,
  getScreenHorizontalPadding,
  moderateScale,
} from './responsive';
import {spacing} from './spacing';

export const layout = {
  get screenHorizontalPadding() {
    return getScreenHorizontalPadding();
  },
  get contentMaxWidth() {
    return getContentMaxWidth();
  },
  minTouchTarget: moderateScale(44),
  buttonHeight: moderateScale(48),
  buttonWidth: '90%' as const,
  inputHeight: moderateScale(44),
  iconSize: {
    sm: moderateScale(16),
    md: moderateScale(24),
    lg: moderateScale(32),
  },
  /** Keep legacy static padding close to previous designs. */
  screenPaddingFallback: spacing.lg,
} as const;
