import AsyncStorage from '@react-native-async-storage/async-storage';

export type StoredUser = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

const USERS_KEY = '@food_app/users';
const SESSION_KEY = '@food_app/session';

export const getStoredUsers = async (): Promise<StoredUser[]> => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
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

export const saveStoredUsers = async (users: StoredUser[]) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getSessionEmail = async (): Promise<string | null> => {
  return AsyncStorage.getItem(SESSION_KEY);
};

export const saveSessionEmail = async (email: string) => {
  await AsyncStorage.setItem(SESSION_KEY, email.trim().toLowerCase());
};

export const clearSession = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};
