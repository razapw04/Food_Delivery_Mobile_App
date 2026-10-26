import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {MainTabParamList} from '../../types/navigation';
import {orderHistory, type OrderHistoryItem, type OrderStatus} from './model';
import {styles} from './styles';

type Props = BottomTabScreenProps<MainTabParamList, 'Orders'>;

const statusStyles: Record<
  OrderStatus,
  {badge: object; text: object}
> = {
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
  const statusStyle = statusStyles[order.status];

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderTopRow}>
        <Text style={styles.orderId}>{order.orderId}</Text>
        <View style={[styles.statusBadge, statusStyle.badge]}>
          <Text style={[styles.statusText, statusStyle.text]}>
            {order.status}
          </Text>
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

const EmptyOrders = () => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyIconWrap}>
      <Icon name="package-variant-closed" size={32} color="#9CA3AF" />
    </View>
    <Text style={styles.emptyTitle}>No orders yet</Text>
    <Text style={styles.emptySubtitle}>
      When you place an order, it will show up here with its status and details.
    </Text>
  </View>
);

const OrderHistoryScreen = ({navigation}: Props) => {
  const showBack = navigation.canGoBack();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        {showBack ? (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={22} color="#1A1A1A" />
          </Pressable>
        ) : (
          <View style={styles.backButton} />
        )}
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      <FlatList
        data={orderHistory}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyOrders />}
        renderItem={({item}) => <OrderCard order={item} />}
      />
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;
