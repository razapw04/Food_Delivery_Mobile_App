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
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    display: 32,
  },
  lineHeight: {
    tight: 20,
    normal: 24,
    relaxed: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;
