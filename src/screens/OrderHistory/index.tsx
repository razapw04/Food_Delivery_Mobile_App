import React, {useCallback, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {OrderListSkeleton} from '../../components/Skeleton';
import {StateMessage} from '../../components/StateMessage';
import {useAuth} from '../../context/AuthContext';
import {ApiError} from '../../services/apiClient';
import type {MainTabParamList} from '../../types/navigation';
import {
  getStoredOrders,
  type StoredOrder,
} from '../../storage/orderStorage';
import {type OrderHistoryItem, type OrderStatus} from './model';
import {styles} from './styles';

type Props = BottomTabScreenProps<MainTabParamList, 'Orders'>;

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

const normalizeStatus = (status: string): OrderStatus => {
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

const mapStoredOrder = (order: StoredOrder): OrderHistoryItem => {
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

const statusStyles: Record<OrderStatus, {badge: object; text: object}> = {
  Pending: {
    badge: styles.statusBadgePending,
    text: styles.statusTextPending,
  },
  Confirmed: {
    badge: styles.statusBadgeConfirmed,
    text: styles.statusTextConfirmed,
  },
  Delivered: {
    badge: styles.statusBadgeDelivered,
    text: styles.statusTextDelivered,
  },
  'On the way': {
    badge: styles.statusBadgeOnTheWay,
    text: styles.statusTextOnTheWay,
  },
  Preparing: {
    badge: styles.statusBadgePreparing,
    text: styles.statusTextPreparing,
  },
  Cancelled: {
    badge: styles.statusBadgeCancelled,
    text: styles.statusTextCancelled,
  },
};

const OrderCard = ({order}: {order: OrderHistoryItem}) => {
  const status = normalizeStatus(order.status);
  const statusStyle = statusStyles[status] ?? statusStyles.Pending;

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderTopRow}>
        <Text style={styles.orderId}>{order.orderId}</Text>
        <View style={[styles.statusBadge, statusStyle.badge]}>
          <Text style={[styles.statusText, statusStyle.text]}>{status}</Text>
        </View>
      </View>

      <View style={styles.orderBody}>
        <Image
          source={{uri: order.image}}
          style={styles.orderImage}
          resizeMode="cover"
        />
        <View style={styles.orderInfo}>
          <Text style={styles.orderTitle} numberOfLines={1}>
            {order.title}
          </Text>
          <Text style={styles.orderDetails} numberOfLines={2}>
            {order.details}
          </Text>
        </View>
      </View>

      <View style={styles.orderMetaRow}>
        <Text style={styles.orderMeta}>
          {order.date} · {order.time}
        </Text>
        <Text style={styles.orderPrice}>{order.price}</Text>
      </View>
    </View>
  );
};

const OrderHistoryScreen = ({navigation}: Props) => {
  const showBack = navigation.canGoBack();
  const {user} = useAuth();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!user?.email) {
      setOrders([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const stored = await getStoredOrders(user.email);
      setOrders(stored.map(mapStoredOrder));
    } catch (err) {
      setOrders([]);
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't load your orders. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const run = async () => {
        await loadOrders();
        if (!active) {
          return;
        }
      };
      run();
      return () => {
        active = false;
      };
    }, [loadOrders]),
  );

  const listEmpty = () => {
    if (error) {
      return (
        <StateMessage
          icon="wifi-off"
          title="Couldn't load orders"
          subtitle={error}
          actionLabel="Retry"
          onAction={loadOrders}
        />
      );
    }

    if (!user?.email) {
      return (
        <StateMessage
          icon="account-outline"
          title="Sign in to see orders"
          subtitle="Your order history will appear here after you log in."
        />
      );
    }

    return (
      <StateMessage
        icon="package-variant-closed"
        title="No orders yet"
        subtitle="When you place an order, it will show up here with its status and details."
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        {showBack ? (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={22} color="#1A1A1A" />
          </Pressable>
        ) : (
          <View style={styles.backButton} />
        )}
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      {loading ? (
        <OrderListSkeleton />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={listEmpty}
          renderItem={({item}) => <OrderCard order={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;
