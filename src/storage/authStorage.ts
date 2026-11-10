import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole =
  | 'customer'
  | 'manager'
  | 'superadmin'
  | 'cashier'
  | 'kitchen';

export type StoredUser = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  /** Assigned branch for manager/cashier/kitchen. Superadmin has null (all branches). */
  branchId: string | null;
  /**
   * Manager-only: whether this manager may open Revenue.
   * Only superadmin can grant/revoke. Ignored for other roles.
   */
  canViewRevenue?: boolean;
};

/** @deprecated use MANAGER_EMAIL */
export const ADMIN_EMAIL = 'manager@foodapp.com';
/** @deprecated use MANAGER_PASSWORD */
export const ADMIN_PASSWORD = 'manager123';

export const MANAGER_EMAIL = 'manager@foodapp.com';
export const MANAGER_PASSWORD = 'manager123';

export const SUPERADMIN_EMAIL = 'superadmin@foodapp.com';
export const SUPERADMIN_PASSWORD = 'superadmin123';

export const CASHIER_EMAIL = 'cashier@foodapp.com';
export const CASHIER_PASSWORD = 'cashier123';

export const KITCHEN_EMAIL = 'kitchen@foodapp.com';
export const KITCHEN_PASSWORD = 'kitchen123';

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
  /** Manager-only permission granted by superadmin. */
  canViewRevenue?: boolean;
};

const DEFAULT_MANAGER: StoredUser = {
  name: 'Branch Manager',
  email: MANAGER_EMAIL,
  phone: '0000000000',
  password: MANAGER_PASSWORD,
  role: 'manager',
  branchId: 'gulberg',
  canViewRevenue: false,
};

/** Migrates legacy admin@ accounts to manager@ on seed. */
const LEGACY_ADMIN_EMAIL = 'admin@foodapp.com';

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

const DEFAULT_CASHIER: StoredUser = {
  name: 'Branch Cashier',
  email: CASHIER_EMAIL,
  phone: '03001112222',
  password: CASHIER_PASSWORD,
  role: 'cashier',
  branchId: 'gulberg',
};

const DEFAULT_KITCHEN: StoredUser = {
  name: 'Kitchen Staff',
  email: KITCHEN_EMAIL,
  phone: '03003334444',
  password: KITCHEN_PASSWORD,
  role: 'kitchen',
  branchId: 'gulberg',
};

/** Manager or superadmin — shared management portal access. */
export const hasManagerAccess = (role?: UserRole | null): boolean =>
  role === 'manager' || role === 'superadmin';

/** @deprecated use hasManagerAccess */
export const hasAdminAccess = hasManagerAccess;

/** Superadmin always; managers only when superadmin granted canViewRevenue. */
export const canAccessRevenue = (
  user?: Pick<SessionUser, 'role' | 'canViewRevenue'> | null,
): boolean => {
  if (!user) {
    return false;
  }
  if (user.role === 'superadmin') {
    return true;
  }
  if (user.role === 'manager') {
    return Boolean(user.canViewRevenue);
  }
  return false;
};

export const hasBranchStaffRole = (role?: UserRole | null): boolean =>
  role === 'manager' || role === 'cashier' || role === 'kitchen';

export const isStaffRole = (role?: UserRole | null): boolean =>
  role === 'manager' ||
  role === 'superadmin' ||
  role === 'cashier' ||
  role === 'kitchen';

export type StaffHomeRoute =
  | 'AdminOrders'
  | 'CashierOrders'
  | 'KitchenOrders'
  | 'MainTabs';

export const getHomeRouteForRole = (role?: UserRole | null): StaffHomeRoute => {
  switch (role) {
    case 'superadmin':
    case 'manager':
      return 'AdminOrders';
    case 'cashier':
      return 'CashierOrders';
    case 'kitchen':
      return 'KitchenOrders';
    default:
      return 'MainTabs';
  }
};

const normalizeRole = (role: unknown): UserRole => {
  if (role === 'superadmin') {
    return 'superadmin';
  }
  // Legacy 'admin' accounts become managers.
  if (role === 'manager' || role === 'admin') {
    return 'manager';
  }
  if (role === 'cashier') {
    return 'cashier';
  }
  if (role === 'kitchen') {
    return 'kitchen';
  }
  return 'customer';
};

const normalizeBranchId = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return null;
};

const normalizeCanViewRevenue = (
  role: UserRole,
  value: unknown,
): boolean | undefined => {
  if (role !== 'manager') {
    return undefined;
  }
  return value === true;
};

const normalizeStoredUser = (item: Partial<StoredUser>): StoredUser => {
  const role = normalizeRole(item.role);
  return {
    name: item.name ?? '',
    email: (item.email ?? '').toLowerCase(),
    phone: item.phone ?? '',
    password: item.password ?? '',
    role,
    branchId: normalizeBranchId(item.branchId),
    canViewRevenue: normalizeCanViewRevenue(role, item.canViewRevenue),
  };
};

const toSessionUser = (user: StoredUser): SessionUser => ({
  name: user.name,
  email: user.email,
  phone: user.phone || null,
  role: user.role,
  branchId: user.branchId,
  canViewRevenue: normalizeCanViewRevenue(user.role, user.canViewRevenue),
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

/** Ensures seeded staff + demo customer exist (idempotent). */
export const ensureAdminUser = async (): Promise<void> => {
  let users = await getStoredUsers();

  // Migrate legacy admin@foodapp.com → manager@foodapp.com
  const legacyIndex = users.findIndex(
    item => item.email === LEGACY_ADMIN_EMAIL,
  );
  if (legacyIndex >= 0) {
    const legacy = users[legacyIndex];
    const withoutLegacy = users.filter((_, i) => i !== legacyIndex);
    const managerExists = withoutLegacy.some(
      item => item.email === MANAGER_EMAIL,
    );
    users = managerExists
      ? withoutLegacy
      : [
          {
            ...legacy,
            email: MANAGER_EMAIL,
            name: legacy.name === 'Admin' ? 'Branch Manager' : legacy.name,
            role: 'manager',
            branchId: legacy.branchId ?? 'gulberg',
          },
          ...withoutLegacy,
        ];
  }

  // Normalize any leftover role: 'admin' → 'manager'
  users = users.map(item =>
    (item as {role: string}).role === 'admin'
      ? {...item, role: 'manager' as UserRole}
      : item,
  );

  const withManager = upsertSeededUser(users, DEFAULT_MANAGER);
  const withSuper = upsertSeededUser(withManager, DEFAULT_SUPERADMIN);
  const withCashier = upsertSeededUser(withSuper, DEFAULT_CASHIER);
  const withKitchen = upsertSeededUser(withCashier, DEFAULT_KITCHEN);
  const withDemo = upsertSeededUser(withKitchen, DEFAULT_CUSTOMER);

  await saveStoredUsers(withDemo);
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

export type StaffAccountRole = 'manager' | 'cashier' | 'kitchen';

export const isStaffAccountRole = (role: UserRole): role is StaffAccountRole =>
  role === 'manager' || role === 'cashier' || role === 'kitchen';

export const staffRoleLabel = (role: StaffAccountRole | UserRole): string => {
  switch (role) {
    case 'manager':
      return 'Manager';
    case 'cashier':
      return 'Cashier';
    case 'kitchen':
      return 'Kitchen';
    default:
      return 'Staff';
  }
};

/** Branch staff accounts managed by superadmin (manager / cashier / kitchen). */
export const listAdminAccounts = async (): Promise<StoredUser[]> => {
  await ensureAdminUser();
  const users = await getStoredUsers();
  return users
    .filter(item => isStaffAccountRole(item.role))
    .sort((a, b) => {
      const order = {manager: 0, cashier: 1, kitchen: 2} as const;
      const aOrder = isStaffAccountRole(a.role) ? order[a.role] : 9;
      const bOrder = isStaffAccountRole(b.role) ? order[b.role] : 9;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return a.name.localeCompare(b.name);
    });
};

/** Local-only customer signup — works without backend. */
export const createLocalCustomerAccount = async (payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<{ok: true} | {ok: false; error: string}> => {
  await ensureAdminUser();
  const email = payload.email.trim().toLowerCase();
  const name = payload.name.trim();
  const phone = payload.phone.trim();
  const password = payload.password;

  if (!email || !name || !phone || !password) {
    return {ok: false, error: 'Please fill all required fields.'};
  }

  if (password.length < 6) {
    return {ok: false, error: 'Password must be at least 6 characters.'};
  }

  const users = await getStoredUsers();
  if (users.some(item => item.email === email)) {
    return {ok: false, error: 'An account with this email already exists.'};
  }

  const nextUser: StoredUser = {
    name,
    email,
    phone,
    password,
    role: 'customer',
    branchId: null,
  };

  await saveStoredUsers([nextUser, ...users]);
  return {ok: true};
};

export const createAdminAccount = async (payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  branchId: string;
  role?: StaffAccountRole;
  canViewRevenue?: boolean;
}): Promise<{ok: true} | {ok: false; error: string}> => {
  await ensureAdminUser();
  const email = payload.email.trim().toLowerCase();
  const branchId = payload.branchId.trim();
  const role: StaffAccountRole = payload.role ?? 'manager';

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
    role,
    branchId,
    canViewRevenue: normalizeCanViewRevenue(role, payload.canViewRevenue),
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
  role?: StaffAccountRole;
  canViewRevenue?: boolean;
}): Promise<{ok: true} | {ok: false; error: string}> => {
  await ensureAdminUser();
  const email = payload.email.trim().toLowerCase();
  const users = await getStoredUsers();
  const index = users.findIndex(
    item => item.email === email && isStaffAccountRole(item.role),
  );

  if (index < 0) {
    return {ok: false, error: 'Staff account not found.'};
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
  const nextRole = payload.role ?? existing.role;
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
    role: nextRole,
    canViewRevenue: normalizeCanViewRevenue(
      nextRole,
      payload.canViewRevenue ?? existing.canViewRevenue,
    ),
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
    item => item.email === target && isStaffAccountRole(item.role),
  );

  if (!existing) {
    return {ok: false, error: 'Staff account not found.'};
  }

  await saveStoredUsers(
    users.filter(
      item =>
        !(item.email === target && isStaffAccountRole(item.role)),
    ),
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

    // Refresh permissions from stored account so superadmin grants apply on relaunch.
    const stored = await getStoredUserByEmail(parsed.email);
    if (stored) {
      return toSessionUser(stored);
    }

    const role = normalizeRole(parsed.role);
    return {
      name: parsed.name ?? '',
      email: parsed.email.toLowerCase(),
      phone: parsed.phone ?? null,
      role,
      branchId: normalizeBranchId(parsed.branchId),
      canViewRevenue: normalizeCanViewRevenue(role, parsed.canViewRevenue),
    };
  } catch {
    return null;
  }
};

export const saveSessionUser = async (user: SessionUser, token?: string) => {
  const email = user.email.trim().toLowerCase();
  const role = normalizeRole(user.role);
  await AsyncStorage.setItem(SESSION_KEY, email);
  await AsyncStorage.setItem(
    SESSION_USER_KEY,
    JSON.stringify({
      name: user.name,
      email,
      phone: user.phone,
      role,
      branchId: normalizeBranchId(user.branchId),
      canViewRevenue: normalizeCanViewRevenue(role, user.canViewRevenue),
    }),
  );
  if (token) {
    await AsyncStorage.setItem(SESSION_TOKEN_KEY, token);
  }
};

export const getSessionToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(SESSION_TOKEN_KEY);
};

export const updateLocalProfile = async (payload: {
  email: string;
  name: string;
  phone: string;
}): Promise<{ok: true; user: SessionUser} | {ok: false; error: string}> => {
  const email = payload.email.trim().toLowerCase();
  const name = payload.name.trim();
  const phone = payload.phone.trim();

  if (!name) {
    return {ok: false, error: 'Name is required.'};
  }
  if (phone && !/^\d{10,15}$/.test(phone.replace(/[\s-]/g, ''))) {
    return {ok: false, error: 'Enter a valid phone number (10–15 digits).'};
  }

  const users = await getStoredUsers();
  const index = users.findIndex(item => item.email === email);
  if (index < 0) {
    return {ok: false, error: 'Account not found.'};
  }

  const normalizedPhone = phone.replace(/[\s-]/g, '');
  const nextUsers = [...users];
  nextUsers[index] = {
    ...nextUsers[index],
    name,
    phone: normalizedPhone,
  };
  await saveStoredUsers(nextUsers);

  const updated = nextUsers[index];
  const sessionUser = toSessionUser(updated);
  await saveSessionUser(sessionUser);
  return {ok: true, user: sessionUser};
};

export const clearSession = async () => {
  await AsyncStorage.multiRemove([
    SESSION_KEY,
    SESSION_USER_KEY,
    SESSION_TOKEN_KEY,
  ]);
};
