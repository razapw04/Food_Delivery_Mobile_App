import React from 'react';
import {FlatList, Pressable, StatusBar, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AdminMenuButton from '../../../components/AdminMenuButton';
import BranchProductSalesLists from '../../../components/BranchProductSalesLists';
import OrderSlipModal from '../../../components/OrderSlipModal';
import {OrderListSkeleton} from '../../../components/Skeleton';
import {StateMessage} from '../../../components/StateMessage';
import type {UserRole} from '../../../storage/authStorage';
import type {OrderStatus, StoredOrder} from '../../../storage/orderStorage';
import {styles} from './styles';
import {
  STATUS_OPTIONS,
  canSelectStatus,
  formatOrderPrice,
  formatOrderWhen,
} from '../../../utils/orderStatus';
import useController from './useController';

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
  role,
  hideStatusControls,
  onUpdateStatus,
  onPrintSlip,
}: {
  order: StoredOrder;
  busy: boolean;
  role: UserRole;
  hideStatusControls: boolean;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onPrintSlip: (order: StoredOrder) => void;
}) => {
  const status = order.status ?? 'Pending';
  const statusStyle = statusStyles[status] ?? statusStyles.Pending;
  const itemsSummary = (order.items ?? [])
    .map(item => `${item.quantity}x ${item.name}`)
    .join(', ');
  const canConfirm = !hideStatusControls && status === 'Pending';
  const canPrint = status !== 'Pending' && status !== 'Cancelled';

  return (
    <View style={styles.orderCard}>
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
          {!hideStatusControls ? (
            <View style={[styles.statusBadge, statusStyle.badge]}>
              <Text style={[styles.statusText, statusStyle.text]}>
                {status}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Text style={styles.customerName}>{order.customerName || 'Customer'}</Text>
      <Text style={styles.customerEmail}>{order.customerEmail}</Text>
      <Text style={styles.orderDetails} numberOfLines={3}>
        {itemsSummary || 'No items'}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {formatOrderWhen(order.createdAt)} ·{' '}
          {order.orderMode === 'dine_in'
            ? 'Dine-in'
            : order.orderMode === 'pickup'
              ? 'Pickup'
              : 'Delivery'}
        </Text>
        <Text style={styles.orderPrice}>
          {formatOrderPrice(order.totalAmount)}
        </Text>
      </View>

      {order.deliveryAddress ? (
        <Text style={styles.addressText} numberOfLines={2}>
          {order.deliveryAddress}
        </Text>
      ) : null}

      {!hideStatusControls ? (
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
              const allowed = canSelectStatus(status, option, role);
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
        </View>
      ) : null}
    </View>
  );
};

const AdminOrdersScreen = () => {
  const {
    navigation,
    isAdmin,
    isSuperAdmin,
    canViewRevenue,
    user,
    orders,
    productSales,
    isPending,
    updatingId,
    slipOrder,
    errorMessage,
    handleLogout,
    handleUpdateStatus,
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
        title="No orders yet"
        subtitle={
          isSuperAdmin
            ? 'Branch orders appear here for overview. Status is managed by branch staff.'
            : 'Customer orders will appear here so you can confirm and update status.'
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <AdminMenuButton />
        <Text style={styles.headerTitle}>
          {isSuperAdmin ? 'Orders' : 'Manager Orders'}
        </Text>
        <Pressable
          accessibilityLabel="Logout"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleLogout}>
          <Icon name="logout" size={22} color="#C74440" />
        </Pressable>
      </View>

      {isSuperAdmin ? (
        <View style={styles.adminNav}>
          <Pressable
            accessibilityRole="button"
            style={styles.adminNavButton}
            onPress={() =>
              navigation.navigate('AdminTabs', {screen: 'AdminProducts'})
            }>
            <Icon name="food" size={18} color="#FF7622" />
            <Text style={styles.adminNavText}>Menu</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.adminNavButton}
            onPress={() =>
              navigation.navigate('AdminTabs', {screen: 'AdminRevenue'})
            }>
            <Icon name="chart-line" size={18} color="#FF7622" />
            <Text style={styles.adminNavText}>Revenue</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.adminNavButton}
            onPress={() =>
              navigation.navigate('AdminTabs', {screen: 'AdminAdmins'})
            }>
            <Icon name="account-key" size={18} color="#FF7622" />
            <Text style={styles.adminNavText}>Staff</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.adminNavButton}
            onPress={() =>
              navigation.navigate('AdminTabs', {screen: 'AdminBranches'})
            }>
            <Icon name="store-outline" size={18} color="#FF7622" />
            <Text style={styles.adminNavText}>Branches</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.adminNavButton}
            onPress={() => navigation.navigate('AdminPriceApprovals')}>
            <Icon name="clipboard-check-outline" size={18} color="#FF7622" />
            <Text style={styles.adminNavText}>Approvals</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.adminNavButton}
            onPress={() => navigation.navigate('AdminInventoryRequests')}>
            <Icon name="package-variant-closed" size={18} color="#FF7622" />
            <Text style={styles.adminNavText}>Inventory</Text>
          </Pressable>
        </View>
      ) : isAdmin ? (
        <View style={styles.adminNav}>
          <Pressable
            accessibilityRole="button"
            style={styles.adminNavButton}
            onPress={() =>
              navigation.navigate('AdminTabs', {screen: 'AdminProducts'})
            }>
            <Icon name="tag-outline" size={18} color="#FF7622" />
            <Text style={styles.adminNavText}>Request price</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.adminNavButton}
            onPress={() =>
              navigation.navigate('AdminTabs', {screen: 'AdminAdmins'})
            }>
            <Icon name="account-group-outline" size={18} color="#FF7622" />
            <Text style={styles.adminNavText}>Employees</Text>
          </Pressable>
          {canViewRevenue ? (
            <Pressable
              accessibilityRole="button"
              style={styles.adminNavButton}
              onPress={() =>
                navigation.navigate('AdminTabs', {screen: 'AdminRevenue'})
              }>
              <Icon name="chart-line" size={18} color="#FF7622" />
              <Text style={styles.adminNavText}>Branch sales</Text>
            </Pressable>
          ) : null}
          <Pressable
            accessibilityRole="button"
            style={styles.adminNavButton}
            onPress={() => navigation.navigate('AdminInventoryRequests')}>
            <Icon name="package-variant-closed" size={18} color="#FF7622" />
            <Text style={styles.adminNavText}>Inventory</Text>
          </Pressable>
        </View>
      ) : null}

      {isPending ? (
        <OrderListSkeleton />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={listEmpty}
          ListHeaderComponent={
            productSales ? (
              <BranchProductSalesLists
                most={productSales.most}
                hot={productSales.hot}
                least={productSales.least}
                meta="Your branch"
                emptyText="No countable sales yet for this branch."
              />
            ) : null
          }
          renderItem={({item}) => (
            <AdminOrderCard
              order={item}
              busy={updatingId === item.id}
              role={user?.role ?? 'manager'}
              hideStatusControls={isSuperAdmin}
              onUpdateStatus={handleUpdateStatus}
              onPrintSlip={setSlipOrder}
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

export default AdminOrdersScreen;
