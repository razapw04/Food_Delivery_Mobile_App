import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../../theme';

const ink = '#202321';
const muted = '#858B87';
const pale = '#F2F3F1';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    marginLeft: spacing.sm,
    color: ink,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFE1CE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: typography.fontWeight.bold,
  },
  emailText: {
    color: muted,
    fontSize: typography.fontSize.sm,
  },
  label: {
    color: ink,
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
    color: ink,
    fontSize: typography.fontSize.sm,
    backgroundColor: colors.surface,
  },
  inputDisabled: {
    backgroundColor: pale,
    color: muted,
  },
  hint: {
    color: muted,
    fontSize: typography.fontSize.xs,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  saveButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.55,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
});
