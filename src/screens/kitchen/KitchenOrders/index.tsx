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
        {channelLabel(resolveOrderChannel(order))}
        {isDineIn ? ' · Open for kitchen' : ''}
      </Text>

      <Text style={styles.orderDetails} numberOfLines={3}>
        {itemsSummary || 'No items'}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {formatOrderWhen(order.createdAt)} · {kitchenModeLabel(order)}
        </Text>
        <Text style={styles.orderPrice}>
          {formatOrderPrice(order.totalAmount)}
        </Text>
      </View>

      {!readOnly ? (
        <View style={styles.actionsWrap}>
          {status === 'Confirmed' ? (
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              style={[
                styles.primaryButton,
                busy ? styles.primaryButtonDisabled : null,
              ]}
              onPress={() => onUpdateStatus(order.id, 'Preparing')}>
              <Text style={styles.primaryButtonText}>
                {busy ? 'Updating…' : 'Start preparing'}
              </Text>
            </Pressable>
          ) : null}
          {status === 'Preparing' ? (
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              style={[
                styles.primaryButton,
                busy ? styles.primaryButtonDisabled : null,
              ]}
              onPress={() => onUpdateStatus(order.id, 'On the way')}>
              <Text style={styles.primaryButtonText}>
                {busy ? 'Updating…' : 'Mark ready / dispatch'}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <Text style={styles.readOnlyNote}>
          Dispatched — no further kitchen action
        </Text>
      )}
    </View>
  );
};

const KitchenOrdersScreen = () => {
  const {
    activeOrders,
    isPending,
    updatingId,
    errorMessage,
    handleLogout,
    handleUpdateStatus,
    handleRetry,
  } = useController();

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
        <View style={styles.headerSide} />
        <Text style={styles.headerTitle}>Active queue</Text>
        <Pressable
          accessibilityLabel="Logout"
          accessibilityRole="button"
          style={styles.logoutButton}
          onPress={handleLogout}>
          <Icon name="logout" size={22} color="#C74440" />
        </Pressable>
      </View>

      {isPending ? (
        <OrderListSkeleton />
      ) : (
        <FlatList
          data={activeOrders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={listEmpty}
          renderItem={({item}) => (
            <KitchenOrderCard
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

export default KitchenOrdersScreen;
