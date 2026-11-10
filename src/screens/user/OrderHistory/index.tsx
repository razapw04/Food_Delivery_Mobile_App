import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {OrderListSkeleton} from '../../../components/Skeleton';
import {StateMessage} from '../../../components/StateMessage';
import {type OrderHistoryItem, type OrderStatus} from './model';
import useController, {normalizeStatus} from './useController';
import {styles} from './styles';

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

const OrderHistoryScreen = () => {
  const {user, showBack, orders, isPending, errorMessage, retryLoad, goBack} =
    useController();

  const listEmpty = () => {
    if (errorMessage) {
      return (
        <StateMessage
          icon="wifi-off"
          title="Couldn't load orders"
          subtitle={errorMessage}
          actionLabel="Retry"
          onAction={retryLoad}
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
            onPress={goBack}>
            <Icon name="arrow-left" size={22} color="#1A1A1A" />
          </Pressable>
        ) : (
          <View style={styles.backButton} />
        )}
        <Text style={styles.headerTitle}>Order History</Text>
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
          renderItem={({item}) => <OrderCard order={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;
