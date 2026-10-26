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
  getSessionEmail,
  getStoredUsers,
  saveSessionEmail,
  saveStoredUsers,
  type StoredUser,
} from '../storage/authStorage';

export type AuthUser = {
  name: string;
  email: string;
  phone: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ok: true} | {ok: false; error: string}>;
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
});

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
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
      };

      await saveStoredUsers([...users, newUser]);

      return {ok: true as const};
    },
    [],
  );

  const login = useCallback(async (email: string, password: string) => {
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
    setUser(toAuthUser(matched));

    return {ok: true as const};
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      signup,
      logout,
    }),
    [user, isLoading, login, signup, logout],
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
