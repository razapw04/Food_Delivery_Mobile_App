import React from 'react';
import {FlatList, Pressable, StatusBar, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import OrderSlipModal from '../../../components/OrderSlipModal';
import {OrderListSkeleton} from '../../../components/Skeleton';
import {StateMessage} from '../../../components/StateMessage';
import {
  isOpenDineInTab,
  resolveOrderChannel,
  type OrderStatus,
  type StoredOrder,
} from '../../../storage/orderStorage';
import {
  canSelectStatus,
  formatOrderPrice,
  formatOrderWhen,
} from '../../../utils/orderStatus';
import {channelLabel} from '../../../utils/revenueFromOrders';
import {styles} from './styles';
import useController from './useController';

const modeLabel = (order: StoredOrder) => {
  if (order.orderMode === 'dine_in') {
    return isOpenDineInTab(order) ? 'Dine-in · Open tab' : 'Dine-in · Closed';
  }
  if (order.orderMode === 'pickup') {
    return 'Pickup';
  }
  return 'Delivery';
};

const CASHIER_ACTION_OPTIONS: OrderStatus[] = ['Confirmed', 'Cancelled'];

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

const CashierOrderCard = ({
  order,
  busy,
  onUpdateStatus,
  onPrintSlip,
  onAddToTab,
  onCloseTab,
}: {
  order: StoredOrder;
  busy: boolean;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onPrintSlip: (order: StoredOrder) => void;
  onAddToTab: (order: StoredOrder) => void;
  onCloseTab: (order: StoredOrder) => void;
}) => {
  const status = order.status ?? 'Pending';
  const statusStyle = statusStyles[status] ?? statusStyles.Pending;
  const itemsSummary = (order.items ?? [])
    .map(item => `${item.quantity}x ${item.name}`)
    .join(', ');
  const canConfirm = status === 'Pending';
  const canPrint = status !== 'Pending' && status !== 'Cancelled';
  const openTab = isOpenDineInTab(order);

  const channel = resolveOrderChannel(order);
  const isPos = channel === 'pos';

  return (
    <View style={styles.orderCard}>
      <View
        style={[styles.channelBadge, isPos ? styles.channelBadgePos : null]}>
        <Text
          style={[
            styles.channelBadgeText,
            isPos ? styles.channelBadgeTextPos : null,
          ]}>
          {channelLabel(channel)}
          {order.orderMode === 'dine_in' ? ' · Dine-in' : ''}
        </Text>
      </View>
      <View style={styles.orderTopRow}>
        <Text style={styles.orderId}>{order.orderId}</Text>
        <View style={styles.topRight}>
          {canPrint ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Print slip for ${order.orderId}`}
              disabled={busy}
              onPress={() => onPrintSlip(order)}
              style={styles.printIconButton}>
              <Icon name="printer" size={18} color="#FF7622" />
            </Pressable>
          ) : null}
          <View style={[styles.statusBadge, statusStyle.badge]}>
            <Text style={[styles.statusText, statusStyle.text]}>{status}</Text>
          </View>
        </View>
      </View>

      {order.tableNo ? (
        <Text style={styles.tableLine}>Table {order.tableNo}</Text>
      ) : null}
      <Text style={styles.customerName}>{order.customerName || 'Customer'}</Text>
      {order.waiterName ? (
        <Text style={styles.customerEmail}>Waiter: {order.waiterName}</Text>
      ) : null}
      <Text style={styles.customerEmail}>{order.customerEmail}</Text>
      <Text style={styles.orderDetails} numberOfLines={3}>
        {itemsSummary || 'No items'}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {formatOrderWhen(order.createdAt)} · {modeLabel(order)}
        </Text>
        <Text style={styles.orderPrice}>{formatOrderPrice(order.totalAmount)}</Text>
      </View>

      {order.deliveryAddress ? (
        <Text style={styles.addressText} numberOfLines={2}>
          {order.deliveryAddress}
        </Text>
      ) : null}

      <View style={styles.actionsWrap}>
        {openTab ? (
          <View style={styles.chipsRow}>
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={() => onAddToTab(order)}
              style={[
                styles.confirmButton,
                styles.tabActionButton,
                busy ? styles.confirmButtonDisabled : null,
              ]}>
              <Text style={styles.confirmButtonText}>Add items</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={() => onCloseTab(order)}
              style={[
                styles.closeTabButton,
                busy ? styles.confirmButtonDisabled : null,
              ]}>
              <Text style={styles.closeTabButtonText}>Close tab</Text>
            </Pressable>
          </View>
        ) : null}

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

        {!openTab ? (
          <>
            <Text style={styles.statusLabel}>Update status</Text>
            <View style={styles.chipsRow}>
              {CASHIER_ACTION_OPTIONS.map(option => {
                const active = option === status;
                const allowed = canSelectStatus(status, option, 'cashier');
                const disabled = busy || active || !allowed;
                return (
                  <Pressable
                    key={option}
                    accessibilityRole="button"
                    accessibilityLabel={`Set status to ${option}`}
                    accessibilityState={{disabled, selected: active}}
                    disabled={disabled}
                    onPress={() => onUpdateStatus(order.id, option)}
                    style={[
                      styles.chip,
                      active ? styles.chipActive : null,
                      !active && !allowed ? styles.chipDisabled : null,
                    ]}>
                    <Text
                      style={[
                        styles.chipText,
                        active ? styles.chipTextActive : null,
                        !active && !allowed ? styles.chipTextDisabled : null,
                      ]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : (
          <Text style={styles.addressText}>
            Tab stays open until guest finishes. Add mid-meal items anytime,
            then Close tab for the final slip.
          </Text>
        )}
      </View>
    </View>
  );
};

const CashierOrdersScreen = () => {
  const {
    navigation,
    channelTab,
    setChannelTab,
    onlineCount,
    posCount,
    orders,
    isPending,
    updatingId,
    slipOrder,
    errorMessage,
    handleLogout,
    handleUpdateStatus,
    handleAddToTab,
    handleCloseTab,
    handleRetry,
    setSlipOrder,
    closeSlip,
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
        icon="clipboard-list-outline"
        title={channelTab === 'pos' ? 'No POS orders' : 'No online orders'}
        subtitle={
          channelTab === 'pos'
            ? 'Walk-in POS orders for this branch will show here.'
            : 'Customer app orders for this branch will show here.'
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.backButton} />
        <Text style={styles.headerTitle}>Cashier Orders</Text>
        <Pressable
          accessibilityLabel="Logout"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleLogout}>
          <Icon name="logout" size={22} color="#C74440" />
        </Pressable>
      </View>

      <View style={styles.staffNav}>
        <Pressable
          accessibilityRole="button"
          style={[styles.staffNavButton, styles.staffNavButtonActive]}>
          <Icon name="clipboard-list-outline" size={18} color="#FF7622" />
          <Text style={styles.staffNavText}>Orders</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={styles.staffNavButton}
          onPress={() => navigation.navigate('CashierPOS')}>
          <Icon name="point-of-sale" size={18} color="#FF7622" />
          <Text style={styles.staffNavText}>POS</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={styles.staffNavButton}
          onPress={() => navigation.navigate('CashierSales')}>
          <Icon name="chart-line" size={18} color="#FF7622" />
          <Text style={styles.staffNavText}>Branch Sales</Text>
        </Pressable>
      </View>

      <View style={styles.channelTabs}>
        <Pressable
          accessibilityRole="button"
          style={[
            styles.channelTab,
            channelTab === 'online' && styles.channelTabActive,
          ]}
          onPress={() => setChannelTab('online')}>
          <Text
            style={[
              styles.channelTabText,
              channelTab === 'online' && styles.channelTabTextActive,
            ]}>
            Online ({onlineCount})
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[
            styles.channelTab,
            channelTab === 'pos' && styles.channelTabActive,
          ]}
          onPress={() => setChannelTab('pos')}>
          <Text
            style={[
              styles.channelTabText,
              channelTab === 'pos' && styles.channelTabTextActive,
            ]}>
            POS ({posCount})
          </Text>
        </Pressable>
      </View>

      {isPending ? (
        <OrderListSkeleton />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={listEmpty}
          renderItem={({item}) => (
            <CashierOrderCard
              order={item}
              busy={updatingId === item.id}
              onUpdateStatus={handleUpdateStatus}
              onPrintSlip={setSlipOrder}
              onAddToTab={handleAddToTab}
              onCloseTab={handleCloseTab}
            />
          )}
        />
      )}

      <OrderSlipModal
        visible={!!slipOrder}
        order={slipOrder}
        onClose={closeSlip}
      />
    </SafeAreaView>
  );
};

export default CashierOrdersScreen;
