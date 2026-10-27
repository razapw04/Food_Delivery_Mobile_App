import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {spacing} from '../../theme';
import CartReviewFooter from '../../components/CartReviewFooter';
import {useCart} from '../../context/CartContext';
import {useLocation} from '../../context/LocationContext';
import {useOrder} from '../../context/OrderContext';
import type {RootStackParamList} from '../../types/navigation';
import {menuCategories, menuItems, type MenuItem} from './model';
import {styles} from './styles';

type MenuScreenProps = NativeStackScreenProps<RootStackParamList, 'Menu'>;

const formatPrice = (value: number) =>
  `Rs. ${value.toLocaleString('en-PK')}`;

type HeaderRow = {
  type: 'header';
  key: string;
  categoryId: string;
  title: string;
};

type ItemRow = {
  type: 'item';
  key: string;
  categoryId: string;
  item: MenuItem;
};

type MenuRow = HeaderRow | ItemRow;

const SECTION_HEADER_HEIGHT = 52;
const ITEM_ROW_HEIGHT = 120;

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

const MenuScreen = ({navigation}: MenuScreenProps) => {
  const {deliveryAddress, isLocating} = useLocation();
  const {orderMode, selectedBranch} = useOrder();
  const {itemCount, cartTotal} = useCart();
  const isPickup = orderMode === 'pickup';
  const hasCartItems = itemCount > 0;
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    menuCategories[0].id,
  );
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const isScrollingToCategory = useRef(false);
  const listRef = useRef<FlatList<MenuRow>>(null);
  const categoryScrollRef = useRef<ScrollView>(null);
  const categoryOffsets = useRef<Record<string, number>>({});

  const rows = useMemo<MenuRow[]>(() => {
    const nextRows: MenuRow[] = [];

    menuCategories.forEach(category => {
      nextRows.push({
        type: 'header',
        key: `header-${category.id}`,
        categoryId: category.id,
        title: category.name,
      });

      menuItems
        .filter(item => item.categoryId === category.id)
        .forEach(item => {
          nextRows.push({
            type: 'item',
            key: item.id,
            categoryId: category.id,
            item,
          });
        });
    });

    return nextRows;
  }, []);

  const categoryIndexMap = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((row, index) => {
      if (row.type === 'header') {
        map[row.categoryId] = index;
      }
    });
    return map;
  }, [rows]);

  const toggleFavorite = (itemId: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const scrollCategoryIntoView = useCallback((categoryId: string) => {
    const x = categoryOffsets.current[categoryId];
    if (x == null) {
      return;
    }

    categoryScrollRef.current?.scrollTo({
      x: Math.max(0, x - 16),
      animated: true,
    });
  }, []);

  const selectCategory = useCallback(
    (categoryId: string, shouldScrollList: boolean) => {
      setSelectedCategoryId(categoryId);
      scrollCategoryIntoView(categoryId);

      if (!shouldScrollList) {
        return;
      }

      const index = categoryIndexMap[categoryId];
      if (index == null) {
        return;
      }

      isScrollingToCategory.current = true;
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
      });
    },
    [categoryIndexMap, scrollCategoryIntoView],
  );

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (isScrollingToCategory.current || viewableItems.length === 0) {
        return;
      }

      const firstVisible = viewableItems.find(token => token.isViewable);
      const row = firstVisible?.item as MenuRow | undefined;
      if (!row?.categoryId) {
        return;
      }

      setSelectedCategoryId(prev => {
        if (prev === row.categoryId) {
          return prev;
        }
        scrollCategoryIntoView(row.categoryId);
        return row.categoryId;
      });
    },
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 40,
  }).current;

  const handleScrollEnd = (
    _event?: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    isScrollingToCategory.current = false;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={() => navigation.navigate('MainTabs', {screen: 'Home'})}>
          <Icon name="arrow-left" size={24} color="#1A1A1A" />
        </Pressable>

        <View style={styles.locationBlock}>
          <Text style={styles.locationLabel}>
            {isPickup ? 'Pickup from' : 'Deliver to'}
          </Text>
          <Text numberOfLines={2} style={styles.locationAddress}>
            {isPickup
              ? selectedBranch?.name ?? 'Select a branch'
              : isLocating
                ? 'Detecting location...'
                : deliveryAddress}
          </Text>
        </View>

        <Pressable
          accessibilityLabel="Search menu"
          accessibilityRole="button"
          style={styles.searchButton}
          onPress={() =>
            navigation.navigate('MainTabs', {screen: 'Explore'})
          }>
          <Icon name="magnify" size={22} color="#1A1A1A" />
        </Pressable>
      </View>

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
                  categoryOffsets.current[category.id] =
                    event.nativeEvent.layout.x;
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
        getItemLayout={(_, index) => {
          const row = rows[index];
          const length =
            row?.type === 'header' ? SECTION_HEADER_HEIGHT : ITEM_ROW_HEIGHT;
          let offset = spacing.lg;
          for (let i = 0; i < index; i += 1) {
            offset +=
              rows[i].type === 'header'
                ? SECTION_HEADER_HEIGHT
                : ITEM_ROW_HEIGHT;
          }
          return {length, offset, index};
        }}
        onScrollToIndexFailed={info => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0,
            });
          }, 250);
        }}
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
              isFavorite={favoriteIds.has(row.item.id)}
              onToggleFavorite={() => toggleFavorite(row.item.id)}
              onOpenProduct={() =>
                navigation.navigate('ProductDetail', {itemId: row.item.id})
              }
            />
          );
        }}
      />

      {hasCartItems ? (
        <CartReviewFooter
          itemCount={itemCount}
          totalLabel={formatPrice(cartTotal)}
          actionLabel="View Cart"
          onPress={() => navigation.navigate('Cart')}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default MenuScreen;
