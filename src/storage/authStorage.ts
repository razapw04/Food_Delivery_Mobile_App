import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'customer' | 'admin' | 'superadmin';

export type StoredUser = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
};

export const ADMIN_EMAIL = 'admin@foodapp.com';
export const ADMIN_PASSWORD = 'admin123';

export const SUPERADMIN_EMAIL = 'superadmin@foodapp.com';
export const SUPERADMIN_PASSWORD = 'superadmin123';

const USERS_KEY = '@food_app/users';
const SESSION_KEY = '@food_app/session';

const DEFAULT_ADMIN: StoredUser = {
  name: 'Admin',
  email: ADMIN_EMAIL,
  phone: '0000000000',
  password: ADMIN_PASSWORD,
  role: 'admin',
};

const DEFAULT_SUPERADMIN: StoredUser = {
  name: 'Super Admin',
  email: SUPERADMIN_EMAIL,
  phone: '0000000001',
  password: SUPERADMIN_PASSWORD,
  role: 'superadmin',
};

export const hasAdminAccess = (role?: UserRole | null): boolean =>
  role === 'admin' || role === 'superadmin';

const normalizeRole = (role: unknown): UserRole => {
  if (role === 'superadmin') {
    return 'superadmin';
  }
  if (role === 'admin') {
    return 'admin';
  }
  return 'customer';
};

export const getStoredUsers = async (): Promise<StoredUser[]> => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item: Partial<StoredUser>) => ({
      name: item.name ?? '',
      email: (item.email ?? '').toLowerCase(),
      phone: item.phone ?? '',
      password: item.password ?? '',
      role: normalizeRole(item.role),
    }));
  } catch {
    return [];
  }
};

export const saveStoredUsers = async (users: StoredUser[]) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const upsertSeededUser = (
  users: StoredUser[],
  seeded: StoredUser,
): StoredUser[] => {
  const index = users.findIndex(
    item => item.email.toLowerCase() === seeded.email.toLowerCase(),
  );

  if (index < 0) {
    return [seeded, ...users];
  }

  const existing = users[index];
  if (existing.role === seeded.role) {
    return users;
  }

  const next = [...users];
  next[index] = {...existing, role: seeded.role};
  return next;
};

/** Ensures seeded admin + superadmin accounts exist (idempotent). */
export const ensureAdminUser = async (): Promise<void> => {
  const users = await getStoredUsers();
  const withAdmin = upsertSeededUser(users, DEFAULT_ADMIN);
  const withBoth = upsertSeededUser(withAdmin, DEFAULT_SUPERADMIN);

  if (withBoth !== users) {
    await saveStoredUsers(withBoth);
  }
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
