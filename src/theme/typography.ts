import {moderateScale} from './responsive';

/**
 * Inter is used on both platforms as a legal SF Pro–like sans-serif.
 * (Apple SF Pro cannot be redistributed on Android.)
 */
export const fonts = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
} as const;

export const fontFamily = fonts.regular;

export const typography = {
  fontFamily,
  fonts,
  fontSize: {
    xs: moderateScale(11),
    sm: moderateScale(13),
    md: moderateScale(14),
    lg: moderateScale(17),
    xl: moderateScale(20),
    display: moderateScale(28),
  },
  lineHeight: {
    tight: moderateScale(18),
    normal: moderateScale(22),
    relaxed: moderateScale(28),
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  /** Cap OS font scaling so huge accessibility sizes don't break layouts. */
  maxFontSizeMultiplier: 1.35,
} as const;
