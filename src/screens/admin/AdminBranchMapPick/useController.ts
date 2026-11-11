import {useCallback, useEffect, useRef, useState} from 'react';
import {Alert} from 'react-native';
import type {RouteProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {MapCoordinate} from '../../../components/AppMap';
import type {RootStackParamList} from '../../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminBranchMapPick'>;
type Route = RouteProp<RootStackParamList, 'AdminBranchMapPick'>;

type SearchHit = {
  id: string;
  label: string;
  meta: string;
  latitude: number;
  longitude: number;
};

const DEFAULT_COORDS: MapCoordinate = {
  latitude: 31.5204,
  longitude: 74.3587,
};

const reverseGeocode = async (coords: MapCoordinate): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'FoodDeliveryApp/1.0',
        },
      },
    );
    if (!response.ok) {
      return `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
    }
    const data = await response.json();
    if (typeof data?.display_name === 'string' && data.display_name.trim()) {
      return data.display_name.trim();
    }
  } catch {
    // fall through
  }
  return `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
};

const searchPlaces = async (query: string): Promise<SearchHit[]> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query,
    )}&addressdetails=1&limit=6`,
    {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'FoodDeliveryApp/1.0',
      },
    },
  );
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    return [];
  }
  return data
    .map((item, index) => {
      const lat = Number(item.lat);
      const lon = Number(item.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return null;
      }
      const label =
        typeof item.display_name === 'string'
          ? item.display_name.split(',').slice(0, 2).join(',').trim()
          : 'Location';
      return {
        id: String(item.place_id ?? `${lat}-${lon}-${index}`),
        label,
        meta:
          typeof item.display_name === 'string' ? item.display_name : label,
        latitude: lat,
        longitude: lon,
      };
    })
    .filter((item): item is SearchHit => item != null);
};

const useController = (route: Route) => {
  const navigation = useNavigation<Nav>();
  const initialLat = Number(route.params?.latitude);
  const initialLng = Number(route.params?.longitude);
  const branchId = route.params?.branchId;

  const [searchQuery, setSearchQuery] = useState(
    route.params?.addressHint ?? '',
  );
  const [suggestions, setSuggestions] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [mapCenter, setMapCenter] = useState<MapCoordinate>({
    latitude: Number.isFinite(initialLat) ? initialLat : DEFAULT_COORDS.latitude,
    longitude: Number.isFinite(initialLng)
      ? initialLng
      : DEFAULT_COORDS.longitude,
  });
  const [addressText, setAddressText] = useState(
    route.params?.addressHint?.trim() || 'Move the map or search a place',
  );
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resolveAddress = useCallback(async (coords: MapCoordinate) => {
    setIsResolving(true);
    try {
      const label = await reverseGeocode(coords);
      setAddressText(label);
    } finally {
      setIsResolving(false);
    }
  }, []);

  useEffect(() => {
    void resolveAddress(mapCenter);
    // initial only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    const query = searchQuery.trim();
    if (query.length < 3) {
      setSuggestions([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchTimer.current = setTimeout(() => {
      void (async () => {
        try {
          setSuggestions(await searchPlaces(query));
        } catch {
          setSuggestions([]);
        } finally {
          setSearching(false);
        }
      })();
    }, 450);
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [searchQuery]);

  const onRegionChangeComplete = useCallback(
    (coords: MapCoordinate) => {
      const next = {
        latitude: Number(coords.latitude),
        longitude: Number(coords.longitude),
      };
      if (!Number.isFinite(next.latitude) || !Number.isFinite(next.longitude)) {
        return;
      }
      setMapCenter(next);
      if (resolveTimer.current) {
        clearTimeout(resolveTimer.current);
      }
      resolveTimer.current = setTimeout(() => {
        void resolveAddress(next);
      }, 280);
    },
    [resolveAddress],
  );

  const selectSuggestion = useCallback(
    (hit: SearchHit) => {
      const next = {latitude: hit.latitude, longitude: hit.longitude};
      setMapCenter(next);
      setAddressText(hit.meta);
      setSearchQuery(hit.label);
      setSuggestions([]);
      void resolveAddress(next);
    },
    [resolveAddress],
  );

  const confirmLocation = useCallback(() => {
    if (
      !Number.isFinite(mapCenter.latitude) ||
      !Number.isFinite(mapCenter.longitude)
    ) {
      Alert.alert('Location required', 'Please pick a valid map location.');
      return;
    }
    navigation.navigate({
      name: 'AdminBranchForm',
      params: {
        branchId,
        latitude: mapCenter.latitude,
        longitude: mapCenter.longitude,
        pickedAddress: addressText,
        locationConfirmed: true,
      },
      merge: true,
    });
  }, [addressText, branchId, mapCenter.latitude, mapCenter.longitude, navigation]);

  const goBack = () => {
    navigation.goBack();
  };

  return {
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
  };
};

export default useController;
