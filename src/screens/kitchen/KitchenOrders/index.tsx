import React from 'react';
import {FlatList, Pressable, StatusBar, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {OrderListSkeleton} from '../../../components/Skeleton';
import {StateMessage} from '../../../components/StateMessage';
import {
  resolveOrderChannel,
  type OrderStatus,
  type StoredOrder,
} from '../../../storage/orderStorage';
import {formatOrderPrice, formatOrderWhen} from '../../../utils/orderStatus';
import {channelLabel} from '../../../utils/revenueFromOrders';
import {styles} from './styles';
import useController from './useController';

const kitchenModeLabel = (order: StoredOrder) => {
  if (order.orderMode === 'dine_in') {
    return 'Dine-in';
  }
  if (order.orderMode === 'pickup') {
    return 'Pickup';
  }
  return 'Delivery';
};

const KitchenOrderCard = ({
  order,
  busy,
  readOnly,
  onUpdateStatus,
}: {
  order: StoredOrder;
  busy: boolean;
  readOnly?: boolean;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}) => {
  const status = order.status ?? 'Pending';
  const itemsSummary = (order.items ?? [])
    .map(item => `${item.quantity}x ${item.name}`)
    .join(', ');

  const statusBadgeStyle =
    status === 'Preparing'
      ? styles.statusBadgePreparing
      : status === 'On the way'
        ? styles.statusBadgeOnTheWay
        : styles.statusBadgeConfirmed;
  const statusTextStyle =
    status === 'Preparing'
      ? styles.statusTextPreparing
      : status === 'On the way'
        ? styles.statusTextOnTheWay
        : styles.statusTextConfirmed;

  const showStart = !readOnly && status === 'Confirmed';
  const showDispatch = !readOnly && status === 'Preparing';
  const channel = resolveOrderChannel(order);
  const isDineIn = order.orderMode === 'dine_in';

  return (
    <View style={[styles.orderCard, readOnly ? styles.orderCardMuted : null]}>
      <View style={styles.orderTopRow}>
        <Text style={styles.orderId}>{order.orderId}</Text>
        <View style={[styles.statusBadge, statusBadgeStyle]}>
          <Text style={[styles.statusText, statusTextStyle]}>{status}</Text>
        </View>
      </View>

      <Text style={styles.channelMeta}>
        {channelLabel(channel)}
        {isDineIn ? ' · Open for kitchen' : ''}
        {order.tableNo ? ` · Table ${order.tableNo}` : ''}
      </Text>
      <Text style={styles.customerName}>{order.customerName || 'Customer'}</Text>
      {order.waiterName ? (
        <Text style={styles.addressText}>Waiter: {order.waiterName}</Text>
      ) : null}
      <Text style={styles.orderDetails} numberOfLines={4}>
        {itemsSummary || 'No items'}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {formatOrderWhen(order.createdAt)} · {kitchenModeLabel(order)}
        </Text>
        <Text style={styles.orderPrice}>{formatOrderPrice(order.totalAmount)}</Text>
      </View>

      {order.deliveryAddress ? (
        <Text style={styles.addressText} numberOfLines={2}>
          {order.deliveryAddress}
        </Text>
      ) : null}

      <View style={styles.actionsWrap}>
        {showStart ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Start preparing ${order.orderId}`}
            disabled={busy}
            onPress={() => onUpdateStatus(order.id, 'Preparing')}
            style={[
              styles.primaryButton,
              busy ? styles.primaryButtonDisabled : null,
            ]}>
            <Text style={styles.primaryButtonText}>Start preparing</Text>
          </Pressable>
        ) : null}
        {showDispatch ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Mark ${order.orderId} ready for dispatch`}
            disabled={busy}
            onPress={() => onUpdateStatus(order.id, 'On the way')}
            style={[
              styles.primaryButton,
              busy ? styles.primaryButtonDisabled : null,
            ]}>
            <Text style={styles.primaryButtonText}>
              {isDineIn ? 'Ready to serve' : 'Ready for dispatch'}
            </Text>
          </Pressable>
        ) : null}
        {readOnly ? (
          <Text style={styles.readOnlyNote}>
            Dispatched — no further kitchen action
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const KitchenOrdersScreen = () => {
  const {
    activeOrders,
    recentDispatch,
    isPending,
    updatingId,
    errorMessage,
    handleLogout,
    handleUpdateStatus,
    handleRetry,
  } = useController();

  const listData =
    errorMessage || (activeOrders.length === 0 && recentDispatch.length === 0)
      ? []
      : [{key: 'body'}];

  const listEmpty = () => {
    if (errorMessage) {
      return (
        <StateMessage
          icon="wifi-off"
          title="Couldn't load orders"
          subtitle={errorMessage}
          actionLabel="Retry"
          onAction={handleRetry}
        />
      );
    }

    return (
      <StateMessage
        icon="chef-hat"
        title="Kitchen queue is clear"
        subtitle="Confirmed orders will show here for preparation."
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.backButton} />
        <Text style={styles.headerTitle}>Kitchen Orders</Text>
        <Pressable
          accessibilityLabel="Logout"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleLogout}>
          <Icon name="logout" size={22} color="#C74440" />
        </Pressable>
      </View>

      {isPending ? (
        <OrderListSkeleton />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={item => item.key}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={listEmpty}
          renderItem={() => (
            <>
              {activeOrders.length > 0 ? (
                <Text style={styles.sectionHeading}>Active queue</Text>
              ) : null}
              {activeOrders.map(order => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  busy={updatingId === order.id}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
              {recentDispatch.length > 0 ? (
                <Text style={styles.sectionHeading}>Recently dispatched</Text>
              ) : null}
              {recentDispatch.map(order => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  readOnly
                  busy={false}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default KitchenOrdersScreen;
