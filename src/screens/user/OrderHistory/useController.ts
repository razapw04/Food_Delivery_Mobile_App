import {useCallback, useMemo} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useAuth} from '../../../context/AuthContext';
import {useUserOrdersQuery} from '../../../hooks/useOrdersQuery';
import type {StoredOrder} from '../../../storage/orderStorage';
import type {MainTabParamList} from '../../../types/navigation';
import {type OrderHistoryItem, type OrderStatus} from './model';

type OrderHistoryNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  'Orders'
>;

const formatPrice = (value: number) => `Rs. ${value.toLocaleString('en-PK')}`;

const formatOrderDate = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (sameDay) {
    return 'Today';
  }
  if (isYesterday) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
};

const formatOrderTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

export const normalizeStatus = (status: string): OrderStatus => {
  if (status === 'Placed' || status === 'Pending') {
    return 'Pending';
  }
  if (
    status === 'Confirmed' ||
    status === 'Delivered' ||
    status === 'On the way' ||
    status === 'Preparing' ||
    status === 'Cancelled'
  ) {
    return status;
  }
  return 'Pending';
};

export const mapStoredOrder = (order: StoredOrder): OrderHistoryItem => {
  const first = order.items?.[0];
  const items = order.items ?? [];
  const extraCount = Math.max(items.length - 1, 0);
  const title = first
    ? extraCount > 0
      ? `${first.name} +${extraCount}`
      : first.name
    : 'Order';
  const details = items
    .map(item => `${item.quantity}x ${item.name}`)
    .join(', ');

  return {
    id: order.id,
    orderId: order.orderId,
    status: normalizeStatus(String(order.status ?? 'Pending')),
    title,
    details,
    price: formatPrice(order.totalAmount),
    date: formatOrderDate(order.createdAt),
    time: formatOrderTime(order.createdAt),
    image:
      first?.image ||
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
  };
};

const useController = () => {
  const navigation = useNavigation<OrderHistoryNavigationProp>();
  const showBack = navigation.canGoBack();
  const {user} = useAuth();
  const {
    data: ordersData,
    error: ordersError,
    isPending,
    refetch,
  } = useUserOrdersQuery(user?.email);

  useFocusEffect(
    useCallback(() => {
      if (user?.email) {
        void refetch().catch(() => undefined);
      }
    }, [user?.email, refetch]),
  );

  const orders = useMemo(
    () => (ordersData ?? []).map(mapStoredOrder),
    [ordersData],
  );

  const errorMessage = ordersError
    ? ordersError instanceof Error
      ? ordersError.message
      : "Couldn't load your orders. Please try again."
    : null;

  const retryLoad = () => {
    void refetch().catch(() => undefined);
  };

  const goBack = () => {
    navigation.goBack();
  };

  return {
    user,
    showBack,
    orders,
    isPending,
    errorMessage,
    retryLoad,
    goBack,
  };
};

export default useController;
