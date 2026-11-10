import {StyleSheet} from 'react-native';
import {
  colors,
  getContentMaxWidth,
  moderateScale,
  spacing,
  typography,
} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: getContentMaxWidth(),
    paddingHorizontal: spacing.lg,
    paddingTop: moderateScale(42),
    paddingBottom: spacing.md,
  },

  image: {
    width: moderateScale(240),
    height: moderateScale(292),
    maxWidth: '80%',
    borderRadius: moderateScale(8),
  },

  title: {
    marginTop: moderateScale(28),
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    color: '#111111',
    paddingHorizontal: spacing.sm,
  },

  description: {
    marginTop: spacing.sm,
    maxWidth: Math.min(getContentMaxWidth(), 420),
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },

  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: moderateScale(28),
  },

  dot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: colors.inactive,
  },

  activeDot: {
    width: moderateScale(24),
    backgroundColor: colors.primary,
  },

  skipButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },

  skipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: '#666666',
  },
});
