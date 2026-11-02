import AsyncStorage from '@react-native-async-storage/async-storage';
import type {CartItem} from '../context/CartContext';

export type StoredPaymentMethod = 'cod' | 'card' | 'jazzcash';

export type StoredOrder = {
  id: string;
  orderId: string;
  createdAt: string;
  items: CartItem[];
  productTotal: number;
  discount: number;
  deliveryFee: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: StoredPaymentMethod;
  deliveryAddress: string;
  deliveryInstructions: string;
  orderMode: 'delivery' | 'pickup';
  status: 'Pending';
};

const ORDERS_KEY = '@food_app/orders';

export const getStoredOrders = async (): Promise<StoredOrder[]> => {
  const raw = await AsyncStorage.getItem(ORDERS_KEY);
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

export const saveStoredOrder = async (order: StoredOrder) => {
  const existing = await getStoredOrders();
  await AsyncStorage.setItem(
    ORDERS_KEY,
    JSON.stringify([order, ...existing]),
  );
};
