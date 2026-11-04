import type {CartItem} from '../context/CartContext';
import {
  createOrderRequest,
  getAllOrdersRequest,
  getOrdersByEmailRequest,
  updateOrderStatusRequest,
} from '../services/ordersApi';

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

export const getStoredOrders = async (
  userEmail?: string | null,
): Promise<StoredOrder[]> => {
  if (!userEmail?.trim()) {
    return [];
  }

  try {
    return await getOrdersByEmailRequest(userEmail);
  } catch {
    return [];
  }
};

export const getAllStoredOrders = async (): Promise<StoredOrder[]> => {
  try {
    return await getAllOrdersRequest();
  } catch {
    return [];
  }
};

export const saveStoredOrder = async (
  order: Omit<StoredOrder, 'id' | 'orderId' | 'createdAt' | 'updatedAt' | 'status'> &
    Partial<Pick<StoredOrder, 'id' | 'orderId' | 'createdAt' | 'updatedAt' | 'status'>>,
  userEmail: string,
): Promise<StoredOrder> => {
  const email = userEmail.trim().toLowerCase();
  if (!email) {
    throw new Error('You must be signed in to place an order.');
  }

  return createOrderRequest({
    customerEmail: order.customerEmail?.trim().toLowerCase() || email,
    customerName: order.customerName?.trim() || 'Customer',
    items: order.items,
    productTotal: order.productTotal,
    discount: order.discount,
    deliveryFee: order.deliveryFee,
    taxPercent: order.taxPercent,
    taxAmount: order.taxAmount,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    deliveryAddress: order.deliveryAddress,
    deliveryInstructions: order.deliveryInstructions,
    orderMode: order.orderMode,
  });
};

export const updateStoredOrderStatus = async (
  orderId: string,
  status: OrderStatus,
): Promise<StoredOrder | null> => {
  try {
    return await updateOrderStatusRequest(orderId, status);
  } catch {
    return null;
  }
};
