import {useCallback, useEffect, useMemo} from 'react';
import {
  useFocusEffect,
  useNavigation,
  type CompositeNavigationProp,
} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {useAllOrdersQuery} from '../../../hooks/useOrdersQuery';
import type {OrderStatus} from '../../../storage/orderStorage';
import type {
  KitchenTabParamList,
  RootStackParamList,
} from '../../../types/navigation';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<KitchenTabParamList, 'KitchenHistory'>,
  NativeStackNavigationProp<RootStackParamList>
>;

/** Orders kitchen already prepared / handed off. */
const KITCHEN_HISTORY: OrderStatus[] = ['On the way', 'Delivered'];

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isKitchen, user, logout} = useAuth();
  const branchId = user?.branchId ?? null;

  const {
    data: allOrders = [],
    error: ordersError,
    isPending,
    refetch,
  } = useAllOrdersQuery(isKitchen);

  useEffect(() => {
    if (!isKitchen) {
      navigation.replace('Login');
    }
  }, [isKitchen, navigation]);

  useFocusEffect(
    useCallback(() => {
      void refetch().catch(() => undefined);
    }, [refetch]),
  );

  const historyOrders = useMemo(() => {
    return allOrders
      .filter(order => {
        if (branchId && order.branchId && order.branchId !== branchId) {
          return false;
        }
        return KITCHEN_HISTORY.includes(order.status ?? 'Pending');
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt ?? b.createdAt).getTime() -
          new Date(a.updatedAt ?? a.createdAt).getTime(),
      );
  }, [allOrders, branchId]);

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

  const errorMessage = ordersError
    ? ordersError instanceof Error
      ? ordersError.message
      : "Couldn't load orders. Please try again."
    : null;

  const handleRetry = useCallback(() => {
    void refetch().catch(() => undefined);
  }, [refetch]);

  return {
    historyOrders,
    isPending,
    errorMessage,
    handleLogout,
    handleRetry,
  };
};

export default useController;
