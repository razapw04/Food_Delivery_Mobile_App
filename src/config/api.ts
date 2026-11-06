import {Platform} from 'react-native';
import {API_BASE_URL as ENV_API_BASE_URL, API_TIMEOUT_MS} from '@env';

const platformDefaultUrl = Platform.select({
  android: 'http://10.0.2.2:5000',
  ios: 'http://localhost:5000',
  default: 'http://localhost:5000',
}) as string;

/** Prefer .env override; otherwise use emulator/simulator defaults. */
export const API_BASE_URL =
  ENV_API_BASE_URL && ENV_API_BASE_URL.trim().length > 0
    ? ENV_API_BASE_URL.trim().replace(/\/$/, '')
    : platformDefaultUrl;

export const API_TIMEOUT_MS_VALUE = Number(API_TIMEOUT_MS) || 15000;
