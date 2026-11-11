import {useEffect, useMemo, useState} from 'react';
import {
  useNavigation,
  type CompositeNavigationProp,
} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RevenuePeriod} from '../../../components/ChannelRevenueCards';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {useAllOrdersQuery} from '../../../hooks/useOrdersQuery';
import type {
  AdminTabParamList,
  RootStackParamList,
} from '../../../types/navigation';
import {
  buildChannelRevenueBreakdown,
  getPresetRange,
  sumSalesInRange,
} from '../../../utils/revenueFromOrders';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<AdminTabParamList, 'AdminLiveSales'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endExclusiveOfDay = (date: Date) => {
  const next = startOfDay(date);
  next.setDate(next.getDate() + 1);
  return next;
};

const formatDayLabel = (date: Date) =>
  date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isAdmin, isSuperAdmin, canViewRevenue, user} = useAuth();
  const {branches} = useCatalog();
  const [selectedBranchId, setSelectedBranchId] = useState('all');
  const [period, setPeriod] = useState<RevenuePeriod>('today');
  const initialNow = new Date();
  const [customStartDate, setCustomStartDate] = useState(() =>
    startOfDay(initialNow),
  );
  const [customEndDate, setCustomEndDate] = useState(() =>
    startOfDay(initialNow),
  );
  const {data: allOrders = []} = useAllOrdersQuery(canViewRevenue);

  useEffect(() => {
    if (!isAdmin) {
      navigation.replace('Login');
      return;
    }
    if (!canViewRevenue) {
      navigation.navigate('AdminTabs', {
        screen: isSuperAdmin ? 'AdminBranches' : 'AdminOrders',
      });
    }
  }, [canViewRevenue, isAdmin, isSuperAdmin, navigation]);

  const customRange = useMemo(() => {
    const start = startOfDay(customStartDate);
    const endDay = startOfDay(customEndDate);
    const orderedStart = start.getTime() <= endDay.getTime() ? start : endDay;
    const orderedEnd = start.getTime() <= endDay.getTime() ? endDay : start;
    return {
      startMs: orderedStart.getTime(),
      endMs: endExclusiveOfDay(orderedEnd).getTime(),
    };
  }, [customEndDate, customStartDate]);

  const activeRange = useMemo(() => {
    if (period === 'custom') {
      return customRange;
    }
    return getPresetRange(period);
  }, [customRange, period]);

  const customLabel = useMemo(() => {
    const start = startOfDay(customStartDate);
    const end = startOfDay(customEndDate);
    const orderedStart = start.getTime() <= end.getTime() ? start : end;
    const orderedEnd = start.getTime() <= end.getTime() ? end : start;
    if (orderedStart.getTime() === orderedEnd.getTime()) {
      return formatDayLabel(orderedStart);
    }
    return `${formatDayLabel(orderedStart)} – ${formatDayLabel(orderedEnd)}`;
  }, [customEndDate, customStartDate]);

  const activeBranchId = isSuperAdmin
    ? selectedBranchId === 'all'
      ? null
      : selectedBranchId
    : (user?.branchId ?? null);

  const channelBreakdown = useMemo(
    () =>
      buildChannelRevenueBreakdown(allOrders, {
        branchId: activeBranchId,
        customRange: period === 'custom' ? customRange : null,
      }),
    [activeBranchId, allOrders, customRange, period],
  );

  const liveRangeSales = useMemo(
    () =>
      sumSalesInRange(allOrders, {
        branchId: activeBranchId,
        range: activeRange,
      }),
    [activeBranchId, activeRange, allOrders],
  );

  const selectCustomRange = (start: Date, end: Date) => {
    setCustomStartDate(startOfDay(start));
    setCustomEndDate(startOfDay(end));
    setPeriod('custom');
  };

  const scopeLabel = isSuperAdmin
    ? selectedBranchId === 'all'
      ? 'All branches'
      : (branches.find(item => item.id === selectedBranchId)?.name ??
        'Selected branch')
    : (branches.find(item => item.id === user?.branchId)?.name ??
      'Your branch');

  return {
    isSuperAdmin,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    period,
    setPeriod,
    customLabel,
    customStartDate,
    customEndDate,
    selectCustomRange,
    channelBreakdown,
    liveRangeSales,
    scopeLabel,
  };
};

export default useController;
