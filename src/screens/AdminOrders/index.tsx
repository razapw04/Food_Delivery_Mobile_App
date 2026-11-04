import React, {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {OrderListSkeleton} from '../../components/Skeleton';
import {StateMessage} from '../../components/StateMessage';
import {useAuth} from '../../context/AuthContext';
import {ApiError} from '../../services/apiClient';
import {notifyInApp} from '../../services/pushNotifications';
import {
  getAllStoredOrders,
  updateStoredOrderStatus,
  type OrderStatus,
  type StoredOrder,
} from '../../storage/orderStorage';
import type {RootStackParamList} from '../../types/navigation';
import {styles} from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminOrders'>;

const STATUS_OPTIONS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'On the way',
  'Delivered',
  'Cancelled',
];

const formatPrice = (value: number) => `Rs. ${value.toLocaleString('en-PK')}`;

const formatWhen = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
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

const AdminOrderCard = ({
  order,
  busy,
  onUpdateStatus,
}: {
  order: StoredOrder;
  busy: boolean;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}) => {
  const status = order.status ?? 'Pending';
  const statusStyle = statusStyles[status] ?? statusStyles.Pending;
  const itemsSummary = (order.items ?? [])
    .map(item => `${item.quantity}x ${item.name}`)
    .join(', ');
  const canConfirm = status === 'Pending';

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderTopRow}>
        <Text style={styles.orderId}>{order.orderId}</Text>
        <View style={[styles.statusBadge, statusStyle.badge]}>
          <Text style={[styles.statusText, statusStyle.text]}>{status}</Text>
        </View>
      </View>

      <Text style={styles.customerName}>{order.customerName || 'Customer'}</Text>
      <Text style={styles.customerEmail}>{order.customerEmail}</Text>
      <Text style={styles.orderDetails} numberOfLines={3}>
        {itemsSummary || 'No items'}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {formatWhen(order.createdAt)} ·{' '}
          {order.orderMode === 'pickup' ? 'Pickup' : 'Delivery'}
        </Text>
        <Text style={styles.orderPrice}>{formatPrice(order.totalAmount)}</Text>
      </View>

      {order.deliveryAddress ? (
        <Text style={styles.addressText} numberOfLines={2}>
          {order.deliveryAddress}
        </Text>
      ) : null}

      <View style={styles.actionsWrap}>
        {canConfirm ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Confirm order ${order.orderId}`}
            disabled={busy}
            onPress={() => onUpdateStatus(order.id, 'Confirmed')}
            style={[
              styles.confirmButton,
              busy ? styles.confirmButtonDisabled : null,
            ]}>
            <Text style={styles.confirmButtonText}>Confirm Order</Text>
          </Pressable>
        ) : null}

        <Text style={styles.statusLabel}>Update status</Text>
        <View style={styles.chipsRow}>
          {STATUS_OPTIONS.map(option => {
            const active = option === status;
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityLabel={`Set status to ${option}`}
                disabled={busy || active}
                onPress={() => onUpdateStatus(order.id, option)}
                style={[styles.chip, active ? styles.chipActive : null]}>
                <Text
                  style={[
                    styles.chipText,
                    active ? styles.chipTextActive : null,
                  ]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const AdminOrdersScreen = () => {
  const navigation = useNavigation<Nav>();
  const {isAdmin, logout} = useAuth();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  }, [logout, navigation]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stored = await getAllStoredOrders();
      setOrders(stored);
    } catch (err) {
      setOrders([]);
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't load orders. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!isAdmin) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
        return;
      }
      loadOrders();
    }, [isAdmin, loadOrders, navigation]),
  );

  const handleUpdateStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      setUpdatingId(orderId);
      try {
        const updated = await updateStoredOrderStatus(orderId, status);
        await notifyInApp(
          'Order status updated',
          `Your order ${updated.orderId} is now ${status}.`,
          updated.id,
        );
        await loadOrders();
      } catch (err) {
        Alert.alert(
          'Update failed',
          err instanceof ApiError
            ? err.message
            : "Couldn't update order status. Please try again.",
        );
      } finally {
        setUpdatingId(null);
      }
    },
    [loadOrders],
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

    return (
      <StateMessage
        icon="clipboard-list-outline"
        title="No orders yet"
        subtitle="Customer orders will appear here so you can confirm and update status."
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.backButton} />
        <Text style={styles.headerTitle}>Admin Orders</Text>
        <Pressable
          accessibilityLabel="Logout"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleLogout}>
          <Icon name="logout" size={22} color="#C74440" />
        </Pressable>
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
          renderItem={({item}) => (
            <AdminOrderCard
              order={item}
              busy={updatingId === item.id}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default AdminOrdersScreen;
