import {DeviceEventEmitter, Platform, PermissionsAndroid} from 'react-native';
import notifee, {
  AndroidImportance,
  EventType,
  type Event,
} from '@notifee/react-native';
import {addStoredNotification} from '../storage/notificationsStorage';

export const NOTIFICATIONS_UPDATED_EVENT = 'notifications_updated';

const CHANNEL_ID = 'food_delivery_default';
const CHANNEL_NAME = 'Order updates';

type RemoteMessageLike = {
  messageId?: string;
  notification?: {
    title?: string;
    body?: string;
  };
  data?: Record<string, string | object | undefined>;
};

type MessagingInstance = ReturnType<
  typeof import('@react-native-firebase/messaging').getMessaging
>;

type MessagingApi = {
  getMessaging: typeof import('@react-native-firebase/messaging').getMessaging;
  getToken: typeof import('@react-native-firebase/messaging').getToken;
  onMessage: typeof import('@react-native-firebase/messaging').onMessage;
  onTokenRefresh: typeof import('@react-native-firebase/messaging').onTokenRefresh;
  requestPermission: typeof import('@react-native-firebase/messaging').requestPermission;
  registerDeviceForRemoteMessages: typeof import('@react-native-firebase/messaging').registerDeviceForRemoteMessages;
  setBackgroundMessageHandler: typeof import('@react-native-firebase/messaging').setBackgroundMessageHandler;
  AuthorizationStatus: typeof import('@react-native-firebase/messaging').AuthorizationStatus;
};

let messagingApi: MessagingApi | null = null;
let messagingInstance: MessagingInstance | null = null;
let lastFcmToken: string | null = null;

const loadMessagingApi = (): MessagingApi | null => {
  if (messagingApi) {
    return messagingApi;
  }
  try {
    // RN Firebase v22+ modular API (no default messaging() export).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@react-native-firebase/app');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const messaging = require('@react-native-firebase/messaging') as MessagingApi;
    if (typeof messaging.getMessaging !== 'function') {
      console.warn(
        '[push] @react-native-firebase/messaging loaded but modular API missing',
      );
      return null;
    }
    messagingApi = messaging;
    return messagingApi;
  } catch (error) {
    console.warn(
      '[push] Failed to load Firebase messaging:',
      error instanceof Error ? error.message : error,
    );
    console.warn(
      '[push] Rebuild the native app after Firebase install (yarn android). Metro reload is not enough.',
    );
    return null;
  }
};

const getMessagingInstance = (): MessagingInstance | null => {
  if (messagingInstance) {
    return messagingInstance;
  }
  const api = loadMessagingApi();
  if (!api) {
    return null;
  }
  try {
    messagingInstance = api.getMessaging();
    return messagingInstance;
  } catch (error) {
    console.warn(
      '[push] getMessaging() failed — native Firebase may not be linked yet:',
      error instanceof Error ? error.message : error,
    );
    return null;
  }
};

export const getLastFcmToken = () => lastFcmToken;

const emitNotificationsUpdated = () => {
  DeviceEventEmitter.emit(NOTIFICATIONS_UPDATED_EVENT);
};

export const ensureNotificationChannel = async () => {
  if (Platform.OS !== 'android') {
    return;
  }

  await notifee.createChannel({
    id: CHANNEL_ID,
    name: CHANNEL_NAME,
    importance: AndroidImportance.HIGH,
  });
};

export const requestPushPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      return false;
    }
  }

  const api = loadMessagingApi();
  const messaging = getMessagingInstance();
  if (!api || !messaging) {
    // Notifee local notifications can still work without FCM.
    return true;
  }

  const authStatus = await api.requestPermission(messaging);
  return (
    authStatus === api.AuthorizationStatus.AUTHORIZED ||
    authStatus === api.AuthorizationStatus.PROVISIONAL
  );
};

export const getFcmToken = async (): Promise<string | null> => {
  const api = loadMessagingApi();
  const messaging = getMessagingInstance();
  if (!api || !messaging) {
    console.warn(
      '[push] FCM unavailable — messaging module / native bridge not ready.',
    );
    return null;
  }

  try {
    try {
      await api.registerDeviceForRemoteMessages(messaging);
    } catch {
      // Android often does not require this; iOS needs it when auto-register is off.
    }

    const token = await api.getToken(messaging);
    lastFcmToken = token || null;
    if (token) {
      console.warn('[push] ========== FCM DEVICE TOKEN ==========');
      console.warn(token);
      console.warn('[push] =====================================');
      return token;
    }
    console.warn('[push] FCM token empty (permission / Play Services?)');
    return null;
  } catch (error) {
    console.warn('[push] Failed to get FCM token', error);
    return null;
  }
};

const resolveTitleBody = (remoteMessage: RemoteMessageLike) => {
  const title =
    remoteMessage.notification?.title ||
    (typeof remoteMessage.data?.title === 'string'
      ? remoteMessage.data.title
      : 'Food Delivery');
  const body =
    remoteMessage.notification?.body ||
    (typeof remoteMessage.data?.body === 'string'
      ? remoteMessage.data.body
      : 'You have a new update.');

  return {title, body};
};

export const saveIncomingNotification = async (
  remoteMessage: RemoteMessageLike,
) => {
  const {title, body} = resolveTitleBody(remoteMessage);
  const orderId =
    typeof remoteMessage.data?.orderId === 'string'
      ? remoteMessage.data.orderId
      : undefined;

  await addStoredNotification({
    id: remoteMessage.messageId
      ? `fcm-${remoteMessage.messageId}`
      : undefined,
    title,
    body,
    orderId,
  });
  emitNotificationsUpdated();
};

export const displayLocalNotification = async (
  remoteMessage: RemoteMessageLike,
) => {
  await ensureNotificationChannel();
  const {title, body} = resolveTitleBody(remoteMessage);

  await notifee.displayNotification({
    title,
    body,
    data: (remoteMessage.data ?? {}) as Record<string, string>,
    android: {
      channelId: CHANNEL_ID,
      pressAction: {
        id: 'default',
      },
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_notification',
      largeIcon: require('../assets/images/Logo.png'),
      circularLargeIcon: true,
    },
  });
};

export const handleForegroundMessage = async (
  remoteMessage: RemoteMessageLike,
) => {
  await saveIncomingNotification(remoteMessage);
  await displayLocalNotification(remoteMessage);
};

export const handleBackgroundMessage = async (
  remoteMessage: RemoteMessageLike,
) => {
  await saveIncomingNotification(remoteMessage);
  if (!remoteMessage.notification) {
    await displayLocalNotification(remoteMessage);
  }
};

export const setupForegroundListeners = () => {
  const api = loadMessagingApi();
  const messaging = getMessagingInstance();
  const unsubscribers: Array<() => void> = [];

  if (api && messaging) {
    unsubscribers.push(
      api.onMessage(messaging, async remoteMessage => {
        await handleForegroundMessage(remoteMessage);
      }),
    );

    unsubscribers.push(
      api.onTokenRefresh(messaging, token => {
        lastFcmToken = token;
        console.warn('[push] FCM token refreshed:', token);
      }),
    );
  }

  unsubscribers.push(
    notifee.onForegroundEvent(async ({type, detail}: Event) => {
      if (type === EventType.PRESS) {
        console.log('[push] Notification pressed', detail.notification?.id);
      }
    }),
  );

  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
};

export const bootstrapPushNotifications = async () => {
  console.warn('[push] Bootstrapping push notifications...');
  await ensureNotificationChannel();
  const granted = await requestPushPermission();
  if (!granted) {
    console.warn(
      '[push] Notification permission not granted — still requesting FCM token',
    );
  }

  const token = await getFcmToken();
  if (!token) {
    console.warn(
      '[push] No FCM token yet. Confirm Firebase is initialized and a device with Play Services is used.',
    );
  }
  return token;
};

type NotifyInAppOptions = {
  orderId?: string;
  type?: string;
  targetRole?: 'manager' | 'superadmin' | 'cashier' | 'kitchen' | 'all';
  targetBranchId?: string | null;
  relatedId?: string;
  /** When false, only saves to inbox (no system banner). Default true. */
  showBanner?: boolean;
};

/** Local banner + in-app list (works even before Firebase is configured). */
export const notifyInApp = async (
  title: string,
  body: string,
  orderIdOrOptions?: string | NotifyInAppOptions,
) => {
  const options: NotifyInAppOptions =
    typeof orderIdOrOptions === 'string'
      ? {orderId: orderIdOrOptions}
      : orderIdOrOptions ?? {};

  const data: Record<string, string> = {};
  if (options.orderId) {
    data.orderId = options.orderId;
  }
  if (options.type) {
    data.type = options.type;
  }
  if (options.targetRole) {
    data.targetRole = options.targetRole;
  }
  if (options.targetBranchId) {
    data.targetBranchId = options.targetBranchId;
  }
  if (options.relatedId) {
    data.relatedId = options.relatedId;
  }

  await addStoredNotification({
    title,
    body,
    orderId: options.orderId,
    type: options.type,
    targetRole: options.targetRole,
    targetBranchId: options.targetBranchId,
    relatedId: options.relatedId,
  });
  emitNotificationsUpdated();

  if (options.showBanner === false) {
    return;
  }

  await displayLocalNotification({
    notification: {title, body},
    data,
  });
};

/** Optional helper for testing without a backend. */
export const sendTestLocalNotification = async () => {
  await notifyInApp(
    'Test notification',
    'Firebase/Notifee is working in foreground.',
  );
};

export const registerBackgroundMessageHandler = () => {
  const api = loadMessagingApi();
  const messaging = getMessagingInstance();
  if (!api || !messaging) {
    return;
  }

  api.setBackgroundMessageHandler(messaging, async remoteMessage => {
    await handleBackgroundMessage(remoteMessage);
  });
};
