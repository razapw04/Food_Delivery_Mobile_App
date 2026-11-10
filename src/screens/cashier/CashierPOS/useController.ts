import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import type {RouteProp} from '@react-navigation/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {CartItem} from '../../../context/CartContext';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {
  useAppendOrderItemsMutation,
  usePlaceOrderMutation,
} from '../../../hooks/useOrdersQuery';
import type {MenuItem} from '../../user/Menu/model';
import {
  getStoredOrderById,
  isOpenDineInTab,
  type OrderMode,
  type StoredOrder,
  type StoredPaymentMethod,
} from '../../../storage/orderStorage';
import type {RootStackParamList} from '../../../types/navigation';
import {formatOrderPrice} from '../../../utils/orderStatus';

type Nav = NativeStackNavigationProp<RootStackParamList, 'CashierPOS'>;
type Route = RouteProp<RootStackParamList, 'CashierPOS'>;

type PosLine = CartItem;
type PosServiceMode = Extract<OrderMode, 'pickup' | 'dine_in'>;

const TAX_PERCENT = 0;

export const parseMenuPrice = (price: string) =>
  Number(price.replace(/[^\d]/g, '')) || 0;

export {formatOrderPrice as formatPrice};

const useController = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const openOrderId = route.params?.openOrderId;
  const {isCashier, user} = useAuth();
  const {menuCategories, menuItems, branches} = useCatalog();
  const {mutateAsync: placeOrder} = usePlaceOrderMutation();
  const {mutateAsync: appendItems} = useAppendOrderItemsMutation();

  const branchId = user?.branchId ?? null;
  const branch = branches.find(item => item.id === branchId);

  const [categoryId, setCategoryId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<PosLine[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [waiterName, setWaiterName] = useState(user?.name ?? '');
  const [serviceMode, setServiceMode] = useState<PosServiceMode>('dine_in');
  const [paymentMethod, setPaymentMethod] =
    useState<StoredPaymentMethod>('cod');
  const [placing, setPlacing] = useState(false);
  const [slipOrder, setSlipOrder] = useState<StoredOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    if (!openOrderId && user?.name && !waiterName.trim()) {
      setWaiterName(user.name);
    }
  }, [openOrderId, user?.name, waiterName]);

  useEffect(() => {
    if (!isCashier) {
      navigation.replace('Login');
    }
  }, [isCashier, navigation]);

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      if (!openOrderId) {
        setEditingOrder(null);
        return;
      }
      const existing = await getStoredOrderById(openOrderId);
      if (cancelled) {
        return;
      }
      if (!existing || !isOpenDineInTab(existing)) {
        Alert.alert(
          'Tab unavailable',
          'This dine-in tab is closed or missing.',
          [{text: 'OK', onPress: () => navigation.goBack()}],
        );
        return;
      }
      setEditingOrder(existing);
      setCustomerName(existing.customerName);
      setTableNo(existing.tableNo ?? '');
      setWaiterName(existing.waiterName ?? user?.name ?? '');
      setServiceMode('dine_in');
      setPaymentMethod(existing.paymentMethod);
      setCart([]);
    };
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [navigation, openOrderId, user?.name]);

  const categories = useMemo(
    () => [{id: 'all', name: 'All'}, ...menuCategories],
    [menuCategories],
  );

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return menuItems.filter(item => {
      if (categoryId !== 'all' && item.categoryId !== categoryId) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [categoryId, menuItems, search]);

  const productTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart],
  );
  const taxAmount = Math.round((productTotal * TAX_PERCENT) / 100);
  const totalAmount = productTotal + taxAmount;
  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const addProduct = useCallback((product: MenuItem) => {
    const unitPrice = parseMenuPrice(product.price);
    if (unitPrice <= 0) {
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? {...item, quantity: item.quantity + 1}
            : item,
        );
      }
      const next: PosLine = {
        id: `pos-${product.id}`,
        productId: product.id,
        name: product.name,
        image: product.image,
        variation: 'Standard',
        toppings: [],
        unitPrice,
        quantity: 1,
      };
      return [...prev, next];
    });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setCart(prev => {
      if (quantity <= 0) {
        return prev.filter(item => item.id !== lineId);
      }
      return prev.map(item =>
        item.id === lineId ? {...item, quantity} : item,
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    if (!isCashier || !user?.email) {
      Alert.alert('Not signed in', 'Please log in as cashier again.');
      return;
    }
    if (!branchId) {
      Alert.alert(
        'No branch',
        'This cashier account has no branch assigned. Ask super admin to assign one.',
      );
      return;
    }
    if (cart.length === 0) {
      Alert.alert('Empty cart', 'Add at least one item before placing an order.');
      return;
    }

    const trimmedTable = tableNo.trim();
    const trimmedWaiter = waiterName.trim();
    const isDineIn = serviceMode === 'dine_in' || Boolean(editingOrder);

    if (isDineIn && !trimmedTable) {
      Alert.alert('Table required', 'Enter the table number / ID for this dine-in order.');
      return;
    }
    if (!trimmedWaiter) {
      Alert.alert('Waiter required', 'Enter the waiter name taking this order.');
      return;
    }

    setPlacing(true);
    try {
      if (editingOrder) {
        const saved = await appendItems({
          orderId: editingOrder.id,
          items: cart,
        });
        setCart([]);
        setSlipOrder(saved);
        setEditingOrder(saved);
        return;
      }

      const name = customerName.trim() || 'Walk-in Customer';
      const phone = customerPhone.trim();
      const walkInEmail = `pos+${branchId}@foodapp.local`;
      const dineIn = serviceMode === 'dine_in';

      const saved = await placeOrder({
        userEmail: walkInEmail,
        order: {
          customerEmail: walkInEmail,
          customerName: name,
          items: cart,
          productTotal,
          discount: 0,
          deliveryFee: 0,
          taxPercent: TAX_PERCENT,
          taxAmount,
          totalAmount,
          paymentMethod,
          deliveryAddress: branch
            ? `${branch.name} (${dineIn ? `Table ${trimmedTable}` : 'POS pickup'})`
            : dineIn
              ? `Table ${trimmedTable}`
              : 'POS counter',
          deliveryInstructions: [
            `POS ${dineIn ? 'dine-in' : 'pickup'}`,
            dineIn ? `Table ${trimmedTable}` : null,
            `Waiter: ${trimmedWaiter}`,
            phone ? `Phone: ${phone}` : null,
          ]
            .filter(Boolean)
            .join(' · '),
          orderMode: serviceMode,
          branchId,
          orderChannel: 'pos',
          tabOpen: dineIn,
          tableNo: dineIn ? trimmedTable : trimmedTable || null,
          waiterName: trimmedWaiter,
          status: 'Confirmed',
        },
      });

      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setTableNo('');
      setWaiterName(user?.name ?? '');
      setPaymentMethod('cod');
      setSlipOrder(saved);
    } catch (error) {
      Alert.alert(
        'Order failed',
        error instanceof Error
          ? error.message
          : "Couldn't create the POS order. Please try again.",
      );
    } finally {
      setPlacing(false);
    }
  }, [
    appendItems,
    branch,
    branchId,
    cart,
    customerName,
    customerPhone,
    editingOrder,
    isCashier,
    paymentMethod,
    placeOrder,
    productTotal,
    serviceMode,
    tableNo,
    taxAmount,
    totalAmount,
    user?.email,
    user?.name,
    waiterName,
  ]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const closeSlip = useCallback(() => {
    setSlipOrder(null);
    if (editingOrder || openOrderId) {
      navigation.navigate('CashierOrders');
    }
  }, [editingOrder, navigation, openOrderId]);

  return {
    branch,
    editingOrder,
    categories,
    categoryId,
    setCategoryId,
    search,
    setSearch,
    filteredItems,
    cart,
    itemCount,
    productTotal,
    totalAmount,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    tableNo,
    setTableNo,
    waiterName,
    setWaiterName,
    serviceMode,
    setServiceMode,
    paymentMethod,
    setPaymentMethod,
    placing,
    slipOrder,
    addProduct,
    updateQuantity,
    clearCart,
    handlePlaceOrder,
    handleBack,
    closeSlip,
  };
};

export default useController;
