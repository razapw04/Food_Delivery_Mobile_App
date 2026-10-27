import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../theme';

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
    marginRight: 40,
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

  orderBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  orderImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: pale,
  },

  orderInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  orderTitle: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },

  orderDetails: {
    color: muted,
    fontSize: typography.fontSize.sm,
    marginTop: 4,
    lineHeight: 18,
  },

  orderMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },

  orderMeta: {
    color: muted,
    fontSize: typography.fontSize.xs,
  },

  orderPrice: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
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
