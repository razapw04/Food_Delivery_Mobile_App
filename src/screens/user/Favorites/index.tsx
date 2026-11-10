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
import type {MenuItem} from '../Menu/model';
import {styles} from './styles';
import useController from './useController';

const FavoriteCard = ({
  item,
  onPress,
  onToggleFavorite,
}: {
  item: MenuItem;
  onPress: () => void;
  onToggleFavorite: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={styles.card}>
    <Image source={{uri: item.image}} style={styles.image} resizeMode="cover" />
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.price}>{item.price}</Text>
    </View>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Remove ${item.name} from favourites`}
      hitSlop={8}
      onPress={onToggleFavorite}
      style={styles.favoriteButton}>
      <Icon name="heart" size={22} color="#FF3B30" />
    </Pressable>
  </Pressable>
);

const EmptyFavorites = () => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyIconWrap}>
      <Icon name="heart-outline" size={32} color="#9CA3AF" />
    </View>
    <Text style={styles.emptyTitle}>No favourites yet</Text>
    <Text style={styles.emptySubtitle}>
      Tap the heart on menu items to save them here.
    </Text>
  </View>
);

const FavoritesScreen = () => {
  const {favoriteItems, toggleFavorite, goBack, openProduct} = useController();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={goBack}
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#202321" />
        </Pressable>
        <Text style={styles.headerTitle}>My Favorites</Text>
      </View>

      <FlatList
        data={favoriteItems}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyFavorites />}
        renderItem={({item}) => (
          <FavoriteCard
            item={item}
            onPress={() => openProduct(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default FavoritesScreen;
