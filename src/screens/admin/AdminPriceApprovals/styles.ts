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
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  banner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  bannerText: {
    color: '#9A3412',
    fontSize: typography.fontSize.xs,
    lineHeight: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: spacing.md,
    marginBottom: spacing.md,
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
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  oldPrice: {
    color: muted,
    fontSize: typography.fontSize.sm,
    textDecorationLine: 'line-through',
  },
  newPrice: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  suggestLabel: {
    color: muted,
    fontSize: 10,
    marginBottom: 2,
  },
  finalPriceText: {
    marginTop: spacing.sm,
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  finalLabel: {
    marginTop: spacing.md,
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  finalInput: {
    height: 44,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    color: ink,
    fontSize: typography.fontSize.sm,
    backgroundColor: colors.surface,
  },
  finalHint: {
    marginTop: spacing.xs,
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: pale,
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusApproved: {
    backgroundColor: '#DCFCE7',
  },
  statusRejected: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: ink,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rejectButton: {
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
  emptyWrap: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    color: ink,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: muted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: pale,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
