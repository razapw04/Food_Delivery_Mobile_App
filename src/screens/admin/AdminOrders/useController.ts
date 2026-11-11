import {useCallback, useMemo, useState} from 'react';
import {Alert, BackHandler} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {
  useAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from '../../../hooks/useOrdersQuery';
import {notifyInApp} from '../../../services/pushNotifications';
import type {OrderStatus, StoredOrder} from '../../../storage/orderStorage';
import type {UserRole} from '../../../storage/authStorage';
import type {RootStackParamList} from '../../../types/navigation';
import {canSelectStatus} from '../../../utils/orderStatus';
import {getBranchProductSalesLists} from '../../../utils/revenueFromOrders';
import {BRANCH_REVENUE} from '../AdminRevenue/mockData';

export {STATUS_OPTIONS} from '../../../utils/orderStatus';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isAdmin, isSuperAdmin, canViewRevenue, logout, user} = useAuth();
  const staffRole: UserRole = user?.role ?? 'manager';
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [slipOrder, setSlipOrder] = useState<StoredOrder | null>(null);
  const {
    data: orders = [],
    error: ordersError,
    isPending,
    refetch,
  } = useAllOrdersQuery(isAdmin);
  const {mutateAsync: updateOrderStatus} = useUpdateOrderStatusMutation();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch {
      // ignore — always leave admin area
    } finally {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  }, [logout, navigation]);

  useFocusEffect(
    useCallback(() => {
      if (!isAdmin) {
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
    }, [handleLogout, isAdmin, refetch]),
  );

  const handleUpdateStatus = useCallback(
    async (orderId: string, nextStatus: OrderStatus) => {
      if (isSuperAdmin) {
        return;
      }
      const current = orders.find(
        order => order.id === orderId || order.orderId === orderId,
      );
      if (
        current &&
        !canSelectStatus(current.status ?? 'Pending', nextStatus, staffRole)
      ) {
        Alert.alert(
          'Status locked',
          'You can only move an order forward. Previous statuses stay disabled.',
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
    [isSuperAdmin, orders, staffRole, updateOrderStatus],
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

  const branchId = user?.branchId ?? null;
  const productSales = useMemo(() => {
    if (isSuperAdmin) {
      return null;
    }
    return getBranchProductSalesLists(orders, {
      branchId,
      limit: null,
      snapshot: branchId != null ? BRANCH_REVENUE[branchId] ?? null : null,
    });
  }, [branchId, isSuperAdmin, orders]);

  return {
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
  };
};

export default useController;
