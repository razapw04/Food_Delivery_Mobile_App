import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

type LocationResult = {
  latitude: number;
  longitude: number;
};

export const handleAccessLocation = async (
  onSuccess?: (coords: LocationResult) => void,
) => {
  if (Platform.OS === 'android') {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
      return;
    }
  }

  Geolocation.getCurrentPosition(
    position => {
      const {latitude, longitude} = position.coords;
      onSuccess?.({latitude, longitude});
    },
    error => {
      console.log('Location error:', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    },
  );
};
