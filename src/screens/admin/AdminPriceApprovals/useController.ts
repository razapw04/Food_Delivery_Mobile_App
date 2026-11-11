import {useCallback, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {
  formatAdminPrice,
  parseAdminPrice,
} from '../../../storage/adminProductsStorage';
import {
  listPriceChangeRequests,
  reviewPriceChangeRequest,
  type PriceChangeRequest,
  type PriceChangeStatus,
} from '../../../storage/priceChangeRequestsStorage';
import type {RootStackParamList} from '../../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminPriceApprovals'>;
export type Filter = 'pending' | 'all' | PriceChangeStatus;

export const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isSuperAdmin} = useAuth();
  const {menuItems, refreshCatalog} = useCatalog();
  const [requests, setRequests] = useState<PriceChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('pending');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [finalPrices, setFinalPrices] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listPriceChangeRequests();
      setRequests(items);
      setFinalPrices(prev => {
        const next = {...prev};
        for (const item of items) {
          if (item.status === 'pending' && next[item.id] == null) {
            next[item.id] = String(parseAdminPrice(item.requestedPrice) || '');
          }
        }
        return next;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!isSuperAdmin) {
        navigation.replace('AdminTabs', {screen: 'AdminRevenue'});
        return;
      }
      void load();
    }, [isSuperAdmin, load, navigation]),
  );

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return requests;
    }
    return requests.filter(item => item.status === filter);
  }, [filter, requests]);

  const setFinalPrice = useCallback((id: string, text: string) => {
    setFinalPrices(prev => ({...prev, [id]: text}));
  }, []);

  const handleReject = useCallback(
    (request: PriceChangeRequest) => {
      Alert.alert(
        'Reject request?',
        `${request.productName}: keep current price ${request.currentPrice}`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Reject',
            style: 'destructive',
            onPress: () => {
              void (async () => {
                setBusyId(request.id);
                try {
                  const result = await reviewPriceChangeRequest({
                    requestId: request.id,
                    decision: 'rejected',
                    seedProducts: menuItems,
                  });
                  if (!result.ok) {
                    Alert.alert('Action failed', result.error);
                    return;
                  }
                  await refreshCatalog();
                  await load();
                } finally {
                  setBusyId(null);
                }
              })();
            },
          },
        ],
      );
    },
    [load, menuItems, refreshCatalog],
  );

  const handleApprove = useCallback(
    (request: PriceChangeRequest) => {
      const amount = parseAdminPrice(finalPrices[request.id] ?? '');
      if (amount <= 0) {
        Alert.alert('Invalid price', 'Enter a final price greater than 0.');
        return;
      }

      const finalPrice = formatAdminPrice(amount);
      Alert.alert(
        'Set final price?',
        `${request.productName}\nSuggested: ${request.requestedPrice}\nYour final price: ${finalPrice}`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Approve',
            onPress: () => {
              void (async () => {
                setBusyId(request.id);
                try {
                  const result = await reviewPriceChangeRequest({
                    requestId: request.id,
                    decision: 'approved',
                    seedProducts: menuItems,
                    approvedAmount: amount,
                  });
                  if (!result.ok) {
                    Alert.alert('Action failed', result.error);
                    return;
                  }
                  await refreshCatalog();
                  await load();
                } finally {
                  setBusyId(null);
                }
              })();
            },
          },
        ],
      );
    },
    [finalPrices, load, menuItems, refreshCatalog],
  );

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('AdminTabs', {screen: 'AdminRevenue'});
  }, [navigation]);

  return {
    filtered,
    loading,
    filter,
    setFilter,
    busyId,
    finalPrices,
    setFinalPrice,
    load,
    handleReject,
    handleApprove,
    handleBack,
    formatAdminPrice,
    parseAdminPrice,
  };
};

export default useController;
