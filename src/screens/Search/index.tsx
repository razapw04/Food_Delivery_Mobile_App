import React, {useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {MainTabParamList} from '../../types/navigation';
import {restaurants} from '../Home/model';
import type {Restaurant} from '../Home/model';
import {styles} from './styles';

type SearchScreenProps = BottomTabScreenProps<MainTabParamList, 'Search'>;

const recentKeywords = ['Pizza', 'Burger', 'Chicken', 'Pasta', 'Rice'];

const SearchHeader = () => (
  <View style={styles.header}>
    <View style={styles.topRow}>
      <View style={styles.circleButton} />

      <View style={styles.titleBlock}>
        <Text style={styles.title}>Search</Text>
      </View>

      <Pressable
        accessibilityLabel="Shopping bag, empty"
        accessibilityRole="button"
        onPress={() => Alert.alert('Your bag', 'Your bag is empty.')}
        style={[styles.circleButton, styles.cartButton]}>
        <Icon name="shopping-outline" size={23} color="#FFFFFF" />
      </Pressable>
    </View>
  </View>
);

const RestaurantResult = ({restaurant}: {restaurant: Restaurant}) => (
  <View style={styles.restaurantCard}>
    <Image
      accessibilityLabel={`${restaurant.name} restaurant`}
      source={{uri: restaurant.image}}
      style={styles.restaurantImage}
    />
    <View style={styles.restaurantDetails}>
      <Text numberOfLines={1} style={styles.restaurantName}>
        {restaurant.name}
      </Text>
      <View style={styles.ratingRow}>
        <Icon name="star" size={16} color={styles.ratingIcon.color} />
        <Text style={styles.ratingText}>{restaurant.rating}</Text>
      </View>
    </View>
  </View>
);

const SearchScreen = (_props: SearchScreenProps) => {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const visibleRestaurants = restaurants.filter(restaurant => {
    const searchableText =
      `${restaurant.name} ${restaurant.tags} ${restaurant.category}`.toLowerCase();
    return searchableText.includes(normalizedQuery);
  });

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <SearchHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Icon name="magnify" size={24} color="#858B87" />
            <TextInput
              accessibilityLabel="Search restaurants"
              autoFocus
              onChangeText={setQuery}
              placeholder="Search restaurants"
              placeholderTextColor="#9A9F9B"
              returnKeyType="search"
              style={styles.searchInput}
              value={query}
            />
            <Pressable
              accessibilityLabel="Clear search"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setQuery('')}
              style={styles.clearButton}>
              <Icon name="close-circle" size={20} color="#858B87" />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Keywords</Text>
          <ScrollView
            contentContainerStyle={styles.keywordList}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {recentKeywords.map(keyword => (
              <Pressable
                accessibilityRole="button"
                key={keyword}
                onPress={() => setQuery(keyword)}
                style={styles.keywordCard}>
                <Text style={styles.keywordText}>{keyword}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Restaurants</Text>
          {visibleRestaurants.length > 0 ? (
            <View style={styles.restaurantList}>
              {visibleRestaurants.map(restaurant => (
                <RestaurantResult key={restaurant.id} restaurant={restaurant} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No restaurants found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;