import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {MapCoordinate} from '../../../components/AppMap';
import {useLocation} from '../../../context/LocationContext';
import type {RootStackParamList} from '../../../types/navigation';

type AddAddressNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddAddress'
>;

const useController = () => {
  const navigation = useNavigation<AddAddressNavigationProp>();
  const {
    coordinates,
    deliveryAddress,
    liveAddress,
    isLocating,
    useCurrentLocation,
    addSavedAddress,
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
    searchQuery.trim() ||
    liveAddress ||
    (deliveryAddress !== 'Select delivery address' ? deliveryAddress : null) ||
    'Move the map or enter an address';

  const goBack = () => {
    navigation.goBack();
  };

  const refreshGps = () => {
    void useCurrentLocation();
  };

  const handleSave = () => {
    const trimmed = searchQuery.trim() || liveAddress?.trim() || '';
    if (!trimmed) {
      Alert.alert('Address required', 'Please search or pick a map location.');
      return;
    }

    addSavedAddress('Location', trimmed);
    navigation.navigate('MainTabs', {screen: 'Home'});
  };

  return {
    searchQuery,
    mapCenter,
    isLocating,
    addressText,
    setSearchQuery,
    onRegionChangeComplete,
    goBack,
    refreshGps,
    handleSave,
  };
};

export default useController;
