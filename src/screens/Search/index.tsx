import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {MenuItem} from '../Menu/model';
import {styles} from './styles';
import useController from './useController';

const logoSource = require('../../assets/images/Logo.png');

const ExploreHeader = ({
  label,
  value,
  onBack,
}: {
  label: string;
  value: string;
  onBack: () => void;
}) => (
  <View style={styles.header}>
    <View style={styles.topRow}>
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        onPress={onBack}
        style={styles.circleButton}>
        <Icon name="arrow-left" size={24} color="#202321" />
      </Pressable>

      <View style={styles.locationBlock}>
        <Text style={styles.locationLabel}>{label}</Text>
        <Text numberOfLines={2} style={styles.locationAddress}>
          {value}
        </Text>
      </View>
    </View>
  </View>
);

const MenuItemResult = ({
  item,
  onPress,
}: {
  item: MenuItem;
  onPress: () => void;
}) => (
  <Pressable style={styles.restaurantCard} onPress={onPress}>
    <Image
      accessibilityLabel={item.name}
      source={{uri: item.image}}
      style={styles.restaurantImage}
    />
    <View style={styles.restaurantDetails}>
      <Text numberOfLines={1} style={styles.restaurantName}>
        {item.name}
      </Text>
      <Text style={styles.ratingText}>{item.price}</Text>
    </View>
  </Pressable>
);

const ExploreScreen = () => {
  const {
    query,
    setQuery,
    clearQuery,
    headerLabel,
    headerValue,
    popularMenuItems,
    visibleItems,
    showEmptyState,
    goHome,
    goMenu,
    openProduct,
  } = useController();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ExploreHeader
        label={headerLabel}
        value={headerValue}
        onBack={goHome}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Icon name="magnify" size={24} color="#858B87" />
            <TextInput
              accessibilityLabel="Search your favourite items"
              onChangeText={setQuery}
              placeholder="Search your favourite items"
              placeholderTextColor="#9A9F9B"
              returnKeyType="search"
              style={styles.searchInput}
              value={query}
            />
            {!!query && (
              <Pressable
                accessibilityLabel="Clear search"
                accessibilityRole="button"
                hitSlop={8}
                onPress={clearQuery}
                style={styles.clearButton}>
                <Icon name="close-circle" size={20} color="#858B87" />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular searches</Text>
          <ScrollView
            contentContainerStyle={styles.keywordList}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {popularMenuItems.map(item => (
              <Pressable
                accessibilityRole="button"
                key={item.id}
                onPress={() => openProduct(item.id)}
                style={styles.keywordCard}>
                <Text style={styles.keywordText}>{item.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.exploreMenuWrap}>
          <Pressable
            style={styles.exploreMenuRow}
            accessibilityRole="button"
            onPress={goMenu}>
            <View style={styles.exploreMenuCopy}>
              <Text style={styles.exploreMenuText}>Explore menu</Text>
              <Text style={styles.exploreMenuDescription}>
                Add more items in your cart
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#1A1A1A" />
          </Pressable>
        </View>

        {showEmptyState ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Image
                accessibilityLabel="App logo"
                resizeMode="contain"
                source={logoSource}
                style={styles.emptyLogo}
              />
            </View>
            <Text style={styles.emptyStateText}>No products found</Text>
          </View>
        ) : (
          <View style={styles.restaurantList}>
            {visibleItems.map(item => (
              <MenuItemResult
                key={item.id}
                item={item}
                onPress={() => openProduct(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreScreen;
