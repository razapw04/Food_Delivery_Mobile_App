import AsyncStorage from '@react-native-async-storage/async-storage';
import type {CartItem} from '../context/CartContext';

export type StoredPaymentMethod = 'cod' | 'card' | 'jazzcash';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'On the way'
  | 'Delivered'
  | 'Cancelled';

export type StoredOrder = {
  id: string;
  orderId: string;
  createdAt: string;
  updatedAt?: string;
  customerEmail: string;
  customerName: string;
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
  status: OrderStatus;
};

const ALL_ORDERS_KEY = '@food_app/orders:all';

const ordersKeyForUser = (email: string) =>
  `@food_app/orders:${email.trim().toLowerCase()}`;

const parseOrders = (raw: string | null): StoredOrder[] => {
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

export const getStoredOrders = async (
  userEmail?: string | null,
): Promise<StoredOrder[]> => {
  if (!userEmail?.trim()) {
    return [];
  }

  const raw = await AsyncStorage.getItem(ordersKeyForUser(userEmail));
  return parseOrders(raw);
};

export const getAllStoredOrders = async (): Promise<StoredOrder[]> => {
  const raw = await AsyncStorage.getItem(ALL_ORDERS_KEY);
  return parseOrders(raw);
};

const writeUserOrders = async (email: string, orders: StoredOrder[]) => {
  await AsyncStorage.setItem(
    ordersKeyForUser(email),
    JSON.stringify(orders),
  );
};

const writeAllOrders = async (orders: StoredOrder[]) => {
  await AsyncStorage.setItem(ALL_ORDERS_KEY, JSON.stringify(orders));
};

export const saveStoredOrder = async (
  order: StoredOrder,
  userEmail: string,
) => {
  const email = userEmail.trim().toLowerCase();
  if (!email) {
    return;
  }

  const withCustomer: StoredOrder = {
    ...order,
    customerEmail: order.customerEmail?.trim().toLowerCase() || email,
    customerName: order.customerName?.trim() || 'Customer',
    updatedAt: order.updatedAt || order.createdAt,
  };

  const existing = await getStoredOrders(email);
  await writeUserOrders(email, [withCustomer, ...existing]);

  const allOrders = await getAllStoredOrders();
  await writeAllOrders([withCustomer, ...allOrders]);
};

export const updateStoredOrderStatus = async (
  orderId: string,
  status: OrderStatus,
): Promise<StoredOrder | null> => {
  const allOrders = await getAllStoredOrders();
  const index = allOrders.findIndex(
    item => item.id === orderId || item.orderId === orderId,
  );

  if (index < 0) {
    return null;
  }

  const updatedAt = new Date().toISOString();
  const updated: StoredOrder = {
    ...allOrders[index],
    status,
    updatedAt,
  };

  const nextAll = [...allOrders];
  nextAll[index] = updated;
  await writeAllOrders(nextAll);

  const customerEmail = updated.customerEmail?.trim().toLowerCase();
  if (customerEmail) {
    const userOrders = await getStoredOrders(customerEmail);
    const userIndex = userOrders.findIndex(
      item => item.id === updated.id || item.orderId === updated.orderId,
    );
    if (userIndex >= 0) {
      const nextUser = [...userOrders];
      nextUser[userIndex] = updated;
      await writeUserOrders(customerEmail, nextUser);
    }
  }

  return updated;
};
