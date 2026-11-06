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
    xs: 11,
    sm: 13,
    md: 14,
    lg: 17,
    xl: 20,
    display: 28,
  },
  lineHeight: {
    tight: 18,
    normal: 22,
    relaxed: 28,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;
