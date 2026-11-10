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
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: spacing.md,
  },
  statLabel: {
    color: muted,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.xs,
  },
  statValue: {
    color: ink,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  sectionTitle: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  saleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  saleRowLast: {
    borderBottomWidth: 0,
  },
  saleLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  saleTitle: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  saleMeta: {
    color: muted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  saleAmount: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  topName: {
    flex: 1,
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  topUnits: {
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  chartsWrap: {
    marginBottom: spacing.sm,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  chartTitle: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  pieWrap: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pieCenter: {
    alignItems: 'center',
  },
  pieCenterLabel: {
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  pieCenterValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  pieExpenseBlock: {
    alignItems: 'flex-end',
  },
  hBarLabel: {
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  hBarValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  expenseValue: {
    color: '#DC2626',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  incomeValue: {
    color: '#16A34A',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});
