import {Platform} from 'react-native';

/**
 * Android emulator → host machine via 10.0.2.2
 * iOS simulator → localhost
 * Physical device → set your PC LAN IP here (e.g. http://192.168.x.x:5000)
 */
export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  ios: 'http://localhost:5000',
  default: 'http://localhost:5000',
}) as string;
