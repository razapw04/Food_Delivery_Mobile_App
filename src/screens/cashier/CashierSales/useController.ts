import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RevenuePeriod} from '../../../components/ChannelRevenueCards';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {useAllOrdersQuery} from '../../../hooks/useOrdersQuery';
import type {
  CashierTabParamList,
  RootStackParamList,
} from '../../../types/navigation';
import {
  buildChannelRevenueBreakdown,
  formatMonthLabel,
  getBranchProductSalesLists,
  getMonthRange,
  getPresetRange,
  listRecentMonths,
} from '../../../utils/revenueFromOrders';
import {BRANCH_REVENUE} from '../../admin/AdminRevenue/mockData';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<CashierTabParamList, 'CashierSales'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const formatPrice = (value: number) =>
  `Rs. ${value.toLocaleString('en-PK')}`;

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isCashier, user} = useAuth();
  const {branches} = useCatalog();
  const [period, setPeriod] = useState<RevenuePeriod>('today');
  const now = new Date();
  const [customYear, setCustomYear] = useState(now.getFullYear());
  const [customMonthIndex, setCustomMonthIndex] = useState(now.getMonth());
  const {data: allOrders = []} = useAllOrdersQuery(isCashier);

  useEffect(() => {
    if (!isCashier) {
      navigation.replace('Login');
    }
  }, [isCashier, navigation]);

  const branchId = user?.branchId ?? null;
  const branch = branches.find(item => item.id === branchId);
  const monthOptions = useMemo(() => listRecentMonths(12), []);

  const customRange = useMemo(
    () => getMonthRange(customYear, customMonthIndex),
    [customMonthIndex, customYear],
  );

  const activeRange = useMemo(() => {
    if (period === 'custom') {
      return customRange;
    }
    return getPresetRange(period);
  }, [customRange, period]);

  const customLabel = useMemo(
    () => formatMonthLabel(customYear, customMonthIndex),
    [customMonthIndex, customYear],
  );

  const channelBreakdown = useMemo(
    () =>
      buildChannelRevenueBreakdown(allOrders, {
        branchId,
        customRange: period === 'custom' ? customRange : null,
      }),
    [allOrders, branchId, customRange, period],
  );

  const productSales = useMemo(
    () =>
      getBranchProductSalesLists(allOrders, {
        branchId,
        limit: null,
        range: activeRange,
        snapshot: branchId != null ? BRANCH_REVENUE[branchId] ?? null : null,
      }),
    [activeRange, allOrders, branchId],
  );

  const selectCustomMonth = (year: number, monthIndex: number) => {
    setCustomYear(year);
    setCustomMonthIndex(monthIndex);
    setPeriod('custom');
  };

  const handleBack = useCallback(() => {
    navigation.navigate('CashierOrders');
  }, [navigation]);

  return {
    branch,
    period,
    setPeriod,
    monthOptions,
    customYear,
    customMonthIndex,
    customLabel,
    selectCustomMonth,
    channelBreakdown,
    productSales,
    handleBack,
  };
};

export default useController;
