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
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEEEC',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  starButton: {
    padding: 2,
  },
  input: {
    minHeight: 96,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: ink,
    fontSize: typography.fontSize.sm,
    backgroundColor: colors.surface,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.55,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  historyTitle: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  feedbackItem: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEEEC',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  feedbackMeta: {
    color: muted,
    fontSize: typography.fontSize.xs,
    marginTop: 4,
  },
  feedbackComment: {
    color: ink,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: muted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
});
