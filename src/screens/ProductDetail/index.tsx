import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import CartIconButton from '../../components/CartIconButton';
import LiquidGlassPanel from '../../components/LiquidGlassPanel';
import {styles} from './styles';
import useController from './useController';

const ProductDetailScreen = () => {
  const {
    item,
    headerLabel,
    headerValue,
    stickyBottomPad,
    isFavorite,
    quantity,
    selectedVariation,
    selectedToppingIds,
    variations,
    selectedVariationOption,
    toppings,
    displayPrice,
    totalPrice,
    formatPrice,
    handleBack,
    handleOpenCart,
    toggleFavorite,
    selectVariation,
    toggleTopping,
    decreaseQuantity,
    increaseQuantity,
    handleAddToBag,
  } = useController();

  if (!item) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.missingText}>Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.topRow}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={handleBack}
            style={styles.circleButton}>
            <Icon name="arrow-left" size={24} color="#202321" />
          </Pressable>

          <View style={styles.locationBlock}>
            <Text style={styles.locationLabel}>{headerLabel}</Text>
            <Text numberOfLines={2} style={styles.locationAddress}>
              {headerValue}
            </Text>
          </View>

          <CartIconButton onPress={handleOpenCart} />
        </View>
      </View>

      <View style={styles.body}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          bounces
          alwaysBounceVertical>
          <View style={styles.imageWrap}>
            <Image
              accessibilityLabel={item.name}
              source={{uri: item.image}}
              style={styles.image}
              resizeMode="cover"
            />
            <Pressable
              accessibilityLabel={
                isFavorite
                  ? `Remove ${item.name} from favourites`
                  : `Add ${item.name} to favourites`
              }
              accessibilityRole="button"
              accessibilityState={{selected: isFavorite}}
              onPress={toggleFavorite}
              style={styles.favoriteButton}>
              <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? '#FF3B30' : '#9CA3AF'}
              />
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>{displayPrice}</Text>

            <View style={styles.variationHeader}>
              <Text style={styles.variationTitle}>Variation</Text>
              <Text style={styles.requiredBadge}>Required</Text>
            </View>

            <View style={styles.variationList}>
              {variations.map(option => {
                const selected = selectedVariation === option.key;
                return (
                  <Pressable
                    key={option.key}
                    accessibilityRole="radio"
                    accessibilityState={{selected}}
                    onPress={() => selectVariation(option.key)}
                    style={styles.variationRow}>
                    <View
                      style={[
                        styles.radioOuter,
                        selected && styles.radioOuterSelected,
                      ]}>
                      {selected ? <View style={styles.radioInner} /> : null}
                    </View>
                    <Text style={styles.variationLabel}>{option.label}</Text>
                    <Text style={styles.variationPrice}>{option.price}</Text>
                  </Pressable>
                );
              })}
            </View>

            {selectedVariationOption ? (
              <View style={styles.toppingSection}>
                <Text style={styles.selectedVariationNote}>
                  Extra · Variation selected ({selectedVariationOption.label})
                </Text>

                <View style={styles.variationHeader}>
                  <Text style={styles.variationTitle}>Topping</Text>
                  <Text style={styles.optionalBadge}>Optional</Text>
                </View>

                <View style={styles.variationList}>
                  {toppings.map(topping => {
                    const selected = selectedToppingIds.includes(topping.id);
                    return (
                      <Pressable
                        key={topping.id}
                        accessibilityRole="checkbox"
                        accessibilityState={{checked: selected}}
                        onPress={() => toggleTopping(topping.id)}
                        style={styles.variationRow}>
                        <View
                          style={[
                            styles.checkOuter,
                            selected && styles.checkOuterSelected,
                          ]}>
                          {selected ? (
                            <Icon name="check" size={14} color="#FFFFFF" />
                          ) : null}
                        </View>
                        <Text style={styles.variationLabel}>{topping.name}</Text>
                        <Text style={styles.variationPrice}>
                          {formatPrice(topping.price)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <LiquidGlassPanel
          glassType="regular"
          style={[styles.stickyBar, {paddingBottom: stickyBottomPad}]}>
          <View style={styles.stickyRow}>
            <View style={styles.qtyCard}>
              <Pressable
                accessibilityLabel="Decrease quantity"
                accessibilityRole="button"
                hitSlop={6}
                onPress={decreaseQuantity}
                style={styles.qtyButton}>
                <Icon name="minus" size={18} color="#202321" />
              </Pressable>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <Pressable
                accessibilityLabel="Increase quantity"
                accessibilityRole="button"
                hitSlop={6}
                onPress={increaseQuantity}
                style={styles.qtyButton}>
                <Icon name="plus" size={18} color="#202321" />
              </Pressable>
            </View>

            <Pressable
              accessibilityLabel={`Add ${formatPrice(totalPrice)}`}
              accessibilityRole="button"
              disabled={!selectedVariation}
              onPress={handleAddToBag}
              style={[
                styles.addButton,
                !selectedVariation && styles.addButtonDisabled,
              ]}>
              <Text style={styles.addButtonText}>
                Add Rs. {totalPrice.toLocaleString('en-PK')}
              </Text>
            </Pressable>
          </View>
        </LiquidGlassPanel>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;
