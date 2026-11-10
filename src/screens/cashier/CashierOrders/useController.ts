import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, BackHandler} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {
  useAllOrdersQuery,
  useCloseDineInTabMutation,
  useUpdateOrderStatusMutation,
} from '../../../hooks/useOrdersQuery';
import {notifyInApp} from '../../../services/pushNotifications';
import {
  isOpenDineInTab,
  resolveOrderChannel,
  type OrderChannel,
  type OrderStatus,
  type StoredOrder,
} from '../../../storage/orderStorage';
import type {RootStackParamList} from '../../../types/navigation';
import {canSelectStatus} from '../../../utils/orderStatus';

type Nav = NativeStackNavigationProp<RootStackParamList, 'CashierOrders'>;

export type CashierOrderTab = 'online' | 'pos';

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isCashier, user, logout} = useAuth();
  const branchId = user?.branchId ?? null;
  const [channelTab, setChannelTab] = useState<CashierOrderTab>('online');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [slipOrder, setSlipOrder] = useState<StoredOrder | null>(null);
  const {
    data: allOrders = [],
    error: ordersError,
    isPending,
    refetch,
  } = useAllOrdersQuery(isCashier);
  const {mutateAsync: updateOrderStatus} = useUpdateOrderStatusMutation();
  const {mutateAsync: closeDineInTab} = useCloseDineInTabMutation();

  useEffect(() => {
    if (!isCashier) {
      navigation.replace('Login');
    }
  }, [isCashier, navigation]);

  const branchOrders = useMemo(() => {
    return allOrders.filter(order => {
      if (order.branchId == null) {
        return true;
      }
      if (branchId == null) {
        return false;
      }
      return order.branchId === branchId;
    });
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
    const filtered = branchOrders.filter(
      order => resolveOrderChannel(order) === channelTab,
    );
    if (channelTab !== 'pos') {
      return filtered;
    }
    // Manage POS/dine-in by table number first.
    return [...filtered].sort((a, b) => {
      const aOpen = isOpenDineInTab(a) ? 0 : 1;
      const bOpen = isOpenDineInTab(b) ? 0 : 1;
      if (aOpen !== bOpen) {
        return aOpen - bOpen;
      }
      const tableCompare = (a.tableNo ?? '').localeCompare(b.tableNo ?? '', undefined, {
        numeric: true,
        sensitivity: 'base',
      });
      if (tableCompare !== 0) {
        return tableCompare;
      }
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }, [branchOrders, channelTab]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch {
      // ignore — always leave staff area
    } finally {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  }, [logout, navigation]);

  useFocusEffect(
    useCallback(() => {
      if (!isCashier) {
        return;
      }

      void refetch().catch(() => undefined);

      const onHardwareBack = () => {
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
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onHardwareBack,
      );

      return () => {
        subscription.remove();
      };
    }, [handleLogout, isCashier, refetch]),
  );

  const handleUpdateStatus = useCallback(
    async (orderId: string, nextStatus: OrderStatus) => {
      const current = orders.find(
        order => order.id === orderId || order.orderId === orderId,
      );
      if (
        current &&
        !canSelectStatus(current.status ?? 'Pending', nextStatus, 'cashier')
      ) {
        Alert.alert(
          'Status locked',
          'You can only confirm pending orders or cancel before dispatch.',
        );
        return;
      }

      setUpdatingId(orderId);
      try {
        const updated = await updateOrderStatus({
          orderId,
          status: nextStatus,
        });
        await notifyInApp(
          'Order status updated',
          `Your order ${updated.orderId} is now ${nextStatus}.`,
          updated.id,
        );
        if (nextStatus === 'Confirmed') {
          setSlipOrder(updated);
        }
      } catch (err) {
        Alert.alert(
          'Update failed',
          err instanceof Error
            ? err.message
            : "Couldn't update order status. Please try again.",
        );
      } finally {
        setUpdatingId(null);
      }
    },
    [orders, updateOrderStatus],
  );

  const errorMessage = ordersError
    ? ordersError instanceof Error
      ? ordersError.message
      : "Couldn't load orders. Please try again."
    : null;

  const handleRetry = useCallback(() => {
    void refetch().catch(() => undefined);
  }, [refetch]);

  const closeSlip = useCallback(() => {
    setSlipOrder(null);
  }, []);

  const handleAddToTab = useCallback(
    (order: StoredOrder) => {
      if (!isOpenDineInTab(order)) {
        Alert.alert('Tab closed', 'This dine-in tab can no longer accept items.');
        return;
      }
      navigation.navigate('CashierPOS', {openOrderId: order.id});
    },
    [navigation],
  );

  const handleCloseTab = useCallback(
    (order: StoredOrder) => {
      if (!isOpenDineInTab(order)) {
        return;
      }
      Alert.alert(
        'Close dine-in tab',
        `Close ${order.orderId} for ${order.customerName}? Guest is finished — final slip will be ready.`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Close tab',
            style: 'destructive',
            onPress: () => {
              void (async () => {
                setUpdatingId(order.id);
                try {
                  const closed = await closeDineInTab(order.id);
                  setSlipOrder(closed);
                } catch (err) {
                  Alert.alert(
                    'Close failed',
                    err instanceof Error
                      ? err.message
                      : "Couldn't close this dine-in tab.",
                  );
                } finally {
                  setUpdatingId(null);
                }
              })();
            },
          },
        ],
      );
    },
    [closeDineInTab],
  );

  return {
    navigation,
    isCashier,
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
  };
};

export default useController;
export type {OrderChannel};
