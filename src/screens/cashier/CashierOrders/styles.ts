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
  staffNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  staffNavButton: {
    minWidth: '40%',
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
  staffNavButtonActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFF7ED',
  },
  staffNavText: {
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  channelTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  channelTab: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    alignItems: 'center',
  },
  channelTabActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFF7ED',
  },
  channelTabText: {
    color: muted,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  channelTabTextActive: {
    color: colors.primary,
  },
  channelBadge: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
  },
  channelBadgePos: {
    backgroundColor: '#FFEDD5',
  },
  channelBadgeText: {
    color: '#3730A3',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  channelBadgeTextPos: {
    color: '#9A3412',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 110,
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  orderCardPriorityLow: {
    borderColor: '#E5E7EB',
  },
  orderCardPriorityNormal: {
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
  },
  orderCardPriorityHigh: {
    borderColor: '#FB923C',
    backgroundColor: '#FFF7ED',
  },
  orderCardPriorityUrgent: {
    borderColor: '#F87171',
    backgroundColor: '#FEF2F2',
  },
  briefTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  briefLeft: {
    flex: 1.1,
    minWidth: 0,
  },
  briefCenter: {
    flex: 1.05,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  orderTimeBold: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  orderTimeCaption: {
    marginTop: 1,
    color: muted,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  priorityBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  priorityBadgeLow: {
    backgroundColor: '#F3F4F6',
  },
  priorityBadgeNormal: {
    backgroundColor: '#FEF3C7',
  },
  priorityBadgeHigh: {
    backgroundColor: '#FFEDD5',
  },
  priorityBadgeUrgent: {
    backgroundColor: '#FEE2E2',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  priorityTextLow: {
    color: '#6B7280',
  },
  priorityTextNormal: {
    color: '#B45309',
  },
  priorityTextHigh: {
    color: '#C2410C',
  },
  priorityTextUrgent: {
    color: '#B91C1C',
  },
  briefRight: {
    flex: 0.85,
    alignItems: 'flex-end',
    gap: 4,
  },
  briefMeta: {
    marginTop: 2,
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  activeLabel: {
    color: '#15803D',
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  channelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  channelDotPos: {
    backgroundColor: '#F97316',
  },
  channelDotOnline: {
    backgroundColor: '#6366F1',
  },
  briefActions: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  briefConfirmFull: {
    flex: 1,
    marginBottom: 0,
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
  orderPrice: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
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
  tabActionButton: {
    flex: 1,
    marginBottom: 0,
  },
  closeTabButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  closeTabButtonText: {
    color: '#C74440',
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
});
