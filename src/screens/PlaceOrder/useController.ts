import {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useCart} from '../../context/CartContext';
import {useLocation} from '../../context/LocationContext';
import {useNotifications} from '../../context/NotificationsContext';
import {useOrder} from '../../context/OrderContext';
import {saveStoredOrder} from '../../storage/orderStorage';
import type {RootStackParamList} from '../../types/navigation';

type PlaceOrderNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlaceOrder'
>;

export type PaymentMethodId = 'cod' | 'card' | 'jazzcash';

export type PaymentMethodOption = {
  id: PaymentMethodId;
  label: string;
};

export type PlaceOrderModalType = 'minOrder' | 'confirm' | null;

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {id: 'cod', label: 'Cash on Delivery'},
  {id: 'card', label: 'Debit/Credit Card'},
  {id: 'jazzcash', label: 'JazzCash'},
];

const formatPrice = (value: number) => `Rs. ${value.toLocaleString('en-PK')}`;

const DELIVERY_FEE = 99;
const COD_FEE = 100;
const DISCOUNT = 0;
const MIN_ORDER_AMOUNT = 500;
const CONFIRM_DURATION_MS = 5000;

const useController = () => {
  const navigation = useNavigation<PlaceOrderNavigationProp>();
  const insets = useSafeAreaInsets();
  const {deliveryAddress, isLocating, addSavedAddress} = useLocation();
  const {orderMode, selectedBranch} = useOrder();
  const {items, cartTotal, clearCart} = useCart();
  const {addNotification} = useNotifications();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodId>('cod');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [modalType, setModalType] = useState<PlaceOrderModalType>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [confirmSeconds, setConfirmSeconds] = useState(5);

  const stickyBottomPad = Math.max(insets.bottom, 16) + 8;
  const modalTranslateY = useRef(new Animated.Value(400)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const secondsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const didProceedRef = useRef(false);

  const isPickup = orderMode === 'pickup';
  const sectionTitle = isPickup ? 'Pickup From' : 'Deliver To';

  const fullAddress = isPickup
    ? selectedBranch
      ? `${selectedBranch.name}, ${selectedBranch.address}`
      : 'Select a branch'
    : isLocating
      ? 'Detecting location...'
      : deliveryAddress;

  const deliveryFee = isPickup ? 0 : DELIVERY_FEE;
  const codFee = selectedPaymentMethod === 'cod' ? COD_FEE : 0;
  const taxPercent = selectedPaymentMethod === 'cod' ? 16 : 8;
  const taxAmount = Math.round((cartTotal * taxPercent) / 100);
  const totalAmount =
    cartTotal - DISCOUNT + deliveryFee + taxAmount + codFee;

  const orderSnapshotRef = useRef({
    items,
    cartTotal,
    deliveryFee,
    taxPercent,
    taxAmount,
    totalAmount,
    selectedPaymentMethod,
    fullAddress,
    deliveryInstructions,
    orderMode,
  });

  orderSnapshotRef.current = {
    items,
    cartTotal,
    deliveryFee,
    taxPercent,
    taxAmount,
    totalAmount,
    selectedPaymentMethod,
    fullAddress,
    deliveryInstructions,
    orderMode,
  };

  const clearConfirmTimers = useCallback(() => {
    if (confirmTimerRef.current) {
      clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = null;
    }
    if (secondsIntervalRef.current) {
      clearInterval(secondsIntervalRef.current);
      secondsIntervalRef.current = null;
    }
    progressAnimRef.current?.stop();
    progressAnimRef.current = null;
  }, []);

  const closeModal = useCallback(() => {
    clearConfirmTimers();
    Animated.timing(modalTranslateY, {
      toValue: 400,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) {
        setModalType(null);
        progressWidth.setValue(0);
        didProceedRef.current = false;
      }
    });
  }, [clearConfirmTimers, modalTranslateY, progressWidth]);

  const openModal = useCallback(
    (type: Exclude<PlaceOrderModalType, null>) => {
      setModalType(type);
      modalTranslateY.setValue(400);
      Animated.timing(modalTranslateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    [modalTranslateY],
  );

  const proceedOrder = useCallback(async () => {
    if (didProceedRef.current) {
      return;
    }
    didProceedRef.current = true;
    setIsPlacingOrder(true);
    clearConfirmTimers();

    const snapshot = orderSnapshotRef.current;

    try {
      const now = new Date();
      const id = `ord-${now.getTime()}`;
      const orderId = `#FD-${String(now.getTime()).slice(-4)}`;
      await saveStoredOrder({
        id,
        orderId,
        createdAt: now.toISOString(),
        items: snapshot.items,
        productTotal: snapshot.cartTotal,
        discount: DISCOUNT,
        deliveryFee: snapshot.deliveryFee,
        taxPercent: snapshot.taxPercent,
        taxAmount: snapshot.taxAmount,
        totalAmount: snapshot.totalAmount,
        paymentMethod: snapshot.selectedPaymentMethod,
        deliveryAddress: snapshot.fullAddress,
        deliveryInstructions: snapshot.deliveryInstructions.trim(),
        orderMode: snapshot.orderMode,
        status: 'Pending',
      });

      await addNotification({
        title: 'Order placed',
        body: `Your order ${orderId} is pending. Total ${formatPrice(
          snapshot.totalAmount,
        )}.`,
        orderId: id,
      });

      if (
        snapshot.orderMode === 'delivery' &&
        snapshot.fullAddress &&
        snapshot.fullAddress !== 'Select delivery address' &&
        snapshot.fullAddress !== 'Detecting location...'
      ) {
        addSavedAddress('Location', snapshot.fullAddress);
      }

      clearCart();
      setModalType(null);
      progressWidth.setValue(0);
      navigation.navigate('MainTabs', {screen: 'Orders'});
    } catch {
      didProceedRef.current = false;
    } finally {
      setIsPlacingOrder(false);
    }
  }, [
    clearConfirmTimers,
    clearCart,
    progressWidth,
    navigation,
    addSavedAddress,
    addNotification,
  ]);

  const proceedOrderRef = useRef(proceedOrder);
  proceedOrderRef.current = proceedOrder;

  useEffect(() => {
    if (modalType !== 'confirm') {
      return;
    }

    didProceedRef.current = false;
    progressWidth.setValue(0);
    setConfirmSeconds(5);
    clearConfirmTimers();

    const animation = Animated.timing(progressWidth, {
      toValue: 1,
      duration: CONFIRM_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    progressAnimRef.current = animation;
    animation.start();

    secondsIntervalRef.current = setInterval(() => {
      setConfirmSeconds(prev => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    confirmTimerRef.current = setTimeout(() => {
      proceedOrderRef.current();
    }, CONFIRM_DURATION_MS);

    return () => {
      clearConfirmTimers();
    };
  }, [modalType, progressWidth, clearConfirmTimers]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEditAddress = () => {
    if (isPickup) {
      navigation.navigate('Branches');
      return;
    }
    navigation.navigate('ChooseLocation');
  };

  const goToVoucher = () => {
    navigation.navigate('Voucher');
  };

  const handlePlaceOrder = () => {
    if (cartTotal < MIN_ORDER_AMOUNT) {
      openModal('minOrder');
      return;
    }
    openModal('confirm');
  };

  const handleCancelConfirm = () => {
    closeModal();
  };

  const handleProceedNow = () => {
    proceedOrder();
  };

  const handleDismissMinOrder = () => {
    closeModal();
  };

  return {
    sectionTitle,
    fullAddress,
    paymentMethods: PAYMENT_METHODS,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentAmountLabel: formatPrice(totalAmount),
    productPriceLabel: formatPrice(cartTotal),
    discountLabel: `-Rs.${DISCOUNT}`,
    deliveryFeeLabel: `+${formatPrice(deliveryFee)}`,
    taxLabel: `Tax (${taxPercent}%)`,
    taxAmountLabel: `+${formatPrice(taxAmount)}`,
    totalLabel: formatPrice(totalAmount),
    deliveryInstructions,
    setDeliveryInstructions,
    stickyBottomPad,
    modalType,
    modalTranslateY,
    progressWidth,
    confirmSeconds,
    isCashOnDelivery: selectedPaymentMethod === 'cod',
    isPlacingOrder,
    handleBack,
    handleEditAddress,
    goToVoucher,
    handlePlaceOrder,
    handleCancelConfirm,
    handleProceedNow,
    handleDismissMinOrder,
  };
};

export default useController;
