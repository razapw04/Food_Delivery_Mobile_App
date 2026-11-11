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
  banner: {
    marginHorizontal: spacing.md,
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
    lineHeight: 18,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF0F3',
  },
  chipActive: {
    backgroundColor: '#FFF4EC',
    borderColor: colors.primary,
  },
  chipText: {
    color: muted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: colors.primary,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 40,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF0F3',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  itemName: {
    flex: 1,
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  meta: {
    marginTop: 4,
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusPending: {backgroundColor: '#FFEDD5'},
  statusApproved: {backgroundColor: '#DBEAFE'},
  statusArranged: {backgroundColor: '#DCFCE7'},
  statusRejected: {backgroundColor: '#FEE2E2'},
  statusText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  statusTextPending: {color: '#C2410C'},
  statusTextApproved: {color: '#1D4ED8'},
  statusTextArranged: {color: '#15803D'},
  statusTextRejected: {color: '#B91C1C'},
  priorityBadge: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  priorityLow: {backgroundColor: '#FEE2E2'},
  priorityMedium: {backgroundColor: '#FFEDD5'},
  priorityHigh: {backgroundColor: '#DCFCE7'},
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  priorityTextLow: {color: '#B91C1C'},
  priorityTextMedium: {color: '#C2410C'},
  priorityTextHigh: {color: '#15803D'},
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  rejectButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    paddingVertical: 10,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#B91C1C',
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  approveButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  emptyWrap: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    color: muted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
});
