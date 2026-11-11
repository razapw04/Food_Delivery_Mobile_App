import AsyncStorage from '@react-native-async-storage/async-storage';
import type {StoredOrder} from './orderStorage';
import {buildOrderSlipText} from '../utils/orderSlip';

const SAVED_SLIPS_KEY = '@food_app/saved_slips';

export type SavedOrderSlip = {
  id: string;
  orderId: string;
  customerName: string;
  tableNo: string | null;
  totalAmount: number;
  savedAt: string;
  text: string;
  order: StoredOrder;
};

const readSlips = async (): Promise<SavedOrderSlip[]> => {
  const raw = await AsyncStorage.getItem(SAVED_SLIPS_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as SavedOrderSlip[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeSlips = async (slips: SavedOrderSlip[]) => {
  await AsyncStorage.setItem(SAVED_SLIPS_KEY, JSON.stringify(slips));
};

export const getSavedOrderSlips = async (): Promise<SavedOrderSlip[]> =>
  readSlips();

/** Persist a printable slip copy on this device (AsyncStorage archive). */
export const saveOrderSlipToDevice = async (
  order: StoredOrder,
): Promise<SavedOrderSlip> => {
  const slips = await readSlips();
  const savedAt = new Date().toISOString();
  const next: SavedOrderSlip = {
    id: `slip-${order.id}-${Date.now()}`,
    orderId: order.orderId,
    customerName: order.customerName || 'Customer',
    tableNo: order.tableNo ?? null,
    totalAmount: order.totalAmount,
    savedAt,
    text: buildOrderSlipText(order),
    order,
  };

  // Keep newest first; cap archive size.
  const updated = [next, ...slips.filter(slip => slip.orderId !== order.orderId)].slice(
    0,
    100,
  );
  await writeSlips(updated);
  return next;
};
