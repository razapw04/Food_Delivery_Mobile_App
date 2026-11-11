import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../theme';

const ink = '#1A1A1A';
const muted = '#6B7280';
const pale = '#F5F5F5';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  panelWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.card,
    shadowColor: '#000000',
    shadowOffset: {width: 4, height: 0},
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },

  panel: {
    flex: 1,
    backgroundColor: colors.card,
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
    paddingVertical: spacing.sm,
    minHeight: 48,
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

  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },

  content: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },

  contactFooter: {
    marginTop: 'auto',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  contactButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  contactButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },

  profileSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
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
    borderRadius: 12,
    paddingVertical: spacing.sm + 2,
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
