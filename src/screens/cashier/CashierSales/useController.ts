import {useEffect, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {useAllOrdersQuery} from '../../../hooks/useOrdersQuery';
import type {RootStackParamList} from '../../../types/navigation';
import {buildChannelRevenueBreakdown} from '../../../utils/revenueFromOrders';

type Nav = NativeStackNavigationProp<RootStackParamList, 'CashierSales'>;

export const formatPrice = (value: number) =>
  `Rs. ${value.toLocaleString('en-PK')}`;

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isCashier, user} = useAuth();
  const {branches} = useCatalog();
  const {data: allOrders = []} = useAllOrdersQuery(isCashier);

  useEffect(() => {
    if (!isCashier) {
      navigation.replace('Login');
    }
  }, [isCashier, navigation]);

  const branchId = user?.branchId ?? null;
  const branch = branches.find(item => item.id === branchId);

  const channelBreakdown = useMemo(
    () => buildChannelRevenueBreakdown(allOrders, {branchId}),
    [allOrders, branchId],
  );

  const handleBack = () => {
    navigation.navigate('CashierOrders');
  };

  return {
    branch,
    channelBreakdown,
    handleBack,
  };
};

export default useController;
