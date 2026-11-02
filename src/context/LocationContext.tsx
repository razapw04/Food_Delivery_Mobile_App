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
import {
  getStoredAddresses,
  saveStoredAddresses,
  type SavedAddress,
} from '../storage/addressesStorage';
import {getStoredOrders} from '../storage/orderStorage';

export type {SavedAddress};

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

const buildHouseLabel = (parts: Record<string, string | undefined>) => {
  const houseNumber = parts.house_number || parts.housenumber;
  const houseName =
    parts.house_name ||
    parts.building ||
    parts.amenity ||
    parts.shop ||
    parts.office ||
    '';

  if (houseNumber && houseName) {
    return `House ${houseNumber}, ${houseName}`;
  }
  if (houseNumber) {
    return `House ${houseNumber}`;
  }
  if (houseName) {
    return houseName;
  }
  return '';
};

const buildStreetLine = (parts: Record<string, string | undefined>) => {
  const house = buildHouseLabel(parts);
  const street =
    parts.road ||
    parts.pedestrian ||
    parts.footway ||
    parts.path ||
    parts.residential ||
    '';

  if (house && street) {
    return `${house}, ${street}`;
  }
  if (street) {
    return street;
  }
  if (house) {
    return house;
  }
  return '';
};

const isCoordinateLabel = (value: string) =>
  /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(value.trim());

const reverseGeocodeNominatim = async (
  latitude: number,
  longitude: number,
): Promise<string | null> => {
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
    return null;
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

  const detailed = [streetLine, area, city, postcode].filter(Boolean).join(', ');
  if (detailed) {
    return detailed;
  }

  if (typeof data?.display_name === 'string' && data.display_name.trim()) {
    return data.display_name.trim();
  }

  return null;
};

const reverseGeocodeBigDataCloud = async (
  latitude: number,
  longitude: number,
): Promise<string | null> => {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const line1 =
    data?.localityInfo?.informative?.[0]?.name ||
    data?.locality ||
    data?.city ||
    '';
  const line2 = [
    data?.principalSubdivision,
    data?.countryName,
    data?.postcode,
  ]
    .filter(Boolean)
    .join(', ');

  const composed = [line1, line2].filter(Boolean).join(', ');
  if (composed) {
    return composed;
  }

  if (typeof data?.formatted === 'string' && data.formatted.trim()) {
    return data.formatted.trim();
  }

  return null;
};

const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<string> => {
  try {
    const nominatim = await reverseGeocodeNominatim(latitude, longitude);
    if (nominatim && !isCoordinateLabel(nominatim)) {
      return nominatim;
    }
  } catch {
    // try fallback provider below
  }

  try {
    const bigData = await reverseGeocodeBigDataCloud(latitude, longitude);
    if (bigData && !isCoordinateLabel(bigData)) {
      return bigData;
    }
  } catch {
    // final fallback below
  }

  return FALLBACK_ADDRESS;
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
  const [addressesReady, setAddressesReady] = useState(false);

  useEffect(() => {
    let active = true;
    const loadAddresses = async () => {
      const stored = await getStoredAddresses();
      const orders = await getStoredOrders();
      const fromOrders: SavedAddress[] = [];

      orders.forEach(order => {
        if (order.orderMode !== 'delivery') {
          return;
        }
        const address = order.deliveryAddress?.trim();
        if (
          !address ||
          address === FALLBACK_ADDRESS ||
          fromOrders.some(item => item.address === address) ||
          stored.some(item => item.address === address)
        ) {
          return;
        }
        fromOrders.push({
          id: `order-${order.id}`,
          label: 'Location',
          address,
        });
      });

      if (!active) {
        return;
      }

      const merged = [...fromOrders, ...stored];
      setSavedAddresses(merged);
      if (fromOrders.length > 0) {
        await saveStoredAddresses(merged);
      }
      setAddressesReady(true);
    };
    loadAddresses();
    return () => {
      active = false;
    };
  }, []);

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
      if (!address || address === FALLBACK_ADDRESS || isCoordinateLabel(address)) {
        return null;
      }

      setLiveAddress(address);
      setSelectedAddress(prev =>
        prev && isCoordinateLabel(prev) ? address : prev,
      );
      setSavedAddresses(prev => {
        const next = prev.map(item =>
          isCoordinateLabel(item.address) ? {...item, address} : item,
        );
        if (addressesReady) {
          saveStoredAddresses(next);
        }
        return next;
      });
      return address;
    } catch {
      return null;
    } finally {
      setIsLocating(false);
    }
  }, [addressesReady]);

  useEffect(() => {
    fetchLiveAddress();
  }, [fetchLiveAddress]);

  const selectAddress = useCallback((address: string) => {
    if (!address || isCoordinateLabel(address)) {
      return;
    }
    setSelectedAddress(address);
  }, []);

  const useCurrentLocation = useCallback(async () => {
    const address = await fetchLiveAddress();
    if (address) {
      setSelectedAddress(null);
    }
  }, [fetchLiveAddress]);

  const confirmCurrentLocation = useCallback(() => {
    if (!liveAddress || isCoordinateLabel(liveAddress)) {
      return;
    }

    setSelectedAddress(liveAddress);
    setSavedAddresses(prev => {
      if (prev.some(item => item.address === liveAddress)) {
        return prev;
      }

      const next = [
        {
          id: `loc-${Date.now()}`,
          label: 'Location',
          address: liveAddress,
        },
        ...prev,
      ];
      saveStoredAddresses(next);
      return next;
    });
  }, [liveAddress]);

  const addSavedAddress = useCallback(
    (label: string, address: string) => {
      if (!address || isCoordinateLabel(address) || address === FALLBACK_ADDRESS) {
        return;
      }

      setSavedAddresses(prev => {
        if (prev.some(item => item.address === address)) {
          return prev;
        }

        const next = [
          {
            id: `custom-${Date.now()}`,
            label,
            address,
          },
          ...prev,
        ];
        saveStoredAddresses(next);
        return next;
      });
      setSelectedAddress(address);
    },
    [],
  );

  const resolvedLive =
    liveAddress && !isCoordinateLabel(liveAddress) ? liveAddress : null;
  const resolvedSelected =
    selectedAddress && !isCoordinateLabel(selectedAddress)
      ? selectedAddress
      : null;
  const deliveryAddress =
    resolvedSelected ?? resolvedLive ?? FALLBACK_ADDRESS;

  const value = useMemo(
    () => ({
      deliveryAddress,
      liveAddress: resolvedLive,
      selectedAddress: resolvedSelected,
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
      resolvedLive,
      resolvedSelected,
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
