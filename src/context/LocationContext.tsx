import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export type SavedAddress = {
  id: string;
  label: string;
  address: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationContextValue = {
  deliveryAddress: string;
  liveAddress: string | null;
  selectedAddress: string | null;
  coordinates: Coordinates;
  isLocating: boolean;
  savedAddresses: SavedAddress[];
  selectAddress: (address: string) => void;
  useCurrentLocation: () => Promise<void>;
  addSavedAddress: (label: string, address: string) => void;
  confirmCurrentLocation: () => void;
};

const FALLBACK_ADDRESS = 'Select delivery address';
const FALLBACK_COORDS: Coordinates = {
  latitude: 31.5204,
  longitude: 74.3587,
};

export const savedAddressesSeed: SavedAddress[] = [];

const LocationContext = createContext<LocationContextValue | null>(null);

const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('whenInUse');
    return status === 'granted';
  }

  const fine = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (fine === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  const coarse = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  );
  return coarse === PermissionsAndroid.RESULTS.GRANTED;
};

const buildStreetLine = (parts: Record<string, string | undefined>) => {
  const house =
    parts.house_number ||
    parts.house_name ||
    parts.building ||
    parts.amenity ||
    '';
  const street =
    parts.road ||
    parts.pedestrian ||
    parts.footway ||
    parts.path ||
    parts.residential ||
    '';

  if (house && street) {
    return `House ${house}, ${street}`;
  }
  if (street) {
    return street;
  }
  if (house) {
    return `House ${house}`;
  }
  return '';
};

const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'FoodDeliveryApp/1.0',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Reverse geocode failed');
    }

    const data = await response.json();
    const parts = (data?.address ?? {}) as Record<string, string | undefined>;
    const streetLine = buildStreetLine(parts);
    const area =
      parts.neighbourhood ||
      parts.suburb ||
      parts.quarter ||
      parts.residential ||
      parts.city_district ||
      parts.county;
    const city =
      parts.city || parts.town || parts.village || parts.municipality || parts.state;
    const postcode = parts.postcode;

    const detailed = [streetLine, area, city, postcode]
      .filter(Boolean)
      .join(', ');

    if (detailed) {
      return detailed;
    }

    if (typeof data?.display_name === 'string' && data.display_name.trim()) {
      return data.display_name;
    }

    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch {
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
};

const readPosition = (
  enableHighAccuracy: boolean,
  timeout: number,
): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => reject(error),
      {
        enableHighAccuracy,
        timeout,
        maximumAge: enableHighAccuracy ? 5000 : 60000,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  });

const getDevicePosition = async (): Promise<Coordinates> => {
  try {
    return await readPosition(true, 20000);
  } catch {
    // Indoor / weak GPS: fall back to network location
    return readPosition(false, 20000);
  }
};

export const LocationProvider = ({children}: {children: React.ReactNode}) => {
  const [liveAddress, setLiveAddress] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [savedAddresses, setSavedAddresses] =
    useState<SavedAddress[]>(savedAddressesSeed);

  const fetchLiveAddress = useCallback(async (): Promise<string | null> => {
    setIsLocating(true);
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        return null;
      }

      const coords = await getDevicePosition();
      setCoordinates(coords);
      const address = await reverseGeocode(coords.latitude, coords.longitude);
      setLiveAddress(address);
      return address;
    } catch {
      return null;
    } finally {
      setIsLocating(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveAddress();
  }, [fetchLiveAddress]);

  const selectAddress = useCallback((address: string) => {
    setSelectedAddress(address);
  }, []);

  const useCurrentLocation = useCallback(async () => {
    const address = await fetchLiveAddress();
    if (address) {
      setSelectedAddress(null);
    }
  }, [fetchLiveAddress]);

  const confirmCurrentLocation = useCallback(() => {
    if (!liveAddress) {
      return;
    }

    setSelectedAddress(liveAddress);
    setSavedAddresses(prev => {
      if (prev.some(item => item.address === liveAddress)) {
        return prev;
      }

      return [
        {
          id: `loc-${Date.now()}`,
          label: 'Location',
          address: liveAddress,
        },
        ...prev,
      ];
    });
  }, [liveAddress]);

  const addSavedAddress = useCallback((label: string, address: string) => {
    setSavedAddresses(prev => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        label,
        address,
      },
    ]);
    setSelectedAddress(address);
  }, []);

  const deliveryAddress =
    selectedAddress ?? liveAddress ?? FALLBACK_ADDRESS;

  const value = useMemo(
    () => ({
      deliveryAddress,
      liveAddress,
      selectedAddress,
      coordinates: coordinates ?? FALLBACK_COORDS,
      isLocating,
      savedAddresses,
      selectAddress,
      useCurrentLocation,
      addSavedAddress,
      confirmCurrentLocation,
    }),
    [
      deliveryAddress,
      liveAddress,
      selectedAddress,
      coordinates,
      isLocating,
      savedAddresses,
      selectAddress,
      useCurrentLocation,
      addSavedAddress,
      confirmCurrentLocation,
    ],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextValue => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};
