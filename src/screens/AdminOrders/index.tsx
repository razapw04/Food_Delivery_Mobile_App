import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
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
import {useAuth} from '../../context/AuthContext';
import {notifyInApp} from '../../services/pushNotifications';
import {
  getAllStoredOrders,
  updateStoredOrderStatus,
  type OrderStatus,
  type StoredOrder,
} from '../../storage/orderStorage';
import type {RootStackParamList} from '../../types/navigation';
import {colors} from '../../theme';
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

const EmptyOrders = () => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyIconWrap}>
      <Icon name="clipboard-list-outline" size={32} color="#9CA3AF" />
    </View>
    <Text style={styles.emptyTitle}>No orders yet</Text>
    <Text style={styles.emptySubtitle}>
      Customer orders will appear here so you can confirm and update status.
    </Text>
  </View>
);

const AdminOrdersScreen = () => {
  const navigation = useNavigation<Nav>();
  const {isAdmin, logout} = useAuth();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  }, [logout, navigation]);

  const loadOrders = useCallback(async () => {
    const stored = await getAllStoredOrders();
    setOrders(stored);
    setLoading(false);
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
      let active = true;
      setLoading(true);
      loadOrders().finally(() => {
        if (active) {
          setLoading(false);
        }
      });
      return () => {
        active = false;
      };
    }, [isAdmin, loadOrders, navigation]),
  );

  const handleUpdateStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      setUpdatingId(orderId);
      try {
        const updated = await updateStoredOrderStatus(orderId, status);
        if (updated) {
          await notifyInApp(
            'Order status updated',
            `Your order ${updated.orderId} is now ${status}.`,
            updated.id,
          );
          await loadOrders();
        }
      } finally {
        setUpdatingId(null);
      }
    },
    [loadOrders],
  );

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
        <View style={styles.emptyWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyOrders />}
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
