import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../theme';

const ink = '#202321';
const muted = '#858B87';
const pale = '#F2F3F1';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    marginBottom: spacing.md,
  },
  topRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  title: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  cartButton: {
    backgroundColor: ink,
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
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
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
  },
  keywordList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  keywordCard: {
    width: 86,
    height: 46,
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
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
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
    backgroundColor: '#FFFFFF',
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
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    color: muted,
    fontSize: typography.fontSize.sm,
  },
});