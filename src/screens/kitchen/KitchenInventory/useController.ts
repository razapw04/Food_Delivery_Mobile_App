import {useCallback, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  type CompositeNavigationProp,
} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {
  listBranchInventory,
  recordInventoryUsage,
  scanBranchLowStockAlerts,
  type InventoryItem,
} from '../../../storage/inventoryStorage';
import {
  createInventoryRequest,
  listInventoryRequests,
  type InventoryRequest,
} from '../../../storage/inventoryRequestsStorage';
import type {
  KitchenTabParamList,
  RootStackParamList,
} from '../../../types/navigation';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<KitchenTabParamList, 'KitchenInventory'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type InventoryTab = 'stock' | 'requests';

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isKitchen, user, logout} = useAuth();
  const {branches} = useCatalog();
  const branchId = user?.branchId ?? null;
  const branchName =
    branches.find(item => item.id === branchId)?.name ?? 'My branch';

  const [tab, setTab] = useState<InventoryTab>('stock');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [requests, setRequests] = useState<InventoryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [qtyInput, setQtyInput] = useState('10');
  const [noteInput, setNoteInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!branchId) {
      setItems([]);
      setRequests([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      await scanBranchLowStockAlerts(branchId);
      const [stock, reqs] = await Promise.all([
        listBranchInventory(branchId),
        listInventoryRequests({branchId}),
      ]);
      setItems(stock);
      setRequests(reqs);
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useFocusEffect(
    useCallback(() => {
      if (!isKitchen) {
        navigation.replace('Login');
        return;
      }
      void load();
    }, [isKitchen, load, navigation]),
  );

  const openRequest = useCallback((item: InventoryItem) => {
    setSelectedItem(item);
    setQtyInput('10');
    setNoteInput('');
  }, []);

  const useStock = useCallback(
    (item: InventoryItem, usedQuantity: number) => {
      if (!branchId) {
        return;
      }
      void (async () => {
        const result = await recordInventoryUsage({
          branchId,
          itemId: item.id,
          usedQuantity,
        });
        if (!result.ok) {
          Alert.alert('Update failed', result.error);
          return;
        }
        const left = result.item.quantity;
        if (left <= item.lowStockAt) {
          Alert.alert(
            'Stock updated',
            `${item.name} is now low (${left} ${item.unit}). Manager and kitchen were notified.`,
          );
        }
        await load();
      })();
    },
    [branchId, load],
  );

  const confirmUseStock = useCallback(
    (item: InventoryItem) => {
      Alert.alert(
        'Use stock',
        `Record usage for ${item.name} (in stock: ${item.quantity} ${item.unit}).`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: `Use 1 ${item.unit}`,
            onPress: () => useStock(item, 1),
          },
          {
            text: `Use 5 ${item.unit}`,
            onPress: () => useStock(item, 5),
          },
        ],
      );
    },
    [useStock],
  );

  const closeRequest = useCallback(() => {
    setSelectedItem(null);
    setQtyInput('10');
    setNoteInput('');
  }, []);

  const submitRequest = useCallback(async () => {
    if (!selectedItem || !branchId || !user) {
      return;
    }
    const qty = Number(qtyInput);
    if (!Number.isFinite(qty) || qty <= 0) {
      Alert.alert('Invalid quantity', 'Enter a quantity greater than 0.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await createInventoryRequest({
        branchId,
        branchName,
        inventoryItemId: selectedItem.id,
        itemName: selectedItem.name,
        unit: selectedItem.unit,
        currentQuantity: selectedItem.quantity,
        lowStockAt: selectedItem.lowStockAt,
        requestedQuantity: qty,
        note: noteInput,
        requestedByEmail: user.email,
        requestedByName: user.name,
      });
      if (!result.ok) {
        Alert.alert('Request failed', result.error);
        return;
      }
      Alert.alert(
        'Request sent',
        'Your inventory request was sent to the branch manager.',
      );
      closeRequest();
      await load();
      setTab('requests');
    } finally {
      setSubmitting(false);
    }
  }, [
    branchId,
    branchName,
    closeRequest,
    load,
    noteInput,
    qtyInput,
    selectedItem,
    user,
  ]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  }, [logout, navigation]);

  const pendingCount = useMemo(
    () => requests.filter(item => item.status === 'pending').length,
    [requests],
  );

  return {
    branchId,
    branchName,
    tab,
    setTab,
    items,
    requests,
    loading,
    load,
    selectedItem,
    qtyInput,
    setQtyInput,
    noteInput,
    setNoteInput,
    submitting,
    openRequest,
    closeRequest,
    submitRequest,
    confirmUseStock,
    handleLogout,
    pendingCount,
  };
};

export default useController;
