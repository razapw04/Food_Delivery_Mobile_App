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
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
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
  cartMeta: {
    color: muted,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEEEC',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFF8F3',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  code: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  valueBadge: {
    backgroundColor: '#FFE1CE',
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  valueBadgeText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  title: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  description: {
    marginTop: 4,
    color: muted,
    fontSize: typography.fontSize.sm,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  applyButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    opacity: 0.45,
  },
  removeButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  lockedHint: {
    marginTop: spacing.sm,
    color: muted,
    fontSize: typography.fontSize.xs,
  },
});
