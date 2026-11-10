import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../../theme';

const ink = '#202321';
const muted = '#858B87';
const pale = '#F2F3F1';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    marginLeft: spacing.sm,
    color: ink,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEEEC',
    padding: spacing.sm,
    marginBottom: spacing.md,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: pale,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  name: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  description: {
    marginTop: 4,
    color: muted,
    fontSize: typography.fontSize.sm,
  },
  price: {
    marginTop: 6,
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: ink,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: spacing.xs,
    color: muted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
});
