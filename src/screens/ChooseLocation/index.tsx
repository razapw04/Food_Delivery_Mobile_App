import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppMap, {type MapCoordinate} from '../../components/AppMap';
import {useLocation} from '../../context/LocationContext';
import type {RootStackParamList} from '../../types/navigation';
import {styles} from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseLocation'>;

const ChooseLocationScreen = ({navigation}: Props) => {
  const {
    coordinates,
    deliveryAddress,
    liveAddress,
    isLocating,
    useCurrentLocation,
    confirmCurrentLocation,
    updateLocationFromCoords,
  } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<MapCoordinate>({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  });

  useEffect(() => {
    useCurrentLocation();
  }, [useCurrentLocation]);

  useEffect(() => {
    setMapCenter({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  }, [coordinates.latitude, coordinates.longitude]);

  const onRegionChangeComplete = useCallback(
    (coords: MapCoordinate) => {
      setMapCenter(coords);
      void updateLocationFromCoords(coords);
    },
    [updateLocationFromCoords],
  );

  const addressText =
    liveAddress ||
    (deliveryAddress !== 'Select delivery address' ? deliveryAddress : null) ||
    'Fetching your current location...';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Choose location</Text>
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
              placeholder="Search address.."
              placeholderTextColor="#9A9F9B"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {isLocating ? (
          <View style={styles.mapPinOverlay} pointerEvents="none">
            <ActivityIndicator size="large" color="#FF7622" />
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.addressCard}>
          <View style={styles.addressIconWrap}>
            <Icon name="crosshairs-gps" size={20} color="#FF7622" />
          </View>
          <View style={styles.addressTextWrap}>
            <Text style={styles.addressLabel}>Selected location</Text>
            <Text style={styles.addressValue} numberOfLines={2}>
              {addressText}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Use current GPS location"
            accessibilityRole="button"
            onPress={() => {
              void useCurrentLocation();
            }}
            style={styles.gpsButton}>
            <Icon name="crosshairs-gps" size={20} color="#FF7622" />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          style={styles.confirmButton}
          onPress={() => {
            confirmCurrentLocation();
            navigation.navigate('MainTabs', {screen: 'Home'});
          }}>
          <Text style={styles.confirmButtonText}>Confirm location</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ChooseLocationScreen;
