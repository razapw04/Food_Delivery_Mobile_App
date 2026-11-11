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
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  segmentChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF0F3',
  },
  segmentChipActive: {
    backgroundColor: '#FFF4EC',
    borderColor: colors.primary,
  },
  segmentChipText: {
    color: muted,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  segmentChipTextActive: {
    color: colors.primary,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 120,
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
  qtyText: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  meta: {
    marginTop: 4,
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  priorityBadge: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  priorityLow: {
    backgroundColor: '#FEE2E2',
  },
  priorityMedium: {
    backgroundColor: '#FFEDD5',
  },
  priorityHigh: {
    backgroundColor: '#DCFCE7',
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  priorityTextLow: {
    color: '#B91C1C',
  },
  priorityTextMedium: {
    color: '#C2410C',
  },
  priorityTextHigh: {
    color: '#15803D',
  },
  stockActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  useButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    paddingVertical: 10,
    alignItems: 'center',
  },
  useButtonText: {
    color: '#B91C1C',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  requestButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusPending: {backgroundColor: '#FFEDD5'},
  statusApproved: {backgroundColor: '#DCFCE7'},
  statusRejected: {backgroundColor: '#FEE2E2'},
  statusText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  statusTextPending: {color: '#C2410C'},
  statusTextApproved: {color: '#15803D'},
  statusTextRejected: {color: '#B91C1C'},
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  modalTitle: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  modalMeta: {
    color: muted,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.md,
  },
  inputLabel: {
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#EEF0F3',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: ink,
    marginBottom: spacing.md,
    backgroundColor: '#FAFAFA',
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalCancel: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF0F3',
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: ink,
    fontWeight: typography.fontWeight.semibold,
  },
  modalSubmit: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.bold,
  },
});
