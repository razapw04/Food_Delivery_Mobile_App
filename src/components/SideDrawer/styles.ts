import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../theme';

const ink = '#1A1A1A';
const muted = '#6B7280';
const pale = '#F5F5F5';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  panel: {
    width: '78%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },

  dismissArea: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  logo: {
    width: 92,
    height: 40,
  },

  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingBottom: spacing.xl,
  },

  profileSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },

  userName: {
    color: ink,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },

  userPhone: {
    color: muted,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },

  viewProfileButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewProfileText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },

  menuSection: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },

  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.inactive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  menuIconWrapDanger: {
    backgroundColor: '#FEE2E2',
  },

  menuItemLabel: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },

  menuItemLabelDanger: {
    color: colors.error,
  },
});
