import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@food_app/favorites';

export const getStoredFavoriteIds = async (): Promise<string[]> => {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(item => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
};

export const saveStoredFavoriteIds = async (ids: string[]) => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
};
