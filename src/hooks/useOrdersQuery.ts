import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {queryKeys} from '../lib/queryClient';
import {
  getAllStoredOrders,
  getStoredOrders,
  saveStoredOrder,
  updateStoredOrderStatus,
  type OrderStatus,
  type StoredOrder,
} from '../storage/orderStorage';

export const useUserOrdersQuery = (email?: string | null) =>
  useQuery({
    queryKey: queryKeys.userOrders(email?.trim().toLowerCase() || 'guest'),
    queryFn: () => getStoredOrders(email),
    enabled: Boolean(email?.trim()),
  });

export const useAllOrdersQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.allOrders,
    queryFn: getAllStoredOrders,
    enabled,
  });

export const usePlaceOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      order,
      userEmail,
    }: {
      order: Parameters<typeof saveStoredOrder>[0];
      userEmail: string;
    }) => saveStoredOrder(order, userEmail),
    onSuccess: (saved, variables) => {
      const email = variables.userEmail.trim().toLowerCase();
      queryClient.invalidateQueries({queryKey: queryKeys.userOrders(email)});
      queryClient.invalidateQueries({queryKey: queryKeys.allOrders});
      return saved;
    },
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => updateStoredOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.allOrders});
      queryClient.invalidateQueries({queryKey: ['orders']});
    },
  });
};

export type {StoredOrder};
