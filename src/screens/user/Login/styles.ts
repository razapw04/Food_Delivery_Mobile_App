import {StyleSheet} from 'react-native';
import {
  colors,
  getContentMaxWidth,
  moderateScale,
  spacing,
  typography,
} from '../../../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  flex: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    width: '100%',
    maxWidth: getContentMaxWidth(),
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },

  logo: {
    width: moderateScale(100),
    height: moderateScale(46),
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },

  title: {
    color: '#202321',
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },

  subtitle: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xl,
  },

  label: {
    color: '#202321',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    color: '#202321',
    fontSize: typography.fontSize.sm,
    backgroundColor: colors.surface,
  },

  passwordWrap: {
    position: 'relative',
    marginBottom: spacing.md,
  },

  passwordInput: {
    marginBottom: 0,
    paddingRight: 44,
  },

  eyeButton: {
    position: 'absolute',
    right: 4,
    top: 0,
    height: 44,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.md,
  },

  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  rememberWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  rememberText: {
    color: '#202321',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },

  forgotWrap: {
    alignSelf: 'flex-end',
  },

  forgotText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },

  buttonWrap: {
    width: '100%',
    marginTop: spacing.sm,
  },

  fullWidthButton: {
    width: '100%',
    alignSelf: 'stretch',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  footerText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
  },

  footerLink: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
