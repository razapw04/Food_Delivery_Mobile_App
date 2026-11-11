import {useCallback, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {
  arrangeInventoryRequestWithCash,
  listInventoryRequests,
  type InventoryRequest,
} from '../../../storage/inventoryRequestsStorage';
import type {RootStackParamList} from '../../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export type Filter = 'approved' | 'arranged' | 'all';

export const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isCashier, user} = useAuth();
  const [requests, setRequests] = useState<InventoryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('approved');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [cashDrafts, setCashDrafts] = useState<Record<string, string>>({});

  const branchId = user?.branchId ?? null;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const items = await listInventoryRequests({
        branchId,
        status: 'all',
      });
      setRequests(
        items.filter(
          item => item.status === 'approved' || item.status === 'arranged',
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useFocusEffect(
    useCallback(() => {
      if (!isCashier) {
        navigation.replace('Login');
        return;
      }
      if (!branchId) {
        Alert.alert(
          'No branch',
          'Assign this cashier to a branch to arrange inventory.',
        );
      }
      void load();
    }, [branchId, isCashier, load, navigation]),
  );

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return requests;
    }
    return requests.filter(item => item.status === filter);
  }, [filter, requests]);

  const setCashDraft = useCallback((id: string, value: string) => {
    setCashDrafts(prev => ({...prev, [id]: value}));
  }, []);

  const handleArrange = useCallback(
    (request: InventoryRequest) => {
      if (!user) {
        return;
      }
      const raw = (cashDrafts[request.id] ?? '').trim();
      const cashAmount = raw ? Number(raw) : undefined;
      if (raw && (!Number.isFinite(cashAmount) || (cashAmount ?? 0) < 0)) {
        Alert.alert('Invalid amount', 'Enter a valid cash amount, or leave blank.');
        return;
      }

      const qtyLabel = `${request.requestedQuantity} ${request.unit}`;
      Alert.alert(
        'Arrange with cash?',
        `Confirm you paid cash and arranged ${qtyLabel} of ${request.itemName}. Stock will update after this.`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Arranged',
            onPress: () => {
              void (async () => {
                setBusyId(request.id);
                try {
                  const result = await arrangeInventoryRequestWithCash({
                    requestId: request.id,
                    arrangedByEmail: user.email,
                    arrangedByName: user.name,
                    cashAmount,
                  });
                  if (!result.ok) {
                    Alert.alert('Update failed', result.error);
                    return;
                  }
                  setCashDrafts(prev => {
                    const next = {...prev};
                    delete next[request.id];
                    return next;
                  });
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
    [cashDrafts, load, user],
  );

  return {
    filtered,
    loading,
    filter,
    setFilter,
    busyId,
    cashDrafts,
    setCashDraft,
    load,
    handleArrange,
  };
};

export default useController;
