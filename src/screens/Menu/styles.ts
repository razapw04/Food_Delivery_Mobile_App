import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../theme';

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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: pale,
  },

  locationBlock: {
    flex: 1,
    marginHorizontal: spacing.sm,
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

  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: pale,
  },

  categoriesSection: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  categoriesRow: {
    paddingHorizontal: spacing.md,
  },

  categoryItem: {
    width: 64,
    alignItems: 'center',
    marginRight: spacing.sm,
  },

  categoryImageWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: pale,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: spacing.xs,
  },

  categoryImageWrapActive: {
    borderColor: colors.primary,
  },

  categoryImage: {
    width: '100%',
    height: '100%',
  },

  categoryName: {
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },

  categoryNameActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },

  listContent: {
    paddingHorizontal: 0,
    paddingTop: spacing.sm,
    paddingBottom: 100,
  },

  listContentWithCartFooter: {
    paddingBottom: 140,
  },

  sectionHeader: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    width: '100%',
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },

  emptyText: {
    color: muted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.lg,
  },

  itemCard: {
    width: '100%',
    alignSelf: 'stretch',
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  itemImageWrap: {
    width: 68,
    height: 68,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: pale,
  },

  itemImage: {
    width: '100%',
    height: '100%',
  },

  itemInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  itemName: {
    flex: 1,
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.sm,
  },

  favoriteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemDescription: {
    color: muted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
    lineHeight: 16,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  itemPrice: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },

  addButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
