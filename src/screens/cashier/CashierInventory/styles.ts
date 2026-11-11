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
  statusAwaiting: {backgroundColor: '#FFEDD5'},
  statusArranged: {backgroundColor: '#DCFCE7'},
  statusText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  statusTextAwaiting: {color: '#C2410C'},
  statusTextArranged: {color: '#15803D'},
  cashRow: {
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  cashLabel: {
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  cashInput: {
    borderWidth: 1,
    borderColor: '#EEF0F3',
    borderRadius: 12,
    backgroundColor: pale,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: ink,
    fontSize: typography.fontSize.md,
  },
  arrangeButton: {
    marginTop: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  arrangeButtonText: {
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
