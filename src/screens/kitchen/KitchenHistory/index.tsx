import React, {useCallback} from 'react';
import {Alert, FlatList, Pressable, StatusBar, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {OrderListSkeleton} from '../../../components/Skeleton';
import {StateMessage} from '../../../components/StateMessage';
import {
  resolveOrderChannel,
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

const HistoryCard = ({order}: {order: StoredOrder}) => {
  const status = order.status ?? 'Pending';
  const itemsSummary = (order.items ?? [])
    .map(item => `${item.quantity}x ${item.name}`)
    .join(', ');
  const delivered = status === 'Delivered';

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderTopRow}>
        <Text style={styles.orderId}>{order.orderId}</Text>
        <View
          style={[
            styles.statusBadge,
            delivered ? styles.statusBadgeDelivered : styles.statusBadgeOnTheWay,
          ]}>
          <Text
            style={[
              styles.statusText,
              delivered ? styles.statusTextDelivered : styles.statusTextOnTheWay,
            ]}>
            {status}
          </Text>
        </View>
      </View>

      <Text style={styles.channelMeta}>
        {channelLabel(resolveOrderChannel(order))} · {kitchenModeLabel(order)}
      </Text>

      <Text style={styles.orderDetails} numberOfLines={3}>
        {itemsSummary || 'No items'}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {formatOrderWhen(order.updatedAt ?? order.createdAt)}
        </Text>
        <Text style={styles.orderPrice}>
          {formatOrderPrice(order.totalAmount)}
        </Text>
      </View>
    </View>
  );
};

const KitchenHistoryScreen = () => {
  const {
    historyOrders,
    isPending,
    errorMessage,
    handleLogout,
    handleRetry,
  } = useController();

  const confirmLogout = useCallback(() => {
    Alert.alert('Logout', 'Do you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          void handleLogout();
        },
      },
    ]);
  }, [handleLogout]);

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
        title="No kitchen history yet"
        subtitle="Orders you prepare and dispatch will show up here."
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Text style={styles.headerTitle}>Order history</Text>
        <Pressable
          accessibilityLabel="Logout"
          accessibilityRole="button"
          style={styles.logoutButton}
          onPress={confirmLogout}>
          <Icon name="logout" size={22} color="#C74440" />
        </Pressable>
      </View>

      {isPending ? (
        <OrderListSkeleton />
      ) : (
        <FlatList
          data={historyOrders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                Recent orders this kitchen prepared and dispatched.
              </Text>
            </View>
          }
          ListEmptyComponent={listEmpty}
          renderItem={({item}) => <HistoryCard order={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default KitchenHistoryScreen;
