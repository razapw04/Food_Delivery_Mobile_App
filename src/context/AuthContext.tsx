import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearSession,
  ensureAdminUser,
  getSessionEmail,
  getStoredUsers,
  hasAdminAccess,
  saveSessionEmail,
  saveStoredUsers,
  type StoredUser,
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

const toAuthUser = (stored: StoredUser): AuthUser => ({
  name: stored.name,
  email: stored.email,
  phone: stored.phone || null,
  role: stored.role,
});

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await ensureAdminUser();
        const sessionEmail = await getSessionEmail();
        if (!sessionEmail) {
          return;
        }

        const users = await getStoredUsers();
        const matched = users.find(
          item => item.email.toLowerCase() === sessionEmail.toLowerCase(),
        );

        if (matched) {
          setUser(toAuthUser(matched));
        } else {
          await clearSession();
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
      await ensureAdminUser();
      const email = payload.email.trim().toLowerCase();
      const users = await getStoredUsers();

      if (users.some(item => item.email.toLowerCase() === email)) {
        return {
          ok: false as const,
          error: 'An account with this email already exists. Please log in.',
        };
      }

      const newUser: StoredUser = {
        name: payload.name.trim(),
        email,
        phone: payload.phone.trim(),
        password: payload.password,
        role: 'customer',
      };

      await saveStoredUsers([...users, newUser]);

      return {ok: true as const};
    },
    [],
  );

  const login = useCallback(async (email: string, password: string) => {
    await ensureAdminUser();
    const normalizedEmail = email.trim().toLowerCase();
    const users = await getStoredUsers();
    const matched = users.find(
      item => item.email.toLowerCase() === normalizedEmail,
    );

    if (!matched) {
      return {
        ok: false as const,
        error: 'No account found. Please sign up first.',
      };
    }

    if (matched.password !== password) {
      return {
        ok: false as const,
        error: 'Incorrect password. Please try again.',
      };
    }

    await saveSessionEmail(matched.email);
    const authUser = toAuthUser(matched);
    setUser(authUser);

    return {
      ok: true as const,
      isAdmin: hasAdminAccess(authUser.role),
    };
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
