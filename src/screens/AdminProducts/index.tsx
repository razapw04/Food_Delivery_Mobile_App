import React, {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../context/AuthContext';
import {useCatalog} from '../../context/CatalogContext';
import {
  getAdminProducts,
  removeAdminProduct,
  type AdminProduct,
} from '../../storage/adminProductsStorage';
import {countPendingPriceChangeRequests} from '../../storage/priceChangeRequestsStorage';
import type {RootStackParamList} from '../../types/navigation';
import {styles} from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminProducts'>;

const AdminProductsScreen = () => {
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

  const handleDelete = (product: AdminProduct) => {
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
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isSuperAdmin ? 'Manage Products' : 'Products'}
        </Text>
        {isSuperAdmin ? (
          <Pressable
            accessibilityLabel="Price approvals"
            accessibilityRole="button"
            style={styles.backButton}
            onPress={() => navigation.navigate('AdminPriceApprovals')}>
            <Icon name="clipboard-check-outline" size={22} color="#1A1A1A" />
          </Pressable>
        ) : (
          <View style={styles.backButton} />
        )}
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          {isSuperAdmin
            ? pendingCount > 0
              ? `${pendingCount} price change request(s) waiting for approval.`
              : 'You can edit products directly. Branch admin price changes need your approval.'
            : 'To change a price, send a request. Super admin must approve it first.'}
        </Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={() => {
          void loadProducts();
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No products yet</Text>
            <Text style={styles.emptySubtitle}>
              {isSuperAdmin
                ? 'Add your first product to start managing the menu.'
                : 'No products available right now.'}
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.productCard}>
            <Image source={{uri: item.image}} style={styles.productImage} />
            <View style={styles.productBody}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.productMeta} numberOfLines={1}>
                {categoryName(item.categoryId)}
              </Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
            <View style={styles.cardActions}>
              {isSuperAdmin ? (
                <>
                  <Pressable
                    accessibilityLabel={`Edit ${item.name}`}
                    accessibilityRole="button"
                    style={styles.iconButton}
                    onPress={() =>
                      navigation.navigate('AdminProductForm', {
                        productId: item.id,
                      })
                    }>
                    <Icon name="pencil" size={18} color="#1A1A1A" />
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Delete ${item.name}`}
                    accessibilityRole="button"
                    style={[styles.iconButton, styles.iconButtonDanger]}
                    onPress={() => handleDelete(item)}>
                    <Icon name="delete-outline" size={18} color="#C74440" />
                  </Pressable>
                </>
              ) : (
                <Pressable
                  accessibilityLabel={`Request price change for ${item.name}`}
                  accessibilityRole="button"
                  style={styles.iconButton}
                  onPress={() =>
                    navigation.navigate('AdminPriceRequest', {
                      productId: item.id,
                    })
                  }>
                  <Icon name="cash-edit" size={18} color="#1A1A1A" />
                </Pressable>
              )}
            </View>
          </View>
        )}
      />

      {isSuperAdmin ? (
        <Pressable
          accessibilityLabel="Add product"
          accessibilityRole="button"
          style={styles.fab}
          onPress={() => navigation.navigate('AdminProductForm', {})}>
          <Icon name="plus" size={22} color="#FFFFFF" />
          <Text style={styles.fabText}>Add product</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
};

export default AdminProductsScreen;
