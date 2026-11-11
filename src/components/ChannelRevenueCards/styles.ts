import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../theme';

const ink = '#1A1A1A';
const muted = '#6B7280';

export const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  hint: {
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  block: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF0F3',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    minHeight: 96,
  },
  blockEmphasize: {
    borderColor: '#EEF0F3',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 3,
    borderTopColor: colors.primary,
  },
  blockLabel: {
    color: muted,
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  blockLabelEmphasize: {
    color: colors.primary,
  },
  blockValue: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  blockValueEmphasize: {
    color: ink,
  },
  blockMeta: {
    color: muted,
    fontSize: 10,
    marginTop: 4,
  },
});
