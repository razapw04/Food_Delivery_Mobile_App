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

const paymentLabel = (method: StoredOrder['paymentMethod']) => {
  if (method === 'card') {
    return 'Card';
  }
  if (method === 'jazzcash') {
    return 'JazzCash';
  }
  return 'Cash';
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

const HistoryDetailCard = ({
  order,
  onPrintSlip,
}: {
  order: StoredOrder;
  onPrintSlip: (order: StoredOrder) => void;
}) => {
  const status = order.status ?? 'Pending';
  const statusStyle = statusStyles[status] ?? statusStyles.Pending;
  const channel = resolveOrderChannel(order);
  const isPos = channel === 'pos';
  const canPrint = status !== 'Pending' && status !== 'Cancelled';

  return (
    <View style={styles.detailCard}>
      <View style={styles.cardTop}>
        <View style={{flex: 1}}>
          <Text style={styles.customerName}>
            {order.customerName || 'Customer'}
          </Text>
          <Text style={styles.orderId}>{order.orderId}</Text>
        </View>
        <View style={styles.topActions}>
          {canPrint ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Print slip for ${order.orderId}`}
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

      <View style={styles.badgeRow}>
        <View style={[styles.infoBadge, isPos ? styles.infoBadgePos : null]}>
          <Text
            style={[
              styles.infoBadgeText,
              isPos ? styles.infoBadgeTextPos : null,
            ]}>
            {channelLabel(channel)}
          </Text>
        </View>
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>{modeLabel(order)}</Text>
        </View>
        {order.tableNo ? (
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>Table {order.tableNo}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Guest details</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Created</Text>
          <Text style={styles.metaValue}>
            {formatOrderWhen(order.createdAt)}
          </Text>
        </View>
        {order.updatedAt ? (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Updated</Text>
            <Text style={styles.metaValue}>
              {formatOrderWhen(order.updatedAt)}
            </Text>
          </View>
        ) : null}
        {order.waiterName ? (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Waiter</Text>
            <Text style={styles.metaValue}>{order.waiterName}</Text>
          </View>
        ) : null}
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Contact</Text>
          <Text style={styles.metaValue}>{order.customerEmail || '—'}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Payment</Text>
          <Text style={styles.metaValue}>
            {paymentLabel(order.paymentMethod)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {(order.items ?? []).length === 0 ? (
          <Text style={styles.noteText}>No items</Text>
        ) : (
          (order.items ?? []).map(item => (
            <View key={item.id} style={styles.itemRow}>
              <View style={{flex: 1}}>
                <Text style={styles.itemName}>
                  {item.quantity}x {item.name}
                </Text>
                <Text style={styles.itemMeta} numberOfLines={2}>
                  {item.variation}
                  {item.toppings.length > 0
                    ? ` · ${item.toppings.join(', ')}`
                    : ''}
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                {formatOrderPrice(item.unitPrice * item.quantity)}
              </Text>
            </View>
          ))
        )}

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Subtotal</Text>
          <Text style={styles.metaValue}>
            {formatOrderPrice(order.productTotal)}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Discount</Text>
          <Text style={styles.metaValue}>
            - {formatOrderPrice(order.discount)}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Tax ({order.taxPercent}%)</Text>
          <Text style={styles.metaValue}>
            {formatOrderPrice(order.taxAmount)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>
            {formatOrderPrice(order.totalAmount)}
          </Text>
        </View>
      </View>

      {order.deliveryAddress || order.deliveryInstructions?.trim() ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          {order.deliveryAddress ? (
            <Text style={styles.noteText}>{order.deliveryAddress}</Text>
          ) : null}
          {order.deliveryInstructions?.trim() ? (
            <Text style={styles.noteText}>
              {order.deliveryInstructions.trim()}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const CashierOrderHistoryScreen = () => {
  const {
    channelTab,
    setChannelTab,
    onlineCount,
    posCount,
    totalCount,
    orders,
    isPending,
    slipOrder,
    setSlipOrder,
    closeSlip,
    errorMessage,
    handleBack,
    handleRetry,
  } = useController();

  const listEmpty = () => {
    if (errorMessage) {
      return (
        <StateMessage
          icon="wifi-off"
          title="Couldn't load history"
          subtitle={errorMessage}
          actionLabel="Retry"
          onAction={handleRetry}
        />
      );
    }

    return (
      <StateMessage
        icon="history"
        title="No order history"
        subtitle="Completed and past branch orders will show here with full details."
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Back to orders"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleBack}>
          <Icon name="arrow-left" size={22} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={styles.backButton} />
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
            All ({totalCount})
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
            <HistoryDetailCard order={item} onPrintSlip={setSlipOrder} />
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

export default CashierOrderHistoryScreen;
