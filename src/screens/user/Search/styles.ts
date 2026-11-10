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
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
  },
  topRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBlock: {
    flex: 1,
    marginLeft: spacing.sm,
    justifyContent: 'center',
  },
  locationLabel: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  locationAddress: {
    color: '#9CA3AF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginTop: 1,
  },
  searchWrap: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchBar: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEEEC',
    backgroundColor: pale,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 6,
    color: ink,
    fontSize: typography.fontSize.sm,
  },
  clearButton: {
    marginLeft: spacing.sm,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  keywordList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  keywordCard: {
    minWidth: 72,
    height: 36,
    paddingHorizontal: spacing.sm + 2,
    marginRight: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEEEC',
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keywordText: {
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  exploreMenuWrap: {
    width: 'auto',
    alignSelf: 'stretch',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  exploreMenuRow: {
    width: '100%',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
  },
  exploreMenuCopy: {
    flex: 1,
    marginRight: spacing.sm,
  },
  exploreMenuText: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  exploreMenuDescription: {
    marginTop: 2,
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  restaurantList: {
    paddingHorizontal: spacing.md,
  },
  restaurantCard: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    padding: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEEEC',
    backgroundColor: colors.card,
  },
  restaurantImage: {
    width: 48,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#E6E8E6',
  },
  restaurantDetails: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  restaurantName: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingIcon: {
    color: colors.primary,
  },
  ratingText: {
    marginLeft: 4,
    color: muted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  emptyState: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyLogo: {
    width: 56,
    height: 56,
  },
  emptyStateText: {
    color: muted,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});
