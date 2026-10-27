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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  locationAddress: {
    color: '#9CA3AF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
  },

  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: pale,
  },

  categoriesSection: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  categoriesRow: {
    paddingHorizontal: spacing.md,
  },

  categoryItem: {
    width: 78,
    alignItems: 'center',
    marginRight: spacing.md,
  },

  categoryImageWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },

  categoryNameActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },

  listContent: {
    padding: spacing.lg,
    paddingBottom: 110,
  },

  listContentWithCartFooter: {
    paddingBottom: 150,
  },

  sectionHeader: {
    height: 52,
    justifyContent: 'center',
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },

  emptyText: {
    color: muted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.xl,
  },

  itemCard: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  itemImageWrap: {
    width: 88,
    height: 88,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: pale,
  },

  itemImage: {
    width: '100%',
    height: '100%',
  },

  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  itemName: {
    flex: 1,
    color: ink,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.sm,
  },

  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemDescription: {
    color: muted,
    fontSize: typography.fontSize.sm,
    marginTop: 4,
    lineHeight: 20,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  itemPrice: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },

  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
