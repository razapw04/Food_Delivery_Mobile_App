import {useCallback, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {
  listInventoryRequests,
  reviewInventoryRequest,
  type InventoryRequest,
  type InventoryRequestStatus,
} from '../../../storage/inventoryRequestsStorage';
import type {RootStackParamList} from '../../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminInventoryRequests'>;

export type Filter = 'pending' | 'approved' | 'arranged' | 'rejected' | 'all';

export const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isAdmin, isSuperAdmin, isManager, user} = useAuth();
  const [requests, setRequests] = useState<InventoryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('pending');
  const [busyId, setBusyId] = useState<string | null>(null);

  const branchId = user?.branchId ?? null;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listInventoryRequests({
        branchId: isSuperAdmin ? null : branchId,
        status: 'all',
      });
      setRequests(items);
    } finally {
      setLoading(false);
    }
  }, [branchId, isSuperAdmin]);

  useFocusEffect(
    useCallback(() => {
      if (!isAdmin || (!isSuperAdmin && !isManager)) {
        navigation.replace('Login');
        return;
      }
      if (!isSuperAdmin && !branchId) {
        Alert.alert(
          'No branch',
          'Assign this manager to a branch to review inventory requests.',
        );
      }
      void load();
    }, [branchId, isAdmin, isManager, isSuperAdmin, load, navigation]),
  );

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return requests;
    }
    return requests.filter(item => item.status === filter);
  }, [filter, requests]);

  const handleReview = useCallback(
    (request: InventoryRequest, decision: InventoryRequestStatus) => {
      if (decision === 'pending' || !user) {
        return;
      }
      if (decision !== 'approved' && decision !== 'rejected') {
        return;
      }
      const title = decision === 'approved' ? 'Approve & send to cashier?' : 'Reject request?';
      const message =
        decision === 'approved'
          ? `Send ${request.requestedQuantity} ${request.unit} of ${request.itemName} to cashier to arrange with cash. Stock updates after cashier confirms.`
          : `Reject kitchen request for ${request.itemName}.`;

      Alert.alert(title, message, [
        {text: 'Cancel', style: 'cancel'},
        {
          text: decision === 'approved' ? 'Send to cashier' : 'Reject',
          style: decision === 'approved' ? 'default' : 'destructive',
          onPress: () => {
            void (async () => {
              setBusyId(request.id);
              try {
                const result = await reviewInventoryRequest({
                  requestId: request.id,
                  decision,
                  reviewedByEmail: user.email,
                  reviewedByName: user.name,
                });
                if (!result.ok) {
                  Alert.alert('Update failed', result.error);
                  return;
                }
                await load();
              } finally {
                setBusyId(null);
              }
            })();
          },
        },
      ]);
    },
    [load, user],
  );

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('AdminTabs', {
      screen: isSuperAdmin ? 'AdminRevenue' : 'AdminOrders',
    });
  }, [isSuperAdmin, navigation]);

  return {
    isSuperAdmin,
    filtered,
    loading,
    filter,
    setFilter,
    busyId,
    load,
    handleReview,
    handleBack,
  };
};

export default useController;
