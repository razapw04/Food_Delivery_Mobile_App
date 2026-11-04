import {useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCatalog} from '../../context/CatalogContext';
import {useLocation} from '../../context/LocationContext';
import {useOrder} from '../../context/OrderContext';
import type {MainTabParamList, RootStackParamList} from '../../types/navigation';

type ExploreNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Explore'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const useController = () => {
  const navigation = useNavigation<ExploreNavigationProp>();
  const {deliveryAddress, isLocating} = useLocation();
  const {orderMode, selectedBranch} = useOrder();
  const {
    menuCategories,
    menuItems,
    popularMenuItems,
    isLoading,
    isUsingFallback,
    refreshCatalog,
  } = useCatalog();
  const [query, setQuery] = useState('');

  const isPickup = orderMode === 'pickup';
  const headerLabel = isPickup ? 'Pickup from' : 'Deliver to';
  const headerValue = isPickup
    ? selectedBranch?.name ?? 'Select a branch'
    : isLocating
      ? 'Detecting location...'
      : deliveryAddress;

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return menuItems.filter(item => {
      const categoryName =
        menuCategories.find(category => category.id === item.categoryId)
          ?.name ?? '';
      const searchableText =
        `${item.name} ${item.description} ${categoryName}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [menuCategories, menuItems, query]);

  const showEmptyState = query.trim().length === 0 || visibleItems.length === 0;

  const clearQuery = () => {
    setQuery('');
  };

  const goHome = () => {
    navigation.navigate('Home');
  };

  const goMenu = () => {
    navigation.navigate('Menu');
  };

  const openProduct = (itemId: string) => {
    navigation.navigate('ProductDetail', {itemId});
  };

  return {
    query,
    setQuery,
    clearQuery,
    headerLabel,
    headerValue,
    popularMenuItems,
    visibleItems,
    showEmptyState,
    isLoading,
    isUsingFallback,
    refreshCatalog,
    goHome,
    goMenu,
    openProduct,
  };
};

export default useController;
