import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppMap from '../../../components/AppMap';
import {styles} from './styles';
import useController from './useController';

const ChooseLocationScreen = () => {
  const {
    searchQuery,
    mapCenter,
    isLocating,
    addressText,
    setSearchQuery,
    onRegionChangeComplete,
    goBack,
    refreshGps,
    confirmLocation,
  } = useController();

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
            onPress={refreshGps}
            style={styles.gpsButton}>
            <Icon name="crosshairs-gps" size={20} color="#FF7622" />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          style={styles.confirmButton}
          onPress={confirmLocation}>
          <Text style={styles.confirmButtonText}>Confirm location</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ChooseLocationScreen;
