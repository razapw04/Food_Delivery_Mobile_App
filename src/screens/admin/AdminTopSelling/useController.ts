import {useEffect, useMemo, useState} from 'react';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RevenuePeriod} from '../../../components/ChannelRevenueCards';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {useAllOrdersQuery} from '../../../hooks/useOrdersQuery';
import type {RootStackParamList} from '../../../types/navigation';
import {
  buildHotSellingProducts,
  buildLeastSellingProducts,
  buildTopSellingByBranch,
  buildTopSellingByCategory,
  buildTopSellingProducts,
  getPresetRange,
  type CategoryTopSelling,
} from '../../../utils/revenueFromOrders';
import {
  BRANCH_REVENUE,
  aggregateRevenue,
  type BranchRevenueSnapshot,
} from '../AdminRevenue/mockData';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminTopSelling'>;
type Route = RouteProp<RootStackParamList, 'AdminTopSelling'>;

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

const snapshotProducts = (
  snapshot: BranchRevenueSnapshot | null | undefined,
  keyPrefix: string,
) =>
  (snapshot?.topProducts ?? []).map((item, index) => ({
    id: `${keyPrefix}-${index}`,
    name: item.name,
    units: item.units,
    revenue: 0,
  }));

const useController = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const {isAdmin, isSuperAdmin, canViewRevenue, user} = useAuth();
  const {branches, menuCategories, menuItems} = useCatalog();
  const initialBranch = route.params?.branchId ?? 'all';
  const initialPeriod = route.params?.period ?? 'today';

  const [selectedBranchId, setSelectedBranchId] = useState(initialBranch);
  const [period, setPeriod] = useState<RevenuePeriod>(initialPeriod);
  const [viewMode, setViewMode] = useState<'overall' | 'category'>('overall');
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
  const activeBranchId = isSuperAdmin
    ? selectedBranchId === 'all'
      ? null
      : selectedBranchId
    : adminBranchId;

  const scopeLabel = isSuperAdmin
    ? selectedBranchId === 'all'
      ? 'All branches'
      : (branches.find(item => item.id === selectedBranchId)?.name ??
        'Selected branch')
    : (branches.find(item => item.id === adminBranchId)?.name ?? 'My branch');

  const activeCatalogSnapshot = useMemo(() => {
    if (isSuperAdmin && selectedBranchId === 'all') {
      return allSnapshot;
    }
    return (
      (activeBranchId != null ? BRANCH_REVENUE[activeBranchId] : null) ??
      allSnapshot
    );
  }, [activeBranchId, allSnapshot, isSuperAdmin, selectedBranchId]);

  const products = useMemo(() => {
    const live = buildTopSellingProducts(allOrders, {
      branchId: activeBranchId,
      limit: null,
      range: activeRange,
    });
    if (live.length > 0) {
      return live;
    }
    return snapshotProducts(
      activeCatalogSnapshot,
      `snapshot-most-${activeBranchId ?? 'all'}`,
    );
  }, [activeBranchId, activeCatalogSnapshot, activeRange, allOrders]);

  const leastProducts = useMemo(() => {
    const live = buildLeastSellingProducts(allOrders, {
      branchId: activeBranchId,
      limit: null,
      range: activeRange,
    });
    if (live.length > 0) {
      return live;
    }
    return (activeCatalogSnapshot.leastProducts ?? []).map((item, index) => ({
      id: `snapshot-least-${activeBranchId ?? 'all'}-${index}`,
      name: item.name,
      units: item.units,
      revenue: 0,
    }));
  }, [activeBranchId, activeCatalogSnapshot, activeRange, allOrders]);

  const hotProducts = useMemo(() => {
    const live = buildHotSellingProducts(allOrders, {
      branchId: activeBranchId,
      limit: null,
      range: activeRange,
    });
    if (live.length > 0) {
      return live;
    }
    return (activeCatalogSnapshot.hotProducts ?? []).map((item, index) => ({
      id: `snapshot-hot-${activeBranchId ?? 'all'}-${index}`,
      name: item.name,
      units: item.units,
      revenue: 0,
    }));
  }, [activeBranchId, activeCatalogSnapshot, activeRange, allOrders]);

  const productsByBranch = useMemo(() => {
    if (!isSuperAdmin || selectedBranchId !== 'all') {
      return [];
    }
    const nameById = new Map(branches.map(item => [item.id, item.name]));
    const live = buildTopSellingByBranch(
      allOrders,
      branches.map(item => item.id),
      {limit: 50, range: activeRange},
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
      products: snapshotProducts(snapshot, `snapshot-top-${snapshot.branchId}`),
    }));
  }, [
    activeRange,
    allOrders,
    branchSnapshots,
    branches,
    isSuperAdmin,
    selectedBranchId,
  ]);

  const productsByCategory = useMemo((): CategoryTopSelling[] => {
    if (!isSuperAdmin) {
      return [];
    }

    const live = buildTopSellingByCategory(
      allOrders,
      menuCategories,
      menuItems,
      {
        branchId: activeBranchId,
        limit: null,
        range: activeRange,
      },
    );
    if (live.length > 0) {
      return live;
    }

    const unitsByName = new Map(
      [
        ...(activeCatalogSnapshot.topProducts ?? []),
        ...(activeCatalogSnapshot.hotProducts ?? []),
        ...(activeCatalogSnapshot.leastProducts ?? []),
      ].map(item => [item.name.trim().toLowerCase(), item.units]),
    );

    return menuCategories
      .map(category => {
        const products = menuItems
          .filter(item => item.categoryId === category.id)
          .map((item, index) => {
            const known = unitsByName.get(item.name.trim().toLowerCase());
            const units =
              known ??
              Math.max(28 - index * 3, 2 + ((item.id.length + index) % 5));
            return {
              id: `snapshot-cat-${category.id}-${item.id}`,
              name: item.name,
              units,
              revenue: 0,
            };
          })
          .sort((a, b) => b.units - a.units);

        return {
          categoryId: category.id,
          categoryName: category.name,
          products,
        };
      })
      .filter(item => item.products.length > 0);
  }, [
    activeBranchId,
    activeCatalogSnapshot,
    activeRange,
    allOrders,
    isSuperAdmin,
    menuCategories,
    menuItems,
  ]);

  const selectCustomRange = (start: Date, end: Date) => {
    setCustomStartDate(startOfDay(start));
    setCustomEndDate(startOfDay(end));
    setPeriod('custom');
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('AdminTabs', {screen: 'AdminRevenue'});
  };

  return {
    isSuperAdmin,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    period,
    setPeriod,
    viewMode,
    setViewMode,
    customLabel,
    customStartDate,
    customEndDate,
    selectCustomRange,
    scopeLabel,
    products,
    leastProducts,
    hotProducts,
    productsByBranch,
    productsByCategory,
    handleBack,
  };
};

export default useController;
