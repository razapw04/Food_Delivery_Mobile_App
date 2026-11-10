import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  ScrollView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {spacing} from '../../../theme';
import {useCart} from '../../../context/CartContext';
import {useCatalog} from '../../../context/CatalogContext';
import {useFavorites} from '../../../context/FavoritesContext';
import {useLocation} from '../../../context/LocationContext';
import {useOrder} from '../../../context/OrderContext';
import type {RootStackParamList} from '../../../types/navigation';
import type {MenuItem} from './model';

type MenuNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Menu'>;

export const formatPrice = (value: number) =>
  `Rs. ${value.toLocaleString('en-PK')}`;

export type HeaderRow = {
  type: 'header';
  key: string;
  categoryId: string;
  title: string;
};

export type ItemRow = {
  type: 'item';
  key: string;
  categoryId: string;
  item: MenuItem;
};

export type MenuRow = HeaderRow | ItemRow;

export const SECTION_HEADER_HEIGHT = 40;
export const ITEM_ROW_HEIGHT = 92;

const useController = () => {
  const navigation = useNavigation<MenuNavigationProp>();
  const {deliveryAddress, isLocating} = useLocation();
  const {orderMode, selectedBranch} = useOrder();
  const {
    menuCategories,
    menuItems,
    isLoading,
    isUsingFallback,
    refreshCatalog,
  } = useCatalog();
  const {itemCount, cartTotal} = useCart();
  const {isFavorite, toggleFavorite} = useFavorites();
  const isPickup = orderMode === 'pickup';
  const hasCartItems = itemCount > 0;
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    () => menuCategories[0]?.id ?? 'pizza',
  );
  const isScrollingToCategory = useRef(false);
  const listRef = useRef<FlatList<MenuRow> | null>(null);
  const categoryScrollRef = useRef<React.ElementRef<typeof ScrollView> | null>(
    null,
  );
  const categoryOffsets = useRef<Record<string, number>>({});

  const locationLabel = isPickup ? 'Pickup from' : 'Deliver to';
  const locationAddress = isPickup
    ? selectedBranch?.name ?? 'Select a branch'
    : isLocating
      ? 'Detecting location...'
      : deliveryAddress;

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
  }, [menuCategories, menuItems]);

  const categoryIndexMap = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((row, index) => {
      if (row.type === 'header') {
        map[row.categoryId] = index;
      }
    });
    return map;
  }, [rows]);

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
    ({
      viewableItems,
    }: {
      viewableItems: Array<{isViewable: boolean; item?: unknown}>;
    }) => {
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

  const handleScrollEnd = (_event?: NativeSyntheticEvent<NativeScrollEvent>) => {
    isScrollingToCategory.current = false;
  };

  const getItemLayout = (_: ArrayLike<MenuRow> | null | undefined, index: number) => {
    const row = rows[index];
    const length =
      row?.type === 'header' ? SECTION_HEADER_HEIGHT : ITEM_ROW_HEIGHT;
    let offset = spacing.lg;
    for (let i = 0; i < index; i += 1) {
      offset +=
        rows[i].type === 'header' ? SECTION_HEADER_HEIGHT : ITEM_ROW_HEIGHT;
    }
    return {length, offset, index};
  };

  const onScrollToIndexFailed = (info: {index: number}) => {
    setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
        viewPosition: 0,
      });
    }, 250);
  };

  const setCategoryOffset = (categoryId: string, x: number) => {
    categoryOffsets.current[categoryId] = x;
  };

  const goHome = () => {
    navigation.navigate('MainTabs', {screen: 'Home'});
  };

  const goExplore = () => {
    navigation.navigate('MainTabs', {screen: 'Explore'});
  };

  const openProduct = (itemId: string) => {
    navigation.navigate('ProductDetail', {itemId});
  };

  const goToCart = () => {
    navigation.navigate('Cart');
  };

  return {
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
  };
};

export default useController;
