import {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {MapCoordinate} from '../../../components/AppMap';
import {useLocation} from '../../../context/LocationContext';
import type {RootStackParamList} from '../../../types/navigation';

type ChooseLocationNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChooseLocation'
>;

const useController = () => {
  const navigation = useNavigation<ChooseLocationNavigationProp>();
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

  const goBack = () => {
    navigation.goBack();
  };

  const refreshGps = () => {
    void useCurrentLocation();
  };

  const confirmLocation = () => {
    confirmCurrentLocation();
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
    confirmLocation,
  };
};

export default useController;
