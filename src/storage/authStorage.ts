import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'customer' | 'admin' | 'superadmin';

export type StoredUser = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  /** Assigned branch for role=admin. Superadmin has null (all branches). */
  branchId: string | null;
};

export const ADMIN_EMAIL = 'admin@foodapp.com';
export const ADMIN_PASSWORD = 'admin123';

export const SUPERADMIN_EMAIL = 'superadmin@foodapp.com';
export const SUPERADMIN_PASSWORD = 'superadmin123';

/** Local-only demo customer — no backend required. */
export const DEMO_CUSTOMER_EMAIL = 'user@foodapp.com';
export const DEMO_CUSTOMER_PASSWORD = 'user123';

const USERS_KEY = '@food_app/users';
const SESSION_KEY = '@food_app/session';
const SESSION_USER_KEY = '@food_app/session_user';
const SESSION_TOKEN_KEY = '@food_app/session_token';
const REMEMBER_ME_KEY = '@food_app/remember_me';

export type SessionUser = {
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  branchId: string | null;
};

const DEFAULT_ADMIN: StoredUser = {
  name: 'Admin',
  email: ADMIN_EMAIL,
  phone: '0000000000',
  password: ADMIN_PASSWORD,
  role: 'admin',
  branchId: 'gulberg',
};

const DEFAULT_SUPERADMIN: StoredUser = {
  name: 'Super Admin',
  email: SUPERADMIN_EMAIL,
  phone: '0000000001',
  password: SUPERADMIN_PASSWORD,
  role: 'superadmin',
  branchId: null,
};

const DEFAULT_CUSTOMER: StoredUser = {
  name: 'Demo User',
  email: DEMO_CUSTOMER_EMAIL,
  phone: '03001234567',
  password: DEMO_CUSTOMER_PASSWORD,
  role: 'customer',
  branchId: null,
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

const normalizeBranchId = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return null;
};

const normalizeStoredUser = (item: Partial<StoredUser>): StoredUser => ({
  name: item.name ?? '',
  email: (item.email ?? '').toLowerCase(),
  phone: item.phone ?? '',
  password: item.password ?? '',
  role: normalizeRole(item.role),
  branchId: normalizeBranchId(item.branchId),
});

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
    return parsed.map((item: Partial<StoredUser>) => normalizeStoredUser(item));
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
  const needsRole = existing.role !== seeded.role;
  const needsBranch =
    seeded.branchId != null && existing.branchId == null;

  if (!needsRole && !needsBranch) {
    return users;
  }

  const next = [...users];
  next[index] = {
    ...existing,
    role: seeded.role,
    branchId: needsBranch ? seeded.branchId : existing.branchId,
  };
  return next;
};

/** Ensures seeded admin + superadmin + demo customer exist (idempotent). */
export const ensureAdminUser = async (): Promise<void> => {
  const users = await getStoredUsers();
  const withAdmin = upsertSeededUser(users, DEFAULT_ADMIN);
  const withSuper = upsertSeededUser(withAdmin, DEFAULT_SUPERADMIN);
  const withDemo = upsertSeededUser(withSuper, DEFAULT_CUSTOMER);

  if (withDemo !== users) {
    await saveStoredUsers(withDemo);
  }
};

export const getStoredUserByEmail = async (
  email: string,
): Promise<StoredUser | null> => {
  const users = await getStoredUsers();
  return (
    users.find(item => item.email === email.trim().toLowerCase()) ?? null
  );
};

export const findLocalAuthUser = async (
  email: string,
  password: string,
): Promise<StoredUser | null> => {
  await ensureAdminUser();
  const users = await getStoredUsers();
  const match = users.find(
    item =>
      item.email === email.trim().toLowerCase() && item.password === password,
  );
  return match ?? null;
};

export const resetLocalPassword = async (payload: {
  email: string;
  newPassword: string;
}): Promise<{ok: true} | {ok: false; error: string}> => {
  await ensureAdminUser();
  const email = payload.email.trim().toLowerCase();
  const newPassword = payload.newPassword;

  if (!email) {
    return {ok: false, error: 'Email is required.'};
  }
  if (newPassword.length < 6) {
    return {ok: false, error: 'Password must be at least 6 characters.'};
  }

  const users = await getStoredUsers();
  const index = users.findIndex(item => item.email === email);
  if (index < 0) {
    return {
      ok: false,
      error: 'No local account found for this email. Try a demo account email.',
    };
  }

  const next = [...users];
  next[index] = {...users[index], password: newPassword};
  await saveStoredUsers(next);
  return {ok: true};
};

export type RememberMePayload = {
  email: string;
  password: string;
};

export const getRememberMe = async (): Promise<RememberMePayload | null> => {
  const raw = await AsyncStorage.getItem(REMEMBER_ME_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<RememberMePayload>;
    if (!parsed.email || !parsed.password) {
      return null;
    }
    return {
      email: String(parsed.email),
      password: String(parsed.password),
    };
  } catch {
    return null;
  }
};

export const saveRememberMe = async (payload: RememberMePayload) => {
  await AsyncStorage.setItem(
    REMEMBER_ME_KEY,
    JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  );
};

export const clearRememberMe = async () => {
  await AsyncStorage.removeItem(REMEMBER_ME_KEY);
};

export const listAdminAccounts = async (): Promise<StoredUser[]> => {
  await ensureAdminUser();
  const users = await getStoredUsers();
  return users.filter(item => item.role === 'admin');
};

export const createAdminAccount = async (payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  branchId: string;
}): Promise<{ok: true} | {ok: false; error: string}> => {
  await ensureAdminUser();
  const email = payload.email.trim().toLowerCase();
  const branchId = payload.branchId.trim();

  if (!email || !payload.password || !payload.name.trim() || !branchId) {
    return {ok: false, error: 'Please fill all required fields.'};
  }

  if (payload.password.length < 6) {
    return {ok: false, error: 'Password must be at least 6 characters.'};
  }

  const users = await getStoredUsers();
  if (users.some(item => item.email === email)) {
    return {ok: false, error: 'An account with this email already exists.'};
  }

  const nextUser: StoredUser = {
    name: payload.name.trim(),
    email,
    phone: payload.phone.trim() || '0000000000',
    password: payload.password,
    role: 'admin',
    branchId,
  };

  await saveStoredUsers([nextUser, ...users]);
  return {ok: true};
};

export const updateAdminAccount = async (payload: {
  email: string;
  name: string;
  phone: string;
  password?: string;
  branchId: string;
}): Promise<{ok: true} | {ok: false; error: string}> => {
  await ensureAdminUser();
  const email = payload.email.trim().toLowerCase();
  const users = await getStoredUsers();
  const index = users.findIndex(
    item => item.email === email && item.role === 'admin',
  );

  if (index < 0) {
    return {ok: false, error: 'Admin account not found.'};
  }

  if (!payload.name.trim() || !payload.branchId.trim()) {
    return {ok: false, error: 'Please fill all required fields.'};
  }

  if (payload.password != null && payload.password.length > 0) {
    if (payload.password.length < 6) {
      return {ok: false, error: 'Password must be at least 6 characters.'};
    }
  }

  const existing = users[index];
  const next = [...users];
  next[index] = {
    ...existing,
    name: payload.name.trim(),
    phone: payload.phone.trim() || existing.phone,
    password:
      payload.password && payload.password.length > 0
        ? payload.password
        : existing.password,
    branchId: payload.branchId.trim(),
  };
  await saveStoredUsers(next);
  return {ok: true};
};

export const removeAdminAccount = async (
  email: string,
): Promise<{ok: true} | {ok: false; error: string}> => {
  await ensureAdminUser();
  const target = email.trim().toLowerCase();
  const users = await getStoredUsers();
  const existing = users.find(
    item => item.email === target && item.role === 'admin',
  );

  if (!existing) {
    return {ok: false, error: 'Admin account not found.'};
  }

  await saveStoredUsers(
    users.filter(item => !(item.email === target && item.role === 'admin')),
  );
  return {ok: true};
};

export const getSessionEmail = async (): Promise<string | null> => {
  return AsyncStorage.getItem(SESSION_KEY);
};

export const saveSessionEmail = async (email: string) => {
  await AsyncStorage.setItem(SESSION_KEY, email.trim().toLowerCase());
};

export const getSessionUser = async (): Promise<SessionUser | null> => {
  const raw = await AsyncStorage.getItem(SESSION_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SessionUser>;
    if (!parsed?.email) {
      return null;
    }
    return {
      name: parsed.name ?? '',
      email: parsed.email.toLowerCase(),
      phone: parsed.phone ?? null,
      role: normalizeRole(parsed.role),
      branchId: normalizeBranchId(parsed.branchId),
    };
  } catch {
    return null;
  }
};

export const saveSessionUser = async (user: SessionUser, token?: string) => {
  const email = user.email.trim().toLowerCase();
  await AsyncStorage.setItem(SESSION_KEY, email);
  await AsyncStorage.setItem(
    SESSION_USER_KEY,
    JSON.stringify({
      name: user.name,
      email,
      phone: user.phone,
      role: normalizeRole(user.role),
      branchId: normalizeBranchId(user.branchId),
    }),
  );
  if (token) {
    await AsyncStorage.setItem(SESSION_TOKEN_KEY, token);
  }
};

export const getSessionToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(SESSION_TOKEN_KEY);
};

export const clearSession = async () => {
  await AsyncStorage.multiRemove([
    SESSION_KEY,
    SESSION_USER_KEY,
    SESSION_TOKEN_KEY,
  ]);
};
