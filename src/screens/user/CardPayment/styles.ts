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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  body: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },
  amountCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  amountLabel: {
    color: muted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountValue: {
    marginTop: spacing.xs,
    color: colors.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  previewCard: {
    backgroundColor: '#202321',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  previewBrand: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    opacity: 0.85,
  },
  previewNumber: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    marginTop: spacing.lg,
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  previewMetaLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: typography.fontSize.xs,
    marginBottom: 2,
  },
  previewMetaValue: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
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
  inputError: {
    borderColor: colors.error,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfField: {
    flex: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  secureNoteText: {
    marginLeft: spacing.xs,
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: colors.background,
  },
  payButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
