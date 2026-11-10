import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../theme';

const ink = '#1A1A1A';
const muted = '#6B7280';

export const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  title: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: muted,
    fontSize: typography.fontSize.xs,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  block: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  blockEmphasize: {
    borderColor: colors.primary,
    backgroundColor: '#FFF7ED',
  },
  blockLabel: {
    color: muted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: 4,
  },
  blockToday: {
    color: ink,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  blockMeta: {
    color: muted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  blockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  blockSide: {
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
});
