import {useEffect} from 'react';
import {
  bootstrapPushNotifications,
  setupForegroundListeners,
} from '../services/pushNotifications';

/**
 * Starts FCM/Notifee permission + listeners once the app tree is mounted.
 */
const PushNotificationsBootstrap = () => {
  useEffect(() => {
    let cleanup = () => {};

    const start = async () => {
      await bootstrapPushNotifications();
      cleanup = setupForegroundListeners();
    };

    start();

    return () => {
      cleanup();
    };
  }, []);

  return null;
};

export default PushNotificationsBootstrap;
