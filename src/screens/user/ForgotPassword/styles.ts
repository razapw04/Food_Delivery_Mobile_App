import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../../theme';

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
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    marginBottom: spacing.lg,
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
    lineHeight: 20,
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
