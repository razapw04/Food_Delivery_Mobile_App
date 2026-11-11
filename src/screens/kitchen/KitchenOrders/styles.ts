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
  headerSide: {
    width: 40,
    height: 40,
  },
  logoutButton: {
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
    paddingBottom: 110,
    flexGrow: 1,
  },
  sectionHeading: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  orderCardMuted: {
    opacity: 0.92,
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
  channelMeta: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeConfirmed: {
    backgroundColor: '#E0E7FF',
  },
  statusBadgeOnTheWay: {
    backgroundColor: '#DBEAFE',
  },
  statusBadgePreparing: {
    backgroundColor: '#FFEDD5',
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  statusTextConfirmed: {
    color: '#4338CA',
  },
  statusTextOnTheWay: {
    color: '#1D4ED8',
  },
  statusTextPreparing: {
    color: colors.primary,
  },
  customerName: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
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
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  readOnlyNote: {
    color: muted,
    fontSize: typography.fontSize.xs,
    fontStyle: 'italic',
  },
});
