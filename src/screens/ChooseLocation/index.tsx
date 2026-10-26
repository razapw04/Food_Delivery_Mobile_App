import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useLocation} from '../../context/LocationContext';
import type {RootStackParamList} from '../../types/navigation';
import {styles} from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseLocation'>;

const buildMapUrl = (latitude: number, longitude: number) =>
  `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=15&size=800x600&maptype=mapnik&markers=${latitude},${longitude},orang-pushpin`;

const ChooseLocationScreen = ({navigation}: Props) => {
  const {
    coordinates,
    deliveryAddress,
    liveAddress,
    isLocating,
    useCurrentLocation,
    confirmCurrentLocation,
  } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    useCurrentLocation();
  }, [useCurrentLocation]);

  const latitude = coordinates?.latitude ?? 31.5204;
  const longitude = coordinates?.longitude ?? 74.3587;
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
        <Image
          source={{uri: buildMapUrl(latitude, longitude)}}
          style={styles.mapImage}
          resizeMode="cover"
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

        <View style={styles.mapPinOverlay} pointerEvents="none">
          <Icon name="map-marker" size={42} color="#FF7622" />
        </View>

        {isLocating ? (
          <View style={styles.mapPinOverlay}>
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
            <Text style={styles.addressLabel}>Current location</Text>
            <Text style={styles.addressValue} numberOfLines={2}>
              {addressText}
            </Text>
          </View>
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
