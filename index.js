/**
 * @format
 */

import {AppRegistry} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import App from './App';
import {name as appName} from './app.json';
import {setupFonts} from './src/theme/setupFonts';
import {registerBackgroundMessageHandler} from './src/services/pushNotifications';

setupFonts();

// Must be registered as early as possible (outside React tree).
registerBackgroundMessageHandler();

notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.PRESS) {
    console.log('[push] Background notification pressed', detail.notification?.id);
  }
});

AppRegistry.registerComponent(appName, () => App);
