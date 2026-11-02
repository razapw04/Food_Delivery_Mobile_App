import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {DeviceEventEmitter} from 'react-native';
import {
  getStoredNotifications,
  markAllNotificationsRead,
  type AppNotification,
} from '../storage/notificationsStorage';
import {
  NOTIFICATIONS_UPDATED_EVENT,
  notifyInApp,
} from '../services/pushNotifications';

type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  addNotification: (input: {
    title: string;
    body: string;
    orderId?: string;
  }) => Promise<void>;
  markAllRead: () => Promise<void>;
};

const NotificationsContext =
  createContext<NotificationsContextValue | null>(null);

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const refreshNotifications = useCallback(async () => {
    const items = await getStoredNotifications();
    setNotifications(items);
  }, []);

  useEffect(() => {
    refreshNotifications();
    const sub = DeviceEventEmitter.addListener(
      NOTIFICATIONS_UPDATED_EVENT,
      () => {
        refreshNotifications();
      },
    );
    return () => sub.remove();
  }, [refreshNotifications]);

  const addNotification = useCallback(
    async (input: {title: string; body: string; orderId?: string}) => {
      // Shows Notifee banner (in-app) + saves to notification list.
      await notifyInApp(input.title, input.body, input.orderId);
      await refreshNotifications();
    },
    [refreshNotifications],
  );

  const markAllRead = useCallback(async () => {
    const next = await markAllNotificationsRead();
    setNotifications(next);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter(item => !item.read).length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      refreshNotifications,
      addNotification,
      markAllRead,
    }),
    [
      notifications,
      unreadCount,
      refreshNotifications,
      addNotification,
      markAllRead,
    ],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextValue => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within NotificationsProvider',
    );
  }
  return context;
};
