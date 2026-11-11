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
  formatOrderPrice,
  formatOrderTime,
  formatWaitLabel,
  getOrderTimePriority,
  type OrderTimePriority,
} from '../../../utils/orderStatus';
import {channelLabel} from '../../../utils/revenueFromOrders';
import {styles} from './styles';
import useController from './useController';

const priorityStyles: Record<
  OrderTimePriority,
  {badge: object; text: object; card: object}
> = {
  low: {
    badge: styles.priorityBadgeLow,
    text: styles.priorityTextLow,
    card: styles.orderCardPriorityLow,
  },
  normal: {
    badge: styles.priorityBadgeNormal,
    text: styles.priorityTextNormal,
    card: styles.orderCardPriorityNormal,
  },
  high: {
    badge: styles.priorityBadgeHigh,
    text: styles.priorityTextHigh,
    card: styles.orderCardPriorityHigh,
  },
  urgent: {
    badge: styles.priorityBadgeUrgent,
    text: styles.priorityTextUrgent,
    card: styles.orderCardPriorityUrgent,
  },
};

const modeLabel = (order: StoredOrder) => {
  if (order.orderMode === 'dine_in') {
    return isOpenDineInTab(order) ? 'Open tab' : 'Closed';
  }
  if (order.orderMode === 'pickup') {
    return 'Pickup';
  }
  return 'Delivery';
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

const BriefOrderCard = ({
  order,
  busy,
  onUpdateStatus,
  onEditTab,
  onCloseTab,
  onOpenHistory,
}: {
  order: StoredOrder;
  busy: boolean;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onEditTab: (order: StoredOrder) => void;
  onCloseTab: (order: StoredOrder) => void;
  onOpenHistory: () => void;
}) => {
  const status = order.status ?? 'Pending';
  const statusStyle = statusStyles[status] ?? statusStyles.Pending;
  const canConfirm = status === 'Pending';
  const openTab = isOpenDineInTab(order);
  const channel = resolveOrderChannel(order);
  const isPos = channel === 'pos';
  const itemCount = (order.items ?? []).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const priority = getOrderTimePriority(order.createdAt);
  const priorityStyle = priorityStyles[priority.level];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Active order for ${order.customerName || 'customer'}, ${priority.label} priority`}
      style={[styles.orderCard, priorityStyle.card]}
      onPress={onOpenHistory}>
      <View style={styles.briefTopRow}>
        <View style={styles.briefLeft}>
          <Text style={styles.customerName} numberOfLines={1}>
            {order.customerName || 'Customer'}
          </Text>
          <Text style={styles.briefMeta} numberOfLines={1}>
            {order.tableNo ? `Table ${order.tableNo} · ` : ''}
            {channelLabel(channel)} · {modeLabel(order)}
          </Text>
          <Text style={styles.briefMeta} numberOfLines={1}>
            {itemCount} item{itemCount === 1 ? '' : 's'} ·{' '}
            {formatOrderPrice(order.totalAmount)}
          </Text>
        </View>

        <View style={styles.briefCenter}>
          <Text style={styles.orderTimeBold}>
            {formatOrderTime(order.createdAt)}
          </Text>
          <Text style={styles.orderTimeCaption}>Ordered</Text>
          <View style={[styles.priorityBadge, priorityStyle.badge]}>
            <Text style={[styles.priorityText, priorityStyle.text]}>
              {priority.label} · {formatWaitLabel(priority.waitMinutes)}
            </Text>
          </View>
        </View>

        <View style={styles.briefRight}>
          <View
            style={[
              styles.channelDot,
              isPos ? styles.channelDotPos : styles.channelDotOnline,
            ]}
          />
          <View style={[styles.statusBadge, statusStyle.badge]}>
            <Text style={[styles.statusText, statusStyle.text]}>{status}</Text>
          </View>
          <Text style={styles.activeLabel}>Active</Text>
        </View>
      </View>

      {(openTab || canConfirm) && (
        <View style={styles.briefActions}>
          {openTab ? (
            <>
              <Pressable
                accessibilityRole="button"
                disabled={busy}
                onPress={event => {
                  event.stopPropagation?.();
                  onEditTab(order);
                }}
                style={[
                  styles.confirmButton,
                  styles.tabActionButton,
                  busy ? styles.confirmButtonDisabled : null,
                ]}>
                <Text style={styles.confirmButtonText}>Edit</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={busy}
                onPress={event => {
                  event.stopPropagation?.();
                  onCloseTab(order);
                }}
                style={[
                  styles.closeTabButton,
                  busy ? styles.confirmButtonDisabled : null,
                ]}>
                <Text style={styles.closeTabButtonText}>Pay & close</Text>
              </Pressable>
            </>
          ) : null}

          {canConfirm ? (
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={event => {
                event.stopPropagation?.();
                onUpdateStatus(order.id, 'Confirmed');
              }}
              style={[
                styles.confirmButton,
                styles.briefConfirmFull,
                busy ? styles.confirmButtonDisabled : null,
              ]}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </Pressable>
  );
};

const CashierOrdersScreen = () => {
  const {
    navigation,
    channelTab,
    setChannelTab,
    activeCount,
    onlineCount,
    posCount,
    orders,
    isPending,
    updatingId,
    slipOrder,
    errorMessage,
    handleLogout,
    handleUpdateStatus,
    handleEditTab,
    handleCloseTab,
    handleRetry,
    closeSlip,
  } = useController();

  const openHistory = () => {
    navigation.navigate('CashierOrderHistory');
  };

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

    const emptyTitle =
      channelTab === 'all'
        ? 'No active orders'
        : channelTab === 'pos'
          ? 'No active POS orders'
          : 'No active online orders';

    return (
      <StateMessage
        icon="clipboard-list-outline"
        title={emptyTitle}
        subtitle="Online + POS active orders show together in All. Closed orders stay in History."
        actionLabel="Open History"
        onAction={openHistory}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.backButton} />
        <Text style={styles.headerTitle}>Active Orders</Text>
        <Pressable
          accessibilityLabel="Logout"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleLogout}>
          <Icon name="logout" size={22} color="#C74440" />
        </Pressable>
      </View>

      <View style={styles.channelTabs}>
        <Pressable
          accessibilityRole="button"
          style={[
            styles.channelTab,
            channelTab === 'all' && styles.channelTabActive,
          ]}
          onPress={() => setChannelTab('all')}>
          <Text
            style={[
              styles.channelTabText,
              channelTab === 'all' && styles.channelTabTextActive,
            ]}>
            All ({activeCount})
          </Text>
        </Pressable>
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
            <BriefOrderCard
              order={item}
              busy={updatingId === item.id}
              onUpdateStatus={handleUpdateStatus}
              onEditTab={handleEditTab}
              onCloseTab={handleCloseTab}
              onOpenHistory={openHistory}
            />
          )}
        />
      )}

      <OrderSlipModal
        visible={!!slipOrder}
        order={slipOrder}
        onClose={closeSlip}
        onEditOpenTab={handleEditTab}
      />
    </SafeAreaView>
  );
};

export default CashierOrdersScreen;
