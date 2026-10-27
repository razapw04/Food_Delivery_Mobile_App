import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, spacing, typography} from '../../theme';

type Props = {
  totalLabel: string;
  onPress: () => void;
  /** Menu only: item count outside primary card on the left */
  itemCount?: number;
  actionLabel?: string;
};

const CartReviewFooter = ({
  totalLabel,
  onPress,
  itemCount,
  actionLabel = 'Review Payment',
}: Props) => {
  const insets = useSafeAreaInsets();
  const footerPad = Math.max(insets.bottom, 16) + 8;
  const itemsLabel =
    itemCount != null && itemCount > 0
      ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
      : null;

  const reviewCard = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        itemsLabel
          ? `${actionLabel}, ${itemsLabel}, ${totalLabel}`
          : actionLabel
      }
      onPress={onPress}
      style={[styles.reviewCard, itemsLabel ? styles.reviewCardMenu : null]}>
      <View style={styles.reviewLeft}>
        <Icon name="cart-outline" size={22} color="#FFFFFF" />
        <View style={styles.reviewPriceBlock}>
          <Text style={styles.reviewPrice}>{totalLabel}</Text>
          <Text style={styles.reviewTaxNote}>Prices are exclusive of tax</Text>
        </View>
      </View>
      <View style={styles.reviewRight}>
        <Text style={styles.reviewPaymentText}>{actionLabel}</Text>
        <Icon name="chevron-double-right" size={22} color="#FFFFFF" />
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.footer, {paddingBottom: footerPad}]}>
      {itemsLabel ? (
        <View style={styles.menuRow}>
          <View style={styles.itemsOutsideWrap}>
            <Text style={styles.itemsOutside}>{itemsLabel}</Text>
          </View>
          <View style={styles.reviewCardWrap}>{reviewCard}</View>
        </View>
      ) : (
        reviewCard
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: colors.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemsOutsideWrap: {
    width: '20%',
    paddingRight: spacing.sm,
    justifyContent: 'center',
  },
  itemsOutside: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  reviewCardWrap: {
    width: '80%',
  },
  reviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  reviewCardMenu: {
    flexShrink: 1,
  },
  reviewLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  reviewPriceBlock: {
    marginLeft: spacing.sm,
    flexShrink: 1,
  },
  reviewPrice: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  reviewTaxNote: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.85)',
    fontSize: typography.fontSize.xs,
  },
  reviewRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewPaymentText: {
    marginRight: 4,
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});

export default CartReviewFooter;
