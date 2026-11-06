import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {queryClient} from '../lib/queryClient';
import {resetToLogin} from '../navigation/navigationRef';
import {ApiError} from '../services/apiClient';
import {loginRequest, signupRequest} from '../services/authApi';
import {setUnauthorizedHandler} from '../services/sessionEvents';
import {
  clearSession,
  ensureAdminUser,
  findLocalAuthUser,
  getSessionUser,
  getStoredUserByEmail,
  hasAdminAccess,
  saveSessionUser,
  type UserRole,
} from '../storage/authStorage';

export type AuthUser = {
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  branchId: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  /** True for both admin and superadmin (order management access). */
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<
    {ok: true; isAdmin: boolean} | {ok: false; error: string}
  >;
  signup: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ok: true} | {ok: false; error: string}>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    await clearSession();
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

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await clearSession();
      setUser(null);
      queryClient.clear();
      resetToLogin();
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  const signup = useCallback(
    async (payload: {
      name: string;
      email: string;
      phone: string;
      password: string;
    }) => {
      try {
        await signupRequest({
          name: payload.name.trim(),
          email: payload.email.trim().toLowerCase(),
          phone: payload.phone.trim(),
          password: payload.password,
        });
        return {ok: true as const};
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : 'Signup failed. Please try again.';
        return {ok: false as const, error: message};
      }
    },
    [],
  );

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    try {
      const {token, user: apiUser} = await loginRequest(trimmedEmail, password);
      await ensureAdminUser();
      const localUser = await getStoredUserByEmail(apiUser.email);
      const authUser: AuthUser = {
        name: apiUser.name,
        email: apiUser.email,
        phone: apiUser.phone || null,
        role: apiUser.role,
        branchId:
          apiUser.role === 'admin'
            ? localUser?.branchId ?? null
            : null,
      };
      await saveSessionUser(authUser, token);
      setUser(authUser);
      return {
        ok: true as const,
        isAdmin: hasAdminAccess(authUser.role),
      };
    } catch (error) {
      // Local fallback for demo/testing without backend (customer + admins).
      const localUser = await findLocalAuthUser(trimmedEmail, password);
      if (localUser) {
        const authUser: AuthUser = {
          name: localUser.name,
          email: localUser.email,
          phone: localUser.phone || null,
          role: localUser.role,
          branchId: localUser.role === 'admin' ? localUser.branchId : null,
        };
        await saveSessionUser(authUser);
        setUser(authUser);
        return {
          ok: true as const,
          isAdmin: hasAdminAccess(authUser.role),
        };
      }

      const message =
        error instanceof ApiError
          ? error.message
          : 'Login failed. Please try again.';
      return {ok: false as const, error: message};
    }
  }, []);

  const isAdmin = hasAdminAccess(user?.role);
  const isSuperAdmin = user?.role === 'superadmin';

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAdmin,
      isSuperAdmin,
      login,
      signup,
      logout,
    }),
    [user, isLoading, isAdmin, isSuperAdmin, login, signup, logout],
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
