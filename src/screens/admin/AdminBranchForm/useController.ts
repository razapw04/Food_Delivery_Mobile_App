import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import type {RouteProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  launchCamera,
  launchImageLibrary,
  type ImagePickerResponse,
} from 'react-native-image-picker';
import type {MapCoordinate} from '../../../components/AppMap';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {
  createBranchId,
  defaultBranchLogo,
  listBranches,
  upsertBranch,
} from '../../../storage/branchesStorage';
import type {RootStackParamList} from '../../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminBranchForm'>;
type Route = RouteProp<RootStackParamList, 'AdminBranchForm'>;

export type FieldErrors = {
  name?: string;
  address?: string;
  openFrom?: string;
  openTo?: string;
  location?: string;
};

const DEFAULT_COORDS: MapCoordinate = {
  latitude: 31.5204,
  longitude: 74.3587,
};

const ensureAndroidPermission = async (
  permission: (typeof PermissionsAndroid.PERMISSIONS)[keyof typeof PermissionsAndroid.PERMISSIONS],
  title: string,
  message: string,
) => {
  if (Platform.OS !== 'android') {
    return true;
  }
  const already = await PermissionsAndroid.check(permission);
  if (already) {
    return true;
  }
  const result = await PermissionsAndroid.request(permission, {
    title,
    message,
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  });
  return result === PermissionsAndroid.RESULTS.GRANTED;
};

const parseTimeToDate = (value: string) => {
  const match = value.trim().match(/^(\d{1,2})[:.](\d{2})$/);
  const date = new Date();
  if (!match) {
    date.setHours(11, 0, 0, 0);
    return date;
  }
  date.setHours(
    Math.min(23, Math.max(0, Number(match[1]))),
    Math.min(59, Math.max(0, Number(match[2]))),
    0,
    0,
  );
  return date;
};

const formatTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const isValidTime = (value: string) =>
  /^([01]?\d|2[0-3])[:.][0-5]\d$/.test(value.trim());

const useController = (route: Route) => {
  const navigation = useNavigation<Nav>();
  const {isSuperAdmin} = useAuth();
  const {refreshCatalog} = useCatalog();
  const editingId = route.params?.branchId;
  const isEditing = Boolean(editingId);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [openFrom, setOpenFrom] = useState('11:00');
  const [openTo, setOpenTo] = useState('23:00');
  const [mapCenter, setMapCenter] = useState<MapCoordinate>(DEFAULT_COORDS);
  const [locationLabel, setLocationLabel] = useState('');
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [logo, setLogo] = useState(defaultBranchLogo);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [activeTimeField, setActiveTimeField] = useState<
    'openFrom' | 'openTo' | null
  >(null);
  const [draftTime, setDraftTime] = useState(parseTimeToDate('11:00'));

  useEffect(() => {
    if (!isSuperAdmin) {
      navigation.replace('AdminTabs', {screen: 'AdminRevenue'});
    }
  }, [isSuperAdmin, navigation]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!editingId) {
        return;
      }
      const all = await listBranches();
      const existing = all.find(item => item.id === editingId);
      if (!existing || cancelled) {
        return;
      }
      setName(existing.name);
      setAddress(existing.address);
      setOpenFrom(existing.openFrom);
      setOpenTo(existing.openTo);
      setMapCenter({
        latitude: existing.latitude,
        longitude: existing.longitude,
      });
      setLocationLabel(existing.address);
      setLocationConfirmed(true);
      setLogo(existing.logo);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [editingId]);

  useEffect(() => {
    const lat = Number(route.params?.latitude);
    const lng = Number(route.params?.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setMapCenter({latitude: lat, longitude: lng});
    }
    if (route.params?.pickedAddress) {
      const picked = route.params.pickedAddress;
      setLocationLabel(picked);
      setAddress(prev => (prev.trim() ? prev : picked));
    }
    if (route.params?.locationConfirmed) {
      setLocationConfirmed(true);
      setErrors(prev => ({...prev, location: undefined}));
    }
  }, [
    route.params?.latitude,
    route.params?.longitude,
    route.params?.locationConfirmed,
    route.params?.pickedAddress,
  ]);

  const applyPickerResult = useCallback((response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }
    if (response.errorCode) {
      Alert.alert(
        'Image picker',
        response.errorMessage ?? 'Could not open the image picker.',
      );
      return;
    }
    const uri = response.assets?.[0]?.uri;
    if (uri) {
      setLogo(uri);
    }
  }, []);

  const pickFromGallery = useCallback(async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const ok = await ensureAndroidPermission(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        'Photos permission',
        'Allow access to photos to set a branch image.',
      );
      if (!ok) {
        Alert.alert('Permission needed', 'Photo access is required.');
        return;
      }
    } else if (Platform.OS === 'android') {
      const ok = await ensureAndroidPermission(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        'Storage permission',
        'Allow access to storage to set a branch image.',
      );
      if (!ok) {
        Alert.alert('Permission needed', 'Storage access is required.');
        return;
      }
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.85,
      },
      applyPickerResult,
    );
  }, [applyPickerResult]);

  const pickFromCamera = useCallback(async () => {
    const ok = await ensureAndroidPermission(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      'Camera permission',
      'Allow camera access to take a branch photo.',
    );
    if (!ok) {
      Alert.alert('Permission needed', 'Camera access is required.');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.85,
        saveToPhotos: false,
      },
      applyPickerResult,
    );
  }, [applyPickerResult]);

  const handlePickImage = useCallback(() => {
    Alert.alert('Branch image', 'Choose a photo source', [
      {text: 'Camera', onPress: () => void pickFromCamera()},
      {text: 'Gallery', onPress: () => void pickFromGallery()},
      {text: 'Cancel', style: 'cancel'},
    ]);
  }, [pickFromCamera, pickFromGallery]);

  const handleClearImage = useCallback(() => {
    setLogo(defaultBranchLogo);
  }, []);

  const openMapPicker = useCallback(() => {
    navigation.navigate('AdminBranchMapPick', {
      branchId: editingId,
      latitude: mapCenter.latitude,
      longitude: mapCenter.longitude,
      addressHint: locationLabel || address,
    });
  }, [
    address,
    editingId,
    locationLabel,
    mapCenter.latitude,
    mapCenter.longitude,
    navigation,
  ]);

  const openTimePicker = useCallback(
    (field: 'openFrom' | 'openTo') => {
      setDraftTime(parseTimeToDate(field === 'openTo' ? openTo : openFrom));
      setActiveTimeField(field);
    },
    [openFrom, openTo],
  );

  const closeTimePicker = useCallback(() => {
    setActiveTimeField(null);
  }, []);

  const onDraftTimeChange = useCallback((date?: Date) => {
    if (date) {
      setDraftTime(date);
    }
  }, []);

  const confirmTimePicker = useCallback(() => {
    if (!activeTimeField) {
      return;
    }
    const next = formatTime(draftTime);
    if (activeTimeField === 'openFrom') {
      setOpenFrom(next);
      setErrors(prev => ({...prev, openFrom: undefined}));
    } else {
      setOpenTo(next);
      setErrors(prev => ({...prev, openTo: undefined}));
    }
    setActiveTimeField(null);
  }, [activeTimeField, draftTime]);

  /** Android fires once and dismisses; apply immediately. */
  const onAndroidTimePicked = useCallback(
    (date?: Date) => {
      if (!activeTimeField) {
        setActiveTimeField(null);
        return;
      }
      if (!date) {
        setActiveTimeField(null);
        return;
      }
      const next = formatTime(date);
      if (activeTimeField === 'openFrom') {
        setOpenFrom(next);
        setErrors(prev => ({...prev, openFrom: undefined}));
      } else {
        setOpenTo(next);
        setErrors(prev => ({...prev, openTo: undefined}));
      }
      setActiveTimeField(null);
    },
    [activeTimeField],
  );

  const validate = useCallback((): FieldErrors => {
    const next: FieldErrors = {};
    if (name.trim().length < 2) {
      next.name = 'Branch name is required';
    }
    if (address.trim().length < 3) {
      next.address = 'Address is required';
    }
    if (!isValidTime(openFrom)) {
      next.openFrom = 'Pick opening time';
    }
    if (!isValidTime(openTo)) {
      next.openTo = 'Pick closing time';
    }
    if (!locationConfirmed) {
      next.location = 'Open map and confirm branch location';
    }
    return next;
  }, [address, locationConfirmed, name, openFrom, openTo]);

  const canSave = useMemo(() => {
    const next = validate();
    return Object.keys(next).length === 0 && !saving;
  }, [saving, validate]);

  const handleSave = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      Alert.alert(
        'Missing details',
        Object.values(nextErrors)[0] ?? 'Please complete the required fields.',
      );
      return;
    }

    setSaving(true);
    try {
      const branch = {
        id: editingId ?? createBranchId(name),
        name: name.trim(),
        address: address.trim(),
        openFrom: openFrom.trim(),
        openTo: openTo.trim(),
        latitude: mapCenter.latitude,
        longitude: mapCenter.longitude,
        distanceKm: 0,
        logo: (logo || '').trim() || defaultBranchLogo,
      };
      await upsertBranch(branch);
      await refreshCatalog();
      Alert.alert(
        isEditing ? 'Branch updated' : 'Branch added',
        `"${branch.name}" is now available across the app.`,
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    } catch (error) {
      Alert.alert(
        'Save failed',
        error instanceof Error ? error.message : "Couldn't save this branch.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const hasCustomLogo = Boolean(logo) && logo !== defaultBranchLogo;

  return {
    isEditing,
    name,
    setName: (value: string) => {
      setName(value);
      if (value.trim().length >= 2) {
        setErrors(prev => ({...prev, name: undefined}));
      }
    },
    address,
    setAddress: (value: string) => {
      setAddress(value);
      if (value.trim().length >= 3) {
        setErrors(prev => ({...prev, address: undefined}));
      }
    },
    openFrom,
    openTo,
    locationLabel,
    locationConfirmed,
    mapCenter,
    logo,
    hasCustomLogo,
    handlePickImage,
    handleClearImage,
    openMapPicker,
    openTimePicker,
    closeTimePicker,
    onDraftTimeChange,
    confirmTimePicker,
    onAndroidTimePicked,
    activeTimeField,
    draftTime,
    errors,
    saving,
    canSave,
    handleSave,
    handleBack,
  };
};

export default useController;
