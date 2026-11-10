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
  adminNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  adminNavButton: {
    minWidth: '30%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
  },
  adminNavText: {
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 110,
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  orderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  printIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderId: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeConfirmed: {
    backgroundColor: '#E0E7FF',
  },
  statusBadgeDelivered: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeOnTheWay: {
    backgroundColor: '#DBEAFE',
  },
  statusBadgePreparing: {
    backgroundColor: '#FFEDD5',
  },
  statusBadgeCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  statusTextPending: {
    color: '#CA8A04',
  },
  statusTextConfirmed: {
    color: '#4338CA',
  },
  statusTextDelivered: {
    color: '#15803D',
  },
  statusTextOnTheWay: {
    color: '#1D4ED8',
  },
  statusTextPreparing: {
    color: colors.primary,
  },
  statusTextCancelled: {
    color: colors.error,
  },
  customerName: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  customerEmail: {
    color: muted,
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  orderDetails: {
    color: muted,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  metaText: {
    flex: 1,
    color: muted,
    fontSize: typography.fontSize.xs,
    marginRight: spacing.sm,
  },
  orderPrice: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  addressText: {
    color: muted,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
  actionsWrap: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: spacing.sm,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  statusLabel: {
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: pale,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipDisabled: {
    opacity: 0.4,
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  chipText: {
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipTextDisabled: {
    color: '#9CA3AF',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
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
});
