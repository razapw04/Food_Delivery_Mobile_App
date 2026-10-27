import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../theme';

const ink = '#202321';
const muted = '#858B87';
const pale = '#F2F3F1';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  topRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  locationAddress: {
    color: '#9CA3AF',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
  },
  searchWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  searchBar: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECEEEC',
    backgroundColor: pale,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    color: ink,
    fontSize: typography.fontSize.sm,
  },
  clearButton: {
    marginLeft: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    color: ink,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  keywordList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  keywordCard: {
    minWidth: 86,
    height: 46,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEEEC',
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keywordText: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  exploreMenuWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 16,
    borderTopWidth: 1,
    borderColor: '#ECEEEC',
    backgroundColor: colors.card,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  exploreMenuRow: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
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
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  exploreMenuDescription: {
    marginTop: 4,
    color: muted,
    fontSize: typography.fontSize.sm,
  },
  restaurantList: {
    paddingHorizontal: spacing.lg,
  },
  restaurantCard: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    padding: spacing.xs,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEEEC',
    backgroundColor: colors.card,
  },
  restaurantImage: {
    width: 60,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E6E8E6',
  },
  restaurantDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  restaurantName: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyLogo: {
    width: 72,
    height: 72,
  },
  emptyStateText: {
    color: muted,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});