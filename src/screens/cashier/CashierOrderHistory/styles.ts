import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../../theme';

const ink = '#1A1A1A';
const muted = '#6B7280';
const pale = '#F5F5F5';
const line = '#F0F0F0';

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
  channelTabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  channelTab: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: line,
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
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  channelTabTextActive: {
    color: colors.primary,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 120,
    flexGrow: 1,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: line,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  customerName: {
    flex: 1,
    color: ink,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  topActions: {
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
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgePending: {backgroundColor: '#FEF3C7'},
  statusBadgeConfirmed: {backgroundColor: '#E0E7FF'},
  statusBadgeDelivered: {backgroundColor: '#DCFCE7'},
  statusBadgeOnTheWay: {backgroundColor: '#DBEAFE'},
  statusBadgePreparing: {backgroundColor: '#FFEDD5'},
  statusBadgeCancelled: {backgroundColor: '#FEE2E2'},
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  statusTextPending: {color: '#CA8A04'},
  statusTextConfirmed: {color: '#4338CA'},
  statusTextDelivered: {color: '#15803D'},
  statusTextOnTheWay: {color: '#1D4ED8'},
  statusTextPreparing: {color: colors.primary},
  statusTextCancelled: {color: colors.error},
  orderId: {
    marginTop: 4,
    color: muted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  infoBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: pale,
  },
  infoBadgePos: {
    backgroundColor: '#FFEDD5',
  },
  infoBadgeText: {
    color: muted,
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
  },
  infoBadgeTextPos: {
    color: '#9A3412',
  },
  section: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: line,
  },
  sectionTitle: {
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: 4,
  },
  metaLabel: {
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  metaValue: {
    flex: 1,
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'right',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  itemMeta: {
    marginTop: 2,
    color: muted,
    fontSize: 11,
  },
  itemPrice: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  totalRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  totalValue: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  noteText: {
    marginTop: spacing.xs,
    color: muted,
    fontSize: typography.fontSize.xs,
    lineHeight: 16,
  },
});
