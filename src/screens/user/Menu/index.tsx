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
import CartReviewFooter from '../../../components/CartReviewFooter';
import {MenuSkeleton} from '../../../components/Skeleton';
import {OfflineBanner, StateMessage} from '../../../components/StateMessage';
import type {MenuItem} from './model';
import {styles} from './styles';
import useController, {formatPrice} from './useController';

const MenuItemCard = ({
  item,
  isFavorite,
  onToggleFavorite,
  onOpenProduct,
}: {
  item: MenuItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenProduct: () => void;
}) => (
  <Pressable style={styles.itemCard} onPress={onOpenProduct}>
    <View style={styles.itemImageWrap}>
      <Image
        source={{uri: item.image}}
        style={styles.itemImage}
        resizeMode="cover"
      />
    </View>
    <View style={styles.itemInfo}>
      <View style={styles.titleRow}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Pressable
          accessibilityLabel={
            isFavorite
              ? `Remove ${item.name} from favourites`
              : `Add ${item.name} to favourites`
          }
          accessibilityRole="button"
          accessibilityState={{selected: isFavorite}}
          hitSlop={8}
          style={styles.favoriteButton}
          onPress={onToggleFavorite}>
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? '#FF3B30' : '#9CA3AF'}
          />
        </Pressable>
      </View>
      <Text style={styles.itemDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.priceRow}>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <Pressable
          accessibilityLabel={`Open ${item.name}`}
          accessibilityRole="button"
          style={styles.addButton}
          onPress={onOpenProduct}>
          <Icon name="plus" size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  </Pressable>
);

const MenuScreen = () => {
  const {
    menuCategories,
    isLoading,
    isUsingFallback,
    refreshCatalog,
    locationLabel,
    locationAddress,
    rows,
    selectedCategoryId,
    listRef,
    categoryScrollRef,
    itemCount,
    cartTotal,
    hasCartItems,
    isFavorite,
    toggleFavorite,
    selectCategory,
    onViewableItemsChanged,
    viewabilityConfig,
    handleScrollEnd,
    getItemLayout,
    onScrollToIndexFailed,
    setCategoryOffset,
    goHome,
    goExplore,
    openProduct,
    goToCart,
  } = useController();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={goHome}>
          <Icon name="arrow-left" size={20} color="#1A1A1A" />
        </Pressable>

        <View style={styles.locationBlock}>
          <Text style={styles.locationLabel}>{locationLabel}</Text>
          <Text numberOfLines={2} style={styles.locationAddress}>
            {locationAddress}
          </Text>
        </View>

        <Pressable
          accessibilityLabel="Search menu"
          accessibilityRole="button"
          style={styles.searchButton}
          onPress={goExplore}>
          <Icon name="magnify" size={18} color="#1A1A1A" />
        </Pressable>
      </View>

      {isUsingFallback ? (
        <OfflineBanner
          message="Couldn't refresh menu from server. Showing saved items."
          onRetry={refreshCatalog}
        />
      ) : null}

      {isLoading ? (
        <MenuSkeleton />
      ) : rows.length === 0 ? (
        <StateMessage
          icon="food-off"
          title="Menu unavailable"
          subtitle="We couldn't load menu items right now. Check your connection and try again."
          actionLabel="Retry"
          onAction={refreshCatalog}
        />
      ) : (
        <>
          <View style={styles.categoriesSection}>
            <ScrollView
              ref={categoryScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesRow}>
              {menuCategories.map(category => {
                const isActive = category.id === selectedCategoryId;
                return (
                  <Pressable
                    key={category.id}
                    accessibilityRole="button"
                    accessibilityState={{selected: isActive}}
                    style={styles.categoryItem}
                    onLayout={event => {
                      setCategoryOffset(
                        category.id,
                        event.nativeEvent.layout.x,
                      );
                    }}
                    onPress={() => selectCategory(category.id, true)}>
                    <View
                      style={[
                        styles.categoryImageWrap,
                        isActive && styles.categoryImageWrapActive,
                      ]}>
                      <Image
                        source={{uri: category.image}}
                        style={styles.categoryImage}
                        resizeMode="cover"
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryName,
                        isActive && styles.categoryNameActive,
                      ]}
                      numberOfLines={1}>
                      {category.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <FlatList
            ref={listRef}
            data={rows}
            keyExtractor={row => row.key}
            contentContainerStyle={[
              styles.listContent,
              hasCartItems && styles.listContentWithCartFooter,
            ]}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onMomentumScrollEnd={handleScrollEnd}
            onScrollEndDrag={handleScrollEnd}
            getItemLayout={getItemLayout}
            onScrollToIndexFailed={onScrollToIndexFailed}
            renderItem={({item: row}) => {
              if (row.type === 'header') {
                return (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{row.title}</Text>
                  </View>
                );
              }

              return (
                <MenuItemCard
                  item={row.item}
                  isFavorite={isFavorite(row.item.id)}
                  onToggleFavorite={() => toggleFavorite(row.item.id)}
                  onOpenProduct={() => openProduct(row.item.id)}
                />
              );
            }}
          />
        </>
      )}

      {hasCartItems ? (
        <CartReviewFooter
          itemCount={itemCount}
          totalLabel={formatPrice(cartTotal)}
          actionLabel="View Cart"
          onPress={goToCart}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default MenuScreen;
