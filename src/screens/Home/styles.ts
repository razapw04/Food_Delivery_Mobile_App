import {Dimensions, StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../theme';

const {width: screenWidth} = Dimensions.get('window');

const ink = '#1A1A1A';
const muted = '#6B7280';
const pale = '#F5F5F5';

export const PROMO_CARD_WIDTH = screenWidth - spacing.lg * 2;

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
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationBlock: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },

  locationLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },

  locationLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.6,
    marginLeft: 4,
    textTransform: 'uppercase',
  },

  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    maxWidth: 220,
  },

  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: ink,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
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

  toggleWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },

  toggleTrack: {
    flexDirection: 'row',
    backgroundColor: pale,
    borderRadius: 14,
    padding: 4,
  },

  toggleButton: {
    flex: 1,
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
  },

  toggleButtonActive: {
    backgroundColor: colors.primary,
  },

  toggleLabel: {
    color: muted,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },

  toggleLabelActive: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.bold,
  },

  section: {
    marginBottom: spacing.lg,
  },

  sectionHeading: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    color: ink,
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
  },

  sectionActionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionAction: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },

  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },

  menuCard: {
    width: '31.5%',
    marginBottom: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },

  menuCardImageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: pale,
  },

  menuCardImage: {
    width: '100%',
    height: '100%',
  },

  menuCardText: {
    marginTop: spacing.sm,
    color: ink,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },

  promoSection: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },

  promoFrame: {
    width: PROMO_CARD_WIDTH,
    height: 148,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: pale,
  },

  promoImage: {
    width: PROMO_CARD_WIDTH,
    height: 148,
  },

  promoDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 6,
  },

  promoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },

  promoDotActive: {
    width: 18,
    backgroundColor: colors.primary,
  },

  exploreBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    height: 150,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
  },

  exploreBannerImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  exploreBannerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    zIndex: 2,
    elevation: 2,
  },

  exploreBannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
  },

  exploreBannerSubtitle: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    textAlign: 'center',
    opacity: 0.95,
  },

  recentOrdersList: {
    paddingHorizontal: spacing.lg,
  },

  recentOrderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },

  recentOrderImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: pale,
  },

  recentOrderBody: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },

  recentOrderTitle: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },

  recentOrderMeta: {
    color: muted,
    fontSize: typography.fontSize.xs,
    marginTop: 3,
  },

  recentOrderPrice: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginTop: 4,
  },

  reorderButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },

  reorderButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },

  categoryList: {
    paddingHorizontal: spacing.lg,
  },

  categoryItem: {
    width: 76,
    alignItems: 'center',
    marginRight: spacing.md,
  },

  categoryIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: pale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  categoryIconCircleActive: {
    backgroundColor: colors.inactive,
    borderColor: colors.primary,
  },

  categoryName: {
    color: muted,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },

  categoryNameActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  modalSheet: {
    height: '50%',
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  modalScroll: {
    flex: 1,
  },

  modalScrollContent: {
    paddingBottom: spacing.md,
  },

  radioIcon: {
    marginRight: spacing.md,
  },

  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginBottom: spacing.lg,
  },

  modalTitle: {
    color: ink,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.lg,
  },

  selectLocationLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  selectLocationIcon: {
    marginRight: spacing.sm,
  },

  selectLocationLinkText: {
    color: colors.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },

  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    backgroundColor: pale,
    marginBottom: spacing.sm,
  },

  modalOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.inactive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  modalOptionTextWrap: {
    flex: 1,
  },

  modalOptionTitle: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },

  modalOptionSubtitle: {
    color: muted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },

  addAddressLink: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },

  addAddressLinkText: {
    color: colors.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingBottom: 2,
  },

  addressInput: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: ink,
    fontSize: typography.fontSize.sm,
    backgroundColor: '#FFFFFF',
  },

  saveAddressButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  saveAddressButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
