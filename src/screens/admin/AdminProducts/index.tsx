import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AdminMenuButton from '../../../components/AdminMenuButton';
import {styles} from './styles';
import useController from './useController';

const AdminProductsScreen = () => {
  const {
    navigation,
    isSuperAdmin,
    products,
    loading,
    bannerText,
    categoryName,
    loadProducts,
    handleDelete,
  } = useController();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <AdminMenuButton />
        <Text style={styles.headerTitle}>
          {isSuperAdmin ? 'Menu' : 'Products'}
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
        <Text style={styles.bannerText}>{bannerText}</Text>
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
                  <Icon name="tag-outline" size={18} color="#1A1A1A" />
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
