import {useCallback, useEffect, useMemo, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {useAllOrdersQuery} from '../../../hooks/useOrdersQuery';
import {
  resolveOrderChannel,
  type OrderChannel,
  type StoredOrder,
} from '../../../storage/orderStorage';
import type {
  CashierTabParamList,
  RootStackParamList,
} from '../../../types/navigation';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<CashierTabParamList, 'CashierOrderHistory'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type HistoryChannelTab = 'all' | OrderChannel;

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isCashier, user} = useAuth();
  const branchId = user?.branchId ?? null;
  const [channelTab, setChannelTab] = useState<HistoryChannelTab>('all');
  const [slipOrder, setSlipOrder] = useState<StoredOrder | null>(null);

  const {
    data: allOrders = [],
    error: ordersError,
    isPending,
    refetch,
  } = useAllOrdersQuery(isCashier);

  useEffect(() => {
    if (!isCashier) {
      navigation.replace('Login');
    }
  }, [isCashier, navigation]);

  useFocusEffect(
    useCallback(() => {
      void refetch().catch(() => undefined);
    }, [refetch]),
  );

  const branchOrders = useMemo(() => {
    return allOrders
      .filter(order => {
        if (order.branchId == null) {
          return true;
        }
        if (branchId == null) {
          return false;
        }
        return order.branchId === branchId;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt ?? b.createdAt).getTime() -
          new Date(a.updatedAt ?? a.createdAt).getTime(),
      );
  }, [allOrders, branchId]);

  const onlineCount = useMemo(
    () =>
      branchOrders.filter(order => resolveOrderChannel(order) === 'online')
        .length,
    [branchOrders],
  );

  const posCount = useMemo(
    () =>
      branchOrders.filter(order => resolveOrderChannel(order) === 'pos').length,
    [branchOrders],
  );

  const orders = useMemo(() => {
    if (channelTab === 'all') {
      return branchOrders;
    }
    return branchOrders.filter(
      order => resolveOrderChannel(order) === channelTab,
    );
  }, [branchOrders, channelTab]);

  const errorMessage = ordersError
    ? ordersError instanceof Error
      ? ordersError.message
      : "Couldn't load order history."
    : null;

  const handleRetry = useCallback(() => {
    void refetch().catch(() => undefined);
  }, [refetch]);

  const closeSlip = useCallback(() => {
    setSlipOrder(null);
  }, []);

  const handleBack = useCallback(() => {
    navigation.navigate('CashierOrders');
  }, [navigation]);

  return {
    channelTab,
    setChannelTab,
    onlineCount,
    posCount,
    totalCount: branchOrders.length,
    orders,
    isPending,
    slipOrder,
    setSlipOrder,
    closeSlip,
    errorMessage,
    handleBack,
    handleRetry,
  };
};

export default useController;
