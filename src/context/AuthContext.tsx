import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {queryClient} from '../lib/queryClient';
import {
  canAccessRevenue,
  clearSession,
  createLocalCustomerAccount,
  ensureAdminUser,
  findLocalAuthUser,
  getHomeRouteForRole,
  getSessionUser,
  hasAdminAccess,
  isStaffRole,
  saveSessionUser,
  updateLocalProfile,
  type StaffHomeRoute,
  type UserRole,
} from '../storage/authStorage';

export type AuthUser = {
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  branchId: string | null;
  canViewRevenue?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  /** True for manager or superadmin (management portal). */
  isAdmin: boolean;
  /** Branch manager only (not superadmin). */
  isManager: boolean;
  isSuperAdmin: boolean;
  isCashier: boolean;
  isKitchen: boolean;
  /** Any non-customer staff account. */
  isStaff: boolean;
  /** Superadmin always; managers only if superadmin granted revenue access. */
  canViewRevenue: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<
    | {ok: true; homeRoute: StaffHomeRoute; isAdmin: boolean}
    | {ok: false; error: string}
  >;
  signup: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ok: true} | {ok: false; error: string}>;
  updateProfile: (payload: {
    name: string;
    phone: string;
  }) => Promise<{ok: true} | {ok: false; error: string}>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await queryClient.cancelQueries();
    } catch {
      // ignore cancel errors
    }

    try {
      await clearSession();
    } catch {
      // ignore storage errors — still end the session locally
    }

    setUser(null);
    queryClient.clear();
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await ensureAdminUser();
        const sessionUser = await getSessionUser();
        if (sessionUser) {
          setUser(sessionUser);
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signup = useCallback(
    async (payload: {
      name: string;
      email: string;
      phone: string;
      password: string;
    }) => {
      const normalized = {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone.trim(),
        password: payload.password,
      };

      const localResult = await createLocalCustomerAccount(normalized);
      if (!localResult.ok) {
        return {ok: false as const, error: localResult.error};
      }

      return {ok: true as const};
    },
    [],
  );

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const localUser = await findLocalAuthUser(trimmedEmail, password);

    if (!localUser) {
      return {
        ok: false as const,
        error: 'Invalid email or password.',
      };
    }

    const authUser: AuthUser = {
      name: localUser.name,
      email: localUser.email,
      phone: localUser.phone || null,
      role: localUser.role,
      branchId:
        localUser.role === 'superadmin' || localUser.role === 'customer'
          ? null
          : localUser.branchId,
      canViewRevenue:
        localUser.role === 'manager'
          ? Boolean(localUser.canViewRevenue)
          : undefined,
    };
    await saveSessionUser(authUser);
    setUser(authUser);
    return {
      ok: true as const,
      homeRoute: getHomeRouteForRole(authUser.role),
      isAdmin: hasAdminAccess(authUser.role),
    };
  }, []);

  const updateProfile = useCallback(
    async (payload: {name: string; phone: string}) => {
      if (!user?.email) {
        return {ok: false as const, error: 'You must be signed in.'};
      }
      const result = await updateLocalProfile({
        email: user.email,
        name: payload.name,
        phone: payload.phone,
      });
      if (!result.ok) {
        return {ok: false as const, error: result.error};
      }
      setUser(result.user);
      return {ok: true as const};
    },
    [user?.email],
  );

  const isAdmin = hasAdminAccess(user?.role);
  const isManager = user?.role === 'manager';
  const isSuperAdmin = user?.role === 'superadmin';
  const isCashier = user?.role === 'cashier';
  const isKitchen = user?.role === 'kitchen';
  const isStaff = isStaffRole(user?.role);
  const canViewRevenue = canAccessRevenue(user);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAdmin,
      isManager,
      isSuperAdmin,
      isCashier,
      isKitchen,
      isStaff,
      canViewRevenue,
      login,
      signup,
      updateProfile,
      logout,
    }),
    [
      user,
      isLoading,
      isAdmin,
      isManager,
      isSuperAdmin,
      isCashier,
      isKitchen,
      isStaff,
      canViewRevenue,
      login,
      signup,
      updateProfile,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export {AuthProvider};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
