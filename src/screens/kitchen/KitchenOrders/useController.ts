import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, BackHandler} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  type CompositeNavigationProp,
} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {
  useAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from '../../../hooks/useOrdersQuery';
import {notifyInApp} from '../../../services/pushNotifications';
import type {OrderStatus} from '../../../storage/orderStorage';
import type {
  KitchenTabParamList,
  RootStackParamList,
} from '../../../types/navigation';
import {canSelectStatus} from '../../../utils/orderStatus';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<KitchenTabParamList, 'KitchenOrders'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const KITCHEN_ACTIVE: OrderStatus[] = ['Confirmed', 'Preparing'];

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isKitchen, user, logout} = useAuth();
  const branchId = user?.branchId ?? null;
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const {
    data: allOrders = [],
    error: ordersError,
    isPending,
    refetch,
  } = useAllOrdersQuery(isKitchen);
  const {mutateAsync: updateOrderStatus} = useUpdateOrderStatusMutation();

  useEffect(() => {
    if (!isKitchen) {
      navigation.replace('Login');
    }
  }, [isKitchen, navigation]);

  const branchFiltered = useMemo(
    () =>
      allOrders.filter(order =>
        branchId ? order.branchId === branchId : true,
      ),
    [allOrders, branchId],
  );

  const activeOrders = useMemo(
    () =>
      branchFiltered.filter(order =>
        KITCHEN_ACTIVE.includes(order.status ?? 'Pending'),
      ),
    [branchFiltered],
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  }, [logout, navigation]);

  useFocusEffect(
    useCallback(() => {
      if (!isKitchen) {
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
    }, [handleLogout, isKitchen, refetch]),
  );

  const handleUpdateStatus = useCallback(
    async (orderId: string, nextStatus: OrderStatus) => {
      const current = activeOrders.find(
        order => order.id === orderId || order.orderId === orderId,
      );
      if (
        current &&
        !canSelectStatus(current.status ?? 'Pending', nextStatus, 'kitchen')
      ) {
        Alert.alert(
          'Status locked',
          'You can only move orders from confirmed through dispatch.',
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
    [activeOrders, updateOrderStatus],
  );

  const errorMessage = ordersError
    ? ordersError instanceof Error
      ? ordersError.message
      : "Couldn't load orders. Please try again."
    : null;

  const handleRetry = useCallback(() => {
    void refetch().catch(() => undefined);
  }, [refetch]);

  return {
    activeOrders,
    isPending,
    updatingId,
    errorMessage,
    handleLogout,
    handleUpdateStatus,
    handleRetry,
  };
};

export default useController;
