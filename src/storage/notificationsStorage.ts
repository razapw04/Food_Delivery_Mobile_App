import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  orderId?: string;
  /** e.g. inventory_request */
  type?: string;
  targetRole?: 'manager' | 'superadmin' | 'cashier' | 'kitchen' | 'all';
  targetBranchId?: string | null;
  relatedId?: string;
};

const NOTIFICATIONS_KEY = '@food_app/notifications';

export const getStoredNotifications = async (): Promise<AppNotification[]> => {
  const raw = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
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

export const saveStoredNotifications = async (
  notifications: AppNotification[],
) => {
  await AsyncStorage.setItem(
    NOTIFICATIONS_KEY,
    JSON.stringify(notifications),
  );
};

export const addStoredNotification = async (
  notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'> & {
    id?: string;
    createdAt?: string;
    read?: boolean;
  },
) => {
  const existing = await getStoredNotifications();
  const next: AppNotification = {
    id: notification.id ?? `notif-${Date.now()}`,
    title: notification.title,
    body: notification.body,
    createdAt: notification.createdAt ?? new Date().toISOString(),
    read: notification.read ?? false,
    orderId: notification.orderId,
    type: notification.type,
    targetRole: notification.targetRole,
    targetBranchId: notification.targetBranchId,
    relatedId: notification.relatedId,
  };
  await saveStoredNotifications([next, ...existing]);
  return next;
};

export const listNotificationsForAudience = async (options: {
  role?: string | null;
  branchId?: string | null;
}): Promise<AppNotification[]> => {
  const items = await getStoredNotifications();
  return items.filter(item => {
    if (!item.targetRole || item.targetRole === 'all') {
      return true;
    }
    if (item.targetRole !== options.role) {
      return false;
    }
    if (
      item.targetBranchId &&
      options.branchId &&
      item.targetBranchId !== options.branchId
    ) {
      return false;
    }
    return true;
  });
};

export const markAllNotificationsRead = async () => {
  const existing = await getStoredNotifications();
  const next = existing.map(item => ({...item, read: true}));
  await saveStoredNotifications(next);
  return next;
};
