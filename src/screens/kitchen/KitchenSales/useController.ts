import {useEffect, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {useAllOrdersQuery} from '../../../hooks/useOrdersQuery';
import type {
  KitchenTabParamList,
  RootStackParamList,
} from '../../../types/navigation';
import {getBranchProductSalesLists} from '../../../utils/revenueFromOrders';
import {BRANCH_REVENUE} from '../../admin/AdminRevenue/mockData';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<KitchenTabParamList, 'KitchenSales'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isKitchen, user} = useAuth();
  const branchId = user?.branchId ?? null;
  const {data: allOrders = []} = useAllOrdersQuery(isKitchen);

  useEffect(() => {
    if (!isKitchen) {
      navigation.replace('Login');
    }
  }, [isKitchen, navigation]);

  const productSales = useMemo(
    () =>
      getBranchProductSalesLists(allOrders, {
        branchId,
        limit: null,
        snapshot: branchId != null ? BRANCH_REVENUE[branchId] ?? null : null,
      }),
    [allOrders, branchId],
  );

  return {
    productSales,
    branchId,
  };
};

export default useController;
