import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../theme';

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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },

  logo: {
    width: 100,
    height: 46,
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
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    color: '#202321',
    fontSize: typography.fontSize.sm,
    backgroundColor: colors.surface,
  },

  inputError: {
    borderColor: colors.error,
  },

  fieldErrorText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.md,
  },

  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },

  buttonWrap: {
    alignItems: 'center',
    marginTop: spacing.sm,
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
