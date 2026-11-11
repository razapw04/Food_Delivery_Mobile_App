import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../theme';

const ink = '#1A1A1A';
const muted = '#6B7280';
const pale = '#F5F5F5';

export const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
    justifyContent: 'flex-end',
  },
  title: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    flexShrink: 0,
  },
  meta: {
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    maxWidth: 140,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF0F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  metaChipText: {
    color: muted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    flexShrink: 1,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF0F3',
    padding: spacing.md,
  },
  emptyText: {
    color: muted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  row: {
    paddingVertical: spacing.sm,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 6,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeTop: {
    backgroundColor: '#FFF4EC',
  },
  rankText: {
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  rankTextTop: {
    color: colors.primary,
  },
  name: {
    flex: 1,
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  units: {
    color: muted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  branchBlock: {
    marginTop: spacing.md,
  },
  branchBlockFirst: {
    marginTop: 0,
  },
  branchLabel: {
    color: muted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: spacing.xs,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: spacing.sm,
  },
  compactRank: {
    width: 20,
    color: muted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  compactName: {
    flex: 1,
    color: ink,
    fontSize: typography.fontSize.sm,
  },
  compactUnits: {
    color: muted,
    fontSize: typography.fontSize.xs,
  },
});
