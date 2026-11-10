import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../../theme';

const ink = '#1A1A1A';
const muted = '#6B7280';
const pale = '#F5F5F5';

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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: pale,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: ink,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  productName: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  meta: {
    color: muted,
    fontSize: typography.fontSize.sm,
    marginTop: 4,
  },
  currentPrice: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.sm,
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
    marginBottom: spacing.sm,
    color: ink,
    fontSize: typography.fontSize.sm,
    backgroundColor: colors.surface,
  },
  hint: {
    color: muted,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.lg,
  },
  banner: {
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    marginBottom: spacing.lg,
  },
  bannerText: {
    color: '#9A3412',
    fontSize: typography.fontSize.xs,
    lineHeight: 16,
  },
  saveButton: {
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
