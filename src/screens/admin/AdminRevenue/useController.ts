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
  buildHotSellingProducts,
  buildLeastSellingProducts,
  buildRangeTrend,
  buildTopSellingByBranch,
  buildTopSellingProducts,
  getPresetRange,
  sumSalesInRange,
} from '../../../utils/revenueFromOrders';
import {
  aggregateRevenue,
  BRANCH_REVENUE,
  type BranchRevenueSnapshot,
} from './mockData';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<AdminTabParamList, 'AdminRevenue'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const formatPrice = (value: number) =>
  `Rs. ${value.toLocaleString('en-PK')}`;

export type {RevenuePeriod};

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
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
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
    const orderedEnd =
      start.getTime() <= endDay.getTime() ? endDay : start;
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

  const branchSnapshots = useMemo(() => {
    const fromCatalog = branches
      .map(branch => BRANCH_REVENUE[branch.id])
      .filter((item): item is BranchRevenueSnapshot => item != null);

    return fromCatalog.length > 0
      ? fromCatalog
      : Object.values(BRANCH_REVENUE);
  }, [branches]);

  const allSnapshot = useMemo(
    () => aggregateRevenue(branchSnapshots),
    [branchSnapshots],
  );

  const adminBranchId = user?.branchId ?? null;
  const adminBranch = branches.find(item => item.id === adminBranchId);
  const adminSnapshot =
    adminBranchId != null
      ? (BRANCH_REVENUE[adminBranchId] ?? allSnapshot)
      : null;

  const superSnapshot =
    selectedBranchId === 'all'
      ? allSnapshot
      : (BRANCH_REVENUE[selectedBranchId] ?? allSnapshot);

  const superTitle =
    selectedBranchId === 'all'
      ? 'All branches'
      : (branches.find(item => item.id === selectedBranchId)?.name ??
        'Selected branch');

  const activeBranchId = isSuperAdmin
    ? selectedBranchId === 'all'
      ? null
      : selectedBranchId
    : adminBranchId;

  const channelBreakdown = useMemo(
    () =>
      buildChannelRevenueBreakdown(allOrders, {
        branchId: activeBranchId,
        customRange: period === 'custom' ? customRange : null,
      }),
    [activeBranchId, allOrders, customRange, period],
  );

  const activeSnapshot = isSuperAdmin ? superSnapshot : adminSnapshot;

  const liveRangeSales = useMemo(
    () =>
      sumSalesInRange(allOrders, {
        branchId: activeBranchId,
        range: activeRange,
      }),
    [activeBranchId, activeRange, allOrders],
  );

  /** Graphs use live order buckets; fallback to snapshot weekly trend. */
  const chartTrend = useMemo(() => {
    const live = buildRangeTrend(allOrders, activeRange, {
      branchId: activeBranchId,
    });
    const hasLiveIncome = live.points.some(point => point.income > 0);
    if (hasLiveIncome || !activeSnapshot) {
      return live;
    }

    return {
      points: activeSnapshot.weeklyTrend.map(point => ({
        label: point.label,
        income: point.income,
        expense: point.expense,
      })),
      isHourly: false,
      subtitle:
        period === 'today'
          ? 'Sample weekly pattern'
          : period === 'week'
            ? 'This week · branch pattern'
            : period === 'month'
              ? 'This month · weekly pattern'
              : period === 'year'
                ? 'Year view · weekly pattern'
                : 'Filtered range · weekly pattern',
    };
  }, [activeBranchId, activeRange, activeSnapshot, allOrders, period]);

  /** Split chart totals stay on snapshot finance (separate from hero live mix). */
  const chartTotals = useMemo(() => {
    if (!activeSnapshot) {
      return {income: 0, expense: 0, hideExpense: true};
    }
    if (period === 'today') {
      return {
        income: activeSnapshot.today,
        expense: activeSnapshot.expenseToday,
        hideExpense: false,
      };
    }
    if (period === 'week') {
      return {
        income: activeSnapshot.week,
        expense: activeSnapshot.expenseWeek,
        hideExpense: false,
      };
    }
    if (period === 'month') {
      return {
        income: activeSnapshot.month,
        expense: activeSnapshot.expenseMonth,
        hideExpense: false,
      };
    }
    // Year / custom: prefer live income; else snapshot week for split chart.
    if (liveRangeSales.income > 0) {
      return {
        income: liveRangeSales.income,
        expense: 0,
        hideExpense: true,
      };
    }
    return {
      income: activeSnapshot.week,
      expense: activeSnapshot.expenseWeek,
      hideExpense: false,
    };
  }, [activeSnapshot, liveRangeSales.income, period]);

  /** Top sellers for current hero branch scope. */
  const topProductsOverall = useMemo(() => {
    const live = buildTopSellingProducts(allOrders, {
      branchId: activeBranchId,
      limit: 5,
      range: activeRange,
    });
    if (live.length > 0) {
      return live;
    }
    return (activeSnapshot?.topProducts ?? []).map((item, index) => ({
      id: `snapshot-top-${activeSnapshot?.branchId ?? 'all'}-${index}`,
      name: item.name,
      units: item.units,
      revenue: 0,
    }));
  }, [activeBranchId, activeRange, activeSnapshot, allOrders]);

  /** All-branches overall list (ignores hero branch). */
  const topProductsAllBranches = useMemo(() => {
    const live = buildTopSellingProducts(allOrders, {
      branchId: null,
      limit: 5,
      range: activeRange,
    });
    if (live.length > 0) {
      return live;
    }
    return (allSnapshot.topProducts ?? []).map((item, index) => ({
      id: `snapshot-top-all-${index}`,
      name: item.name,
      units: item.units,
      revenue: 0,
    }));
  }, [activeRange, allOrders, allSnapshot]);

  /** Per-branch lists for super admin filter + dedicated screen. */
  const topProductsByBranch = useMemo(() => {
    if (!isSuperAdmin) {
      return [];
    }
    const nameById = new Map(branches.map(item => [item.id, item.name]));
    const live = buildTopSellingByBranch(
      allOrders,
      branches.map(item => item.id),
      {limit: 5, range: activeRange},
    ).map(item => ({
      ...item,
      branchName: nameById.get(item.branchId) ?? item.branchId,
    }));
    if (live.some(item => item.products.length > 0)) {
      return live;
    }
    return branchSnapshots.map(snapshot => ({
      branchId: snapshot.branchId,
      branchName: nameById.get(snapshot.branchId) ?? snapshot.branchId,
      products: snapshot.topProducts.map((item, index) => ({
        id: `snapshot-top-${snapshot.branchId}-${index}`,
        name: item.name,
        units: item.units,
        revenue: 0,
      })),
    }));
  }, [activeRange, allOrders, branchSnapshots, branches, isSuperAdmin]);

  const leastProductsOverall = useMemo(() => {
    const live = buildLeastSellingProducts(allOrders, {
      branchId: activeBranchId,
      limit: 5,
      range: activeRange,
    });
    if (live.length > 0) {
      return live;
    }
    return (activeSnapshot?.leastProducts ?? []).map((item, index) => ({
      id: `snapshot-least-${activeSnapshot?.branchId ?? 'all'}-${index}`,
      name: item.name,
      units: item.units,
      revenue: 0,
    }));
  }, [activeBranchId, activeRange, activeSnapshot, allOrders]);

  const hotProductsOverall = useMemo(() => {
    const live = buildHotSellingProducts(allOrders, {
      branchId: activeBranchId,
      limit: 5,
      range: activeRange,
    });
    if (live.length > 0) {
      return live;
    }
    return (activeSnapshot?.hotProducts ?? []).map((item, index) => ({
      id: `snapshot-hot-${activeSnapshot?.branchId ?? 'all'}-${index}`,
      name: item.name,
      units: item.units,
      revenue: 0,
    }));
  }, [activeBranchId, activeRange, activeSnapshot, allOrders]);

  const leastProductsAllBranches = useMemo(() => {
    const live = buildLeastSellingProducts(allOrders, {
      branchId: null,
      limit: 5,
      range: activeRange,
    });
    if (live.length > 0) {
      return live;
    }
    return (allSnapshot.leastProducts ?? []).map((item, index) => ({
      id: `snapshot-least-all-${index}`,
      name: item.name,
      units: item.units,
      revenue: 0,
    }));
  }, [activeRange, allOrders, allSnapshot]);

  const hotProductsAllBranches = useMemo(() => {
    const live = buildHotSellingProducts(allOrders, {
      branchId: null,
      limit: 5,
      range: activeRange,
    });
    if (live.length > 0) {
      return live;
    }
    return (allSnapshot.hotProducts ?? []).map((item, index) => ({
      id: `snapshot-hot-all-${index}`,
      name: item.name,
      units: item.units,
      revenue: 0,
    }));
  }, [activeRange, allOrders, allSnapshot]);

  const leastProductsByBranch = useMemo(() => {
    const map = new Map<string, ReturnType<typeof buildLeastSellingProducts>>();
    branches.forEach(branch => {
      const live = buildLeastSellingProducts(allOrders, {
        branchId: branch.id,
        limit: 5,
        range: activeRange,
      });
      if (live.length > 0) {
        map.set(branch.id, live);
        return;
      }
      const snapshot = BRANCH_REVENUE[branch.id];
      map.set(
        branch.id,
        (snapshot?.leastProducts ?? []).map((item, index) => ({
          id: `snapshot-least-${branch.id}-${index}`,
          name: item.name,
          units: item.units,
          revenue: 0,
        })),
      );
    });
    return map;
  }, [activeRange, allOrders, branches]);

  const hotProductsByBranch = useMemo(() => {
    const map = new Map<string, ReturnType<typeof buildHotSellingProducts>>();
    branches.forEach(branch => {
      const live = buildHotSellingProducts(allOrders, {
        branchId: branch.id,
        limit: 5,
        range: activeRange,
      });
      if (live.length > 0) {
        map.set(branch.id, live);
        return;
      }
      const snapshot = BRANCH_REVENUE[branch.id];
      map.set(
        branch.id,
        (snapshot?.hotProducts ?? []).map((item, index) => ({
          id: `snapshot-hot-${branch.id}-${index}`,
          name: item.name,
          units: item.units,
          revenue: 0,
        })),
      );
    });
    return map;
  }, [activeRange, allOrders, branches]);

  const periodMetrics = useMemo(() => {
    if (!activeSnapshot) {
      return null;
    }

    const snapshotIncome =
      period === 'week'
        ? activeSnapshot.week
        : period === 'month'
          ? activeSnapshot.month
          : period === 'today'
            ? activeSnapshot.today
            : 0;

    const expense =
      period === 'week'
        ? activeSnapshot.expenseWeek
        : period === 'month'
          ? activeSnapshot.expenseMonth
          : period === 'today'
            ? activeSnapshot.expenseToday
            : 0;

    const hideExpense = period === 'custom' || period === 'year';
    const label =
      period === 'custom'
        ? customLabel
        : period === 'week'
          ? 'This week'
          : period === 'month'
            ? 'This month'
            : period === 'year'
              ? 'This year'
              : 'Today';

    // Live sales when present; otherwise snapshot so default can show profit.
    const income = hideExpense
      ? liveRangeSales.income
      : liveRangeSales.income > 0
        ? liveRangeSales.income
        : snapshotIncome;

    const orders =
      liveRangeSales.orderCount > 0
        ? liveRangeSales.orderCount
        : period === 'today'
          ? activeSnapshot.ordersToday
          : liveRangeSales.orderCount;

    const safeExpense = hideExpense ? 0 : expense;
    const net = income - safeExpense;

    return {
      income,
      expense: safeExpense,
      net,
      orders,
      label,
      hideExpense,
    };
  }, [activeSnapshot, customLabel, liveRangeSales, period]);

  const selectCustomRange = (start: Date, end: Date) => {
    setCustomStartDate(startOfDay(start));
    setCustomEndDate(startOfDay(end));
    setPeriod('custom');
  };

  const handleBack = () => {
    navigation.navigate('AdminTabs', {
      screen: isSuperAdmin ? 'AdminBranches' : 'AdminOrders',
    });
  };

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
    periodMetrics,
    adminBranch,
    adminSnapshot,
    superSnapshot,
    superTitle,
    channelBreakdown,
    topProductsOverall,
    topProductsAllBranches,
    topProductsByBranch,
    leastProductsOverall,
    hotProductsOverall,
    leastProductsAllBranches,
    hotProductsAllBranches,
    leastProductsByBranch,
    hotProductsByBranch,
    chartTrend,
    chartTotals,
    handleBack,
  };
};

export default useController;
