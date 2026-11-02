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

let messagingModule: typeof import('@react-native-firebase/messaging').default | null =
  null;

const getMessaging = () => {
  if (messagingModule) {
    return messagingModule;
  }
  try {
    // Lazy require so app can still boot if native Firebase is not configured yet.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    messagingModule = require('@react-native-firebase/messaging').default;
    return messagingModule;
  } catch {
    return null;
  }
};

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

  const messaging = getMessaging();
  if (!messaging) {
    // Notifee local notifications can still work without FCM.
    return true;
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

export const getFcmToken = async (): Promise<string | null> => {
  const messaging = getMessaging();
  if (!messaging) {
    console.log(
      '[push] FCM token: messaging module unavailable (check google-services.json / rebuild)',
    );
    return null;
  }

  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    if (token) {
      console.log('[push] FCM token:', token);
      return token;
    }
    console.log('[push] FCM token: empty');
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
  // When payload has a `notification` block, Android may already show a system tray item.
  // Still display via Notifee for data-only messages.
  if (!remoteMessage.notification) {
    await displayLocalNotification(remoteMessage);
  }
};

export const setupForegroundListeners = () => {
  const messaging = getMessaging();
  const unsubscribers: Array<() => void> = [];

  if (messaging) {
    unsubscribers.push(
      messaging().onMessage(async remoteMessage => {
        await handleForegroundMessage(remoteMessage);
      }),
    );

    unsubscribers.push(
      messaging().onTokenRefresh(token => {
        console.log('[push] FCM token refreshed:', token);
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
  console.log('[push] Bootstrapping push notifications...');
  await ensureNotificationChannel();
  const granted = await requestPushPermission();
  if (!granted) {
    console.warn('[push] Notification permission not granted');
    return null;
  }

  // Backend not configured yet — only log token to console.
  const token = await getFcmToken();
  return token;
};

/** Local banner + in-app list (works even before Firebase is configured). */
export const notifyInApp = async (title: string, body: string, orderId?: string) => {
  await handleForegroundMessage({
    notification: {title, body},
    data: orderId ? {orderId} : undefined,
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
  const messaging = getMessaging();
  if (!messaging) {
    return;
  }

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    await handleBackgroundMessage(remoteMessage);
  });
};
