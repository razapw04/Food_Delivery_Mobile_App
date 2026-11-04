import type {StoredOrder, OrderStatus} from '../storage/orderStorage';
import {apiRequest} from './apiClient';

export type CreateOrderPayload = Omit<
  StoredOrder,
  'id' | 'orderId' | 'createdAt' | 'updatedAt' | 'status'
>;

export const createOrderRequest = (payload: CreateOrderPayload) =>
  apiRequest<StoredOrder>('/api/orders', {
    method: 'POST',
    body: payload,
  });

export const getOrdersByEmailRequest = (email: string) =>
  apiRequest<StoredOrder[]>(
    `/api/orders/user/${encodeURIComponent(email.trim().toLowerCase())}`,
  );

export const getAllOrdersRequest = () =>
  apiRequest<StoredOrder[]>('/api/orders');

export const updateOrderStatusRequest = (orderId: string, status: OrderStatus) =>
  apiRequest<StoredOrder>(`/api/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH',
    body: {status},
  });
