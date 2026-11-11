import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import type {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {CartItem} from '../../../context/CartContext';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {
  usePlaceOrderMutation,
  useUpdateOpenDineInTabMutation,
} from '../../../hooks/useOrdersQuery';
import type {MenuItem} from '../../user/Menu/model';
import {
  TOPPINGS,
  formatPrice as formatProductPrice,
} from '../../user/ProductDetail/useController';
import {
  getStoredOrderById,
  isOpenDineInTab,
  type OrderMode,
  type StoredOrder,
  type StoredPaymentMethod,
} from '../../../storage/orderStorage';
import type {
  CashierTabParamList,
  RootStackParamList,
} from '../../../types/navigation';
import {formatOrderPrice} from '../../../utils/orderStatus';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<CashierTabParamList, 'CashierPOS'>,
  NativeStackNavigationProp<RootStackParamList>
>;
type Route = RouteProp<CashierTabParamList, 'CashierPOS'>;

type PosLine = CartItem;
type PosServiceMode = Extract<OrderMode, 'pickup' | 'dine_in'>;
type VariationKey = 'regular' | 'large';

const TAX_PERCENT = 0;

export const parseMenuPrice = (price: string) =>
  Number(price.replace(/[^\d]/g, '')) || 0;

export {formatOrderPrice as formatPrice};

const buildPosLineId = (
  productId: string,
  variation: string,
  toppings: string[],
) =>
  `pos-${productId}-${variation}-${[...toppings].sort().join('|')}`;

const buildVariations = (basePrice: number) => {
  const largeValue = Math.round(basePrice * 1.35);
  return [
    {
      key: 'regular' as const,
      label: 'Regular',
      price: formatProductPrice(basePrice),
      value: basePrice,
    },
    {
      key: 'large' as const,
      label: 'Large',
      price: formatProductPrice(largeValue),
      value: largeValue,
    },
  ];
};

const useController = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const openOrderId = route.params?.openOrderId;
  const {isCashier, user} = useAuth();
  const {menuCategories, menuItems, branches, refreshCatalog} = useCatalog();
  const {mutateAsync: placeOrder} = usePlaceOrderMutation();
  const {mutateAsync: updateOpenTab} = useUpdateOpenDineInTabMutation();

  const branchId = user?.branchId ?? null;
  const branch = branches.find(item => item.id === branchId);

  useFocusEffect(
    useCallback(() => {
      void refreshCatalog();
    }, [refreshCatalog]),
  );

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
  const [pendingProduct, setPendingProduct] = useState<MenuItem | null>(null);
  const [selectedVariation, setSelectedVariation] =
    useState<VariationKey | null>(null);
  const [selectedToppingIds, setSelectedToppingIds] = useState<string[]>([]);
  const [pickerQuantity, setPickerQuantity] = useState(1);

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
      // Load current ticket so cashier can edit this guest until bill is paid.
      setCart((existing.items ?? []).map(item => ({...item})));
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

  const cartQtyByProductId = useMemo(() => {
    const map: Record<string, number> = {};
    cart.forEach(item => {
      map[item.productId] = (map[item.productId] ?? 0) + item.quantity;
    });
    return map;
  }, [cart]);

  const pendingVariations = useMemo(() => {
    if (!pendingProduct) {
      return [];
    }
    return buildVariations(parseMenuPrice(pendingProduct.price));
  }, [pendingProduct]);

  const selectedVariationOption =
    pendingVariations.find(option => option.key === selectedVariation) ?? null;

  const toppingsTotal = TOPPINGS.filter(topping =>
    selectedToppingIds.includes(topping.id),
  ).reduce((sum, topping) => sum + topping.price, 0);

  const pickerUnitPrice =
    (selectedVariationOption?.value ?? 0) + toppingsTotal;
  const pickerTotalPrice = pickerUnitPrice * pickerQuantity;

  const openProductPicker = useCallback((product: MenuItem) => {
    const unitPrice = parseMenuPrice(product.price);
    if (unitPrice <= 0) {
      return;
    }
    setPendingProduct(product);
    setSelectedVariation(null);
    setSelectedToppingIds([]);
    setPickerQuantity(1);
  }, []);

  const closeProductPicker = useCallback(() => {
    setPendingProduct(null);
    setSelectedVariation(null);
    setSelectedToppingIds([]);
    setPickerQuantity(1);
  }, []);

  const selectVariation = useCallback((key: VariationKey) => {
    setSelectedVariation(key);
    setSelectedToppingIds([]);
  }, []);

  const toggleTopping = useCallback((id: string) => {
    setSelectedToppingIds(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id],
    );
  }, []);

  const decreasePickerQuantity = useCallback(() => {
    setPickerQuantity(prev => Math.max(1, prev - 1));
  }, []);

  const increasePickerQuantity = useCallback(() => {
    setPickerQuantity(prev => prev + 1);
  }, []);

  const confirmProductPicker = useCallback(() => {
    if (!pendingProduct || !selectedVariationOption) {
      Alert.alert('Select variation', 'Choose Regular or Large first.');
      return;
    }

    const selectedToppings = TOPPINGS.filter(topping =>
      selectedToppingIds.includes(topping.id),
    ).map(topping => topping.name);
    const lineId = buildPosLineId(
      pendingProduct.id,
      selectedVariationOption.label,
      selectedToppings,
    );

    setCart(prev => {
      const existing = prev.find(item => item.id === lineId);
      if (existing) {
        return prev.map(item =>
          item.id === lineId
            ? {...item, quantity: item.quantity + pickerQuantity}
            : item,
        );
      }
      const next: PosLine = {
        id: lineId,
        productId: pendingProduct.id,
        name: pendingProduct.name,
        image: pendingProduct.image,
        variation: selectedVariationOption.label,
        toppings: selectedToppings,
        unitPrice: pickerUnitPrice,
        quantity: pickerQuantity,
      };
      return [...prev, next];
    });

    closeProductPicker();
  }, [
    closeProductPicker,
    pendingProduct,
    pickerQuantity,
    pickerUnitPrice,
    selectedToppingIds,
    selectedVariationOption,
  ]);

  const addProduct = openProductPicker;

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
        const saved = await updateOpenTab({
          orderId: editingOrder.id,
          patch: {
            items: cart,
            customerName: customerName.trim() || editingOrder.customerName,
            tableNo: trimmedTable,
            waiterName: trimmedWaiter,
            paymentMethod,
          },
        });
        setCart((saved.items ?? []).map(item => ({...item})));
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

      setSlipOrder(saved);
      if (dineIn) {
        // Keep editing this guest until they finish & pay.
        setEditingOrder(saved);
        setCart((saved.items ?? []).map(item => ({...item})));
        setCustomerName(saved.customerName);
        setTableNo(saved.tableNo ?? trimmedTable);
        setWaiterName(saved.waiterName ?? trimmedWaiter);
        setPaymentMethod(saved.paymentMethod);
      } else {
        setCart([]);
        setCustomerName('');
        setCustomerPhone('');
        setTableNo('');
        setWaiterName(user?.name ?? '');
        setPaymentMethod('cod');
      }
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
    updateOpenTab,
    user?.email,
    user?.name,
    waiterName,
  ]);

  const handleBack = useCallback(() => {
    navigation.navigate('CashierOrders');
  }, [navigation]);

  const continueEditingFromSlip = useCallback(() => {
    if (!slipOrder || !isOpenDineInTab(slipOrder)) {
      return;
    }
    setSlipOrder(null);
    setEditingOrder(slipOrder);
    setCustomerName(slipOrder.customerName);
    setTableNo(slipOrder.tableNo ?? '');
    setWaiterName(slipOrder.waiterName ?? user?.name ?? '');
    setPaymentMethod(slipOrder.paymentMethod);
    setServiceMode('dine_in');
    setCart((slipOrder.items ?? []).map(item => ({...item})));
  }, [slipOrder, user?.name]);

  const closeSlip = useCallback(() => {
    const keepEditing =
      slipOrder != null && isOpenDineInTab(slipOrder) ? slipOrder : editingOrder;
    setSlipOrder(null);
    if (keepEditing && isOpenDineInTab(keepEditing)) {
      setEditingOrder(keepEditing);
      return;
    }
    if (openOrderId) {
      navigation.navigate('CashierOrders');
    }
  }, [editingOrder, navigation, openOrderId, slipOrder]);

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
    cartQtyByProductId,
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
    pendingProduct,
    selectedVariation,
    selectedToppingIds,
    pendingVariations,
    selectedVariationOption,
    toppings: TOPPINGS,
    pickerQuantity,
    pickerTotalPrice,
    addProduct,
    closeProductPicker,
    selectVariation,
    toggleTopping,
    decreasePickerQuantity,
    increasePickerQuantity,
    confirmProductPicker,
    updateQuantity,
    clearCart,
    handlePlaceOrder,
    handleBack,
    continueEditingFromSlip,
    closeSlip,
  };
};

export default useController;
