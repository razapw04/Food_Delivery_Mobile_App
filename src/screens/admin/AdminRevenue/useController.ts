import {useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {useAllOrdersQuery} from '../../../hooks/useOrdersQuery';
import type {RootStackParamList} from '../../../types/navigation';
import {buildChannelRevenueBreakdown} from '../../../utils/revenueFromOrders';
import {
  aggregateRevenue,
  BRANCH_REVENUE,
  type BranchRevenueSnapshot,
} from './mockData';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminRevenue'>;

export const formatPrice = (value: number) =>
  `Rs. ${value.toLocaleString('en-PK')}`;

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isAdmin, isSuperAdmin, canViewRevenue, user} = useAuth();
  const {branches} = useCatalog();
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const {data: allOrders = []} = useAllOrdersQuery(canViewRevenue);

  useEffect(() => {
    if (!isAdmin) {
      navigation.replace('Login');
      return;
    }
    if (!canViewRevenue) {
      navigation.replace('AdminOrders');
    }
  }, [canViewRevenue, isAdmin, navigation]);

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
    adminBranchId != null ? BRANCH_REVENUE[adminBranchId] : null;

  const superSnapshot =
    selectedBranchId === 'all'
      ? allSnapshot
      : (BRANCH_REVENUE[selectedBranchId] ?? allSnapshot);

  const superTitle =
    selectedBranchId === 'all'
      ? 'All branches'
      : (branches.find(item => item.id === selectedBranchId)?.name ??
        'Selected branch');

  const channelBreakdown = useMemo(() => {
    if (isSuperAdmin) {
      return buildChannelRevenueBreakdown(allOrders, {
        branchId: selectedBranchId === 'all' ? null : selectedBranchId,
      });
    }
    return buildChannelRevenueBreakdown(allOrders, {branchId: adminBranchId});
  }, [adminBranchId, allOrders, isSuperAdmin, selectedBranchId]);

  const handleBack = () => {
    navigation.goBack();
  };

  return {
    isSuperAdmin,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    adminBranch,
    adminSnapshot,
    superSnapshot,
    superTitle,
    channelBreakdown,
    handleBack,
  };
};

export default useController;
