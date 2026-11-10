import {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {
  getAdminProducts,
  removeAdminProduct,
  type AdminProduct,
} from '../../../storage/adminProductsStorage';
import {countPendingPriceChangeRequests} from '../../../storage/priceChangeRequestsStorage';
import type {RootStackParamList} from '../../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminProducts'>;

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isAdmin, isSuperAdmin} = useAuth();
  const {menuItems, menuCategories} = useCatalog();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const categoryName = useCallback(
    (categoryId: string) =>
      menuCategories.find(item => item.id === categoryId)?.name ?? categoryId,
    [menuCategories],
  );

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const stored = await getAdminProducts();
      setProducts(stored ?? menuItems);
      if (isSuperAdmin) {
        setPendingCount(await countPendingPriceChangeRequests());
      }
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin, menuItems]);

  useFocusEffect(
    useCallback(() => {
      if (!isAdmin) {
        navigation.replace('Login');
        return;
      }
      void loadProducts();
    }, [isAdmin, loadProducts, navigation]),
  );

  const handleDelete = useCallback(
    (product: AdminProduct) => {
      Alert.alert(
        'Delete product',
        `Remove "${product.name}"? This is saved only on this device for now.`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              void (async () => {
                const next = await removeAdminProduct(product.id, menuItems);
                setProducts(next);
              })();
            },
          },
        ],
      );
    },
    [menuItems],
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const bannerText = isSuperAdmin
    ? pendingCount > 0
      ? `${pendingCount} price change request(s) waiting for approval.`
      : 'You can edit products directly. Branch manager price changes need your approval.'
    : 'To change a price, send a suggestion. Super admin sets the final price.';

  return {
    navigation,
    isSuperAdmin,
    products,
    loading,
    pendingCount,
    bannerText,
    categoryName,
    loadProducts,
    handleDelete,
    handleBack,
  };
};

export default useController;
