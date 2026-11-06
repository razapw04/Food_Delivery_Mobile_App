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
  locationBlock: {
    flex: 1,
    marginLeft: spacing.sm,
    justifyContent: 'center',
  },
  locationLabel: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
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
  listContent: {
    paddingHorizontal: 0,
    paddingTop: spacing.sm,
    paddingBottom: 140,
  },
  emptyScroll: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingBottom: spacing.xxl,
  },
  emptyHero: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.card,
  },
  emptyLogo: {
    width: 72,
    height: 72,
  },
  emptyText: {
    marginTop: spacing.sm,
    color: '#000000',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  suggestSection: {
    marginTop: spacing.md,
    backgroundColor: colors.background,
  },
  suggestTitle: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  suggestList: {
    paddingHorizontal: spacing.md,
  },
  suggestCard: {
    width: 240,
    marginRight: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEEEC',
    padding: spacing.sm,
  },
  suggestImage: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: pale,
  },
  suggestInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  suggestName: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  suggestDescription: {
    marginTop: 2,
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  suggestPrice: {
    marginTop: 4,
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  emptyExploreWrap: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  exploreMenuWrap: {
    width: 'auto',
    alignSelf: 'stretch',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  filledExploreMenuWrap: {
    marginHorizontal: spacing.md,
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
  card: {
    width: '100%',
    alignSelf: 'stretch',
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  image: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: pale,
  },
  details: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    marginRight: spacing.sm,
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  editButton: {
    paddingTop: 2,
  },
  editText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textDecorationLine: 'underline',
  },
  variationText: {
    marginTop: 2,
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  toppingText: {
    marginTop: 2,
    color: muted,
    fontSize: typography.fontSize.xs,
  },
  price: {
    marginTop: spacing.xs,
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  qtyRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    minWidth: 24,
    textAlign: 'center',
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  removeButton: {
    marginLeft: 'auto',
    padding: spacing.xs,
  },
});
