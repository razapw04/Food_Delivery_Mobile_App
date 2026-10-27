import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useCart} from '../../context/CartContext';
import {colors, typography} from '../../theme';

type Props = {
  onPress: () => void;
};

const CartIconButton = ({onPress}: Props) => {
  const {itemCount} = useCart();

  return (
    <Pressable
      accessibilityLabel={
        itemCount > 0 ? `Cart, ${itemCount} items` : 'Cart, empty'
      }
      accessibilityRole="button"
      onPress={onPress}
      style={styles.cartButton}>
      <Icon name="cart-outline" size={22} color="#FFFFFF" />
      {itemCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {itemCount > 99 ? '99+' : String(itemCount)}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#202321',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
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
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
});

export default CartIconButton;
