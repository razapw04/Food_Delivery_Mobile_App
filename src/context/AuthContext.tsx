import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {ApiError} from '../services/apiClient';
import {loginRequest, signupRequest} from '../services/authApi';
import {
  clearSession,
  getSessionUser,
  hasAdminAccess,
  saveSessionUser,
  type UserRole,
} from '../storage/authStorage';

export type AuthUser = {
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
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

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
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
    try {
      const {token, user: apiUser} = await loginRequest(
        email.trim().toLowerCase(),
        password,
      );
      const authUser: AuthUser = {
        name: apiUser.name,
        email: apiUser.email,
        phone: apiUser.phone || null,
        role: apiUser.role,
      };
      await saveSessionUser(authUser, token);
      setUser(authUser);
      return {
        ok: true as const,
        isAdmin: hasAdminAccess(authUser.role),
      };
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Login failed. Please try again.';
      return {ok: false as const, error: message};
    }
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
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

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
