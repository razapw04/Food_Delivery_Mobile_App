import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppMap from '../../../components/AppMap';
import type {RootStackParamList} from '../../../types/navigation';
import {styles} from './styles';
import useController from './useController';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminBranchMapPick'>;

const AdminBranchMapPickScreen = ({route}: Props) => {
  const {
    searchQuery,
    setSearchQuery,
    suggestions,
    searching,
    isResolving,
    mapCenter,
    addressText,
    onRegionChangeComplete,
    selectSuggestion,
    confirmLocation,
    goBack,
  } = useController(route);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={goBack}>
          <Icon name="arrow-left" size={22} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Branch location</Text>
      </View>

      <View style={styles.mapContainer}>
        <AppMap
          style={styles.mapImage}
          center={mapCenter}
          zoom={15}
          showCenterPin
          onRegionChangeComplete={onRegionChangeComplete}
        />

        <View style={styles.searchOverlay}>
          <View style={styles.searchBar}>
            <Icon name="magnify" size={22} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search area, street, city..."
              placeholderTextColor="#9A9F9B"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searching ? (
              <ActivityIndicator size="small" color="#FF7622" />
            ) : null}
          </View>

          {suggestions.length > 0 ? (
            <View style={styles.suggestions}>
              <FlatList
                keyboardShouldPersistTaps="handled"
                data={suggestions}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <Pressable
                    accessibilityRole="button"
                    style={styles.suggestionRow}
                    onPress={() => selectSuggestion(item)}>
                    <Text style={styles.suggestionText} numberOfLines={1}>
                      {item.label}
                    </Text>
                    <Text style={styles.suggestionMeta} numberOfLines={2}>
                      {item.meta}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          ) : null}
        </View>

        {isResolving ? (
          <View style={styles.mapPinOverlay} pointerEvents="none">
            <ActivityIndicator size="large" color="#FF7622" />
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.addressCard}>
          <View style={styles.addressIconWrap}>
            <Icon name="map-marker" size={20} color="#FF7622" />
          </View>
          <View style={styles.addressTextWrap}>
            <Text style={styles.addressLabel}>Selected location</Text>
            <Text style={styles.addressValue} numberOfLines={2}>
              {addressText}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          style={styles.confirmButton}
          onPress={confirmLocation}>
          <Text style={styles.confirmButtonText}>Use this location</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AdminBranchMapPickScreen;
