import AsyncStorage from '@react-native-async-storage/async-storage';

export type SavedAddress = {
  id: string;
  label: string;
  address: string;
};

const ADDRESSES_KEY = '@food_app/saved_addresses';

export const getStoredAddresses = async (): Promise<SavedAddress[]> => {
  const raw = await AsyncStorage.getItem(ADDRESSES_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveStoredAddresses = async (addresses: SavedAddress[]) => {
  await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
};
