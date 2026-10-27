import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import CartReviewFooter from '../../components/CartReviewFooter';
import {styles} from './styles';
import useController from './useController';

const logoSource = require('../../assets/images/Logo.png');

const CartScreen = () => {
  const {
    items,
    cartTotal,
    formatPrice,
    headerLabel,
    headerValue,
    suggestedProducts,
    handleBack,
    handleEditItem,
    openProduct,
    goToMenu,
    updateQuantity,
    removeItem,
  } = useController();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={handleBack}
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#202321" />
        </Pressable>
        <View style={styles.locationBlock}>
          <Text style={styles.locationLabel}>{headerLabel}</Text>
          <Text numberOfLines={2} style={styles.locationAddress}>
            {headerValue}
          </Text>
        </View>
      </View>

      {items.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyScroll}
          showsVerticalScrollIndicator={false}>
          <View style={styles.emptyHero}>
            <Image
              accessibilityLabel="App logo"
              resizeMode="contain"
              source={logoSource}
              style={styles.emptyLogo}
            />
            <Text style={styles.emptyText}>No cart items found</Text>
          </View>

          <View style={[styles.exploreMenuWrap, styles.emptyExploreWrap]}>
            <Pressable
              style={styles.exploreMenuRow}
              accessibilityRole="button"
              onPress={goToMenu}>
              <View style={styles.exploreMenuCopy}>
                <Text style={styles.exploreMenuText}>Explore menu</Text>
                <Text style={styles.exploreMenuDescription}>
                  Add more items in your cart
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color="#1A1A1A" />
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <View style={styles.card}>
                <Image source={{uri: item.image}} style={styles.image} />
                <View style={styles.details}>
                  <View style={styles.titleRow}>
                    <Text style={styles.name} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Pressable
                      accessibilityLabel={`Edit ${item.name}`}
                      accessibilityRole="button"
                      onPress={() => handleEditItem(item.productId)}
                      style={styles.editButton}
                      hitSlop={8}>
                      <Text style={styles.editText}>Edit</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.variationText} numberOfLines={1}>
                    {item.variation}
                  </Text>
                  {item.toppings.length > 0 ? (
                    <Text style={styles.toppingText} numberOfLines={2}>
                      {item.toppings.join(', ')}
                    </Text>
                  ) : null}
                  <Text style={styles.price}>
                    {formatPrice(item.unitPrice * item.quantity)}
                  </Text>
                  <View style={styles.qtyRow}>
                    <Pressable
                      accessibilityLabel="Decrease quantity"
                      onPress={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      style={styles.qtyButton}>
                      <Icon name="minus" size={16} color="#202321" />
                    </Pressable>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <Pressable
                      accessibilityLabel="Increase quantity"
                      onPress={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      style={styles.qtyButton}>
                      <Icon name="plus" size={16} color="#202321" />
                    </Pressable>
                    <Pressable
                      accessibilityLabel="Remove item"
                      onPress={() => removeItem(item.id)}
                      style={styles.removeButton}>
                      <Icon
                        name="trash-can-outline"
                        size={20}
                        color="#C74440"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
            ListFooterComponent={
              <>
                <View style={styles.suggestSection}>
                  <Text style={styles.suggestTitle}>
                    More Products You May Love
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.suggestList}>
                    {suggestedProducts.map(product => (
                      <Pressable
                        key={product.id}
                        accessibilityRole="button"
                        onPress={() => openProduct(product.id)}
                        style={styles.suggestCard}>
                        <Image
                          source={{uri: product.image}}
                          style={styles.suggestImage}
                          resizeMode="cover"
                        />
                        <View style={styles.suggestInfo}>
                          <Text style={styles.suggestName} numberOfLines={1}>
                            {product.name}
                          </Text>
                          <Text
                            style={styles.suggestDescription}
                            numberOfLines={2}>
                            {product.description}
                          </Text>
                          <Text style={styles.suggestPrice}>
                            {product.price}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                <View
                  style={[styles.exploreMenuWrap, styles.filledExploreMenuWrap]}>
                  <Pressable
                    style={styles.exploreMenuRow}
                    accessibilityRole="button"
                    onPress={goToMenu}>
                    <View style={styles.exploreMenuCopy}>
                      <Text style={styles.exploreMenuText}>Explore menu</Text>
                      <Text style={styles.exploreMenuDescription}>
                        Add more items in your cart
                      </Text>
                    </View>
                    <Icon name="chevron-right" size={24} color="#1A1A1A" />
                  </Pressable>
                </View>
              </>
            }
          />

          <CartReviewFooter
            totalLabel={formatPrice(cartTotal)}
            onPress={() => {}}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;
