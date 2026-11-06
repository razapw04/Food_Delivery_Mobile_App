import {useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAuth} from '../../context/AuthContext';
import {useCart} from '../../context/CartContext';
import {useLocation} from '../../context/LocationContext';
import {useNotifications} from '../../context/NotificationsContext';
import {useOrder} from '../../context/OrderContext';
import {usePlaceOrderMutation} from '../../hooks/useOrdersQuery';
import {ApiError} from '../../services/apiClient';
import type {RootStackParamList} from '../../types/navigation';

type CardPaymentNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CardPayment'
>;

type CardPaymentRouteProp = RouteProp<RootStackParamList, 'CardPayment'>;

const formatPrice = (value: number) => `Rs. ${value.toLocaleString('en-PK')}`;

const DELIVERY_FEE = 99;
const DISCOUNT = 0;
const TAX_PERCENT = 8;

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const formatCardNumber = (value: string) => {
  const digits = onlyDigits(value).slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value: string) => {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const useController = () => {
  const navigation = useNavigation<CardPaymentNavigationProp>();
  const route = useRoute<CardPaymentRouteProp>();
  const insets = useSafeAreaInsets();
  const {user} = useAuth();
  const {deliveryAddress, isLocating, addSavedAddress} = useLocation();
  const {orderMode, selectedBranch} = useOrder();
  const {items, cartTotal, clearCart} = useCart();
  const {addNotification} = useNotifications();
  const {mutateAsync: placeOrder} = usePlaceOrderMutation();

  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [touched, setTouched] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const stickyBottomPad = Math.max(insets.bottom, 16) + 8;
  const deliveryInstructions = route.params?.deliveryInstructions ?? '';

  const isPickup = orderMode === 'pickup';
  const fullAddress = isPickup
    ? selectedBranch
      ? `${selectedBranch.name}, ${selectedBranch.address}`
      : 'Select a branch'
    : isLocating
      ? 'Detecting location...'
      : deliveryAddress;

  const deliveryFee = isPickup ? 0 : DELIVERY_FEE;
  const taxAmount = Math.round((cartTotal * TAX_PERCENT) / 100);
  const computedTotal =
    cartTotal - DISCOUNT + deliveryFee + taxAmount;
  const amount = route.params?.amount ?? computedTotal;

  const cardDigits = onlyDigits(cardNumber);
  const expiryDigits = onlyDigits(expiry);
  const cvvDigits = onlyDigits(cvv);

  const errors = useMemo(() => {
    const next: {
      cardHolder?: string;
      cardNumber?: string;
      expiry?: string;
      cvv?: string;
    } = {};

    if (!cardHolder.trim()) {
      next.cardHolder = 'Enter cardholder name';
    }
    if (cardDigits.length < 16) {
      next.cardNumber = 'Enter a valid 16-digit card number';
    }
    if (expiryDigits.length < 4) {
      next.expiry = 'Enter expiry as MM/YY';
    } else {
      const month = Number(expiryDigits.slice(0, 2));
      if (month < 1 || month > 12) {
        next.expiry = 'Enter a valid month (01-12)';
      }
    }
    if (cvvDigits.length < 3) {
      next.cvv = 'Enter a valid CVV';
    }

    return next;
  }, [cardDigits.length, cardHolder, cvvDigits.length, expiryDigits]);

  const isValid = Object.keys(errors).length === 0;

  const previewNumber =
    cardDigits.length > 0
      ? formatCardNumber(cardDigits.padEnd(16, '•'))
      : '•••• •••• •••• ••••';
  const previewName = cardHolder.trim() || 'CARD HOLDER';
  const previewExpiry = expiryDigits.length >= 4 ? expiry : 'MM/YY';

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCardNumberChange = (value: string) => {
    setCardNumber(formatCardNumber(value));
  };

  const handleExpiryChange = (value: string) => {
    setExpiry(formatExpiry(value));
  };

  const handleCvvChange = (value: string) => {
    setCvv(onlyDigits(value).slice(0, 4));
  };

  const handlePay = async () => {
    setTouched(true);
    if (!isValid || isPaying) {
      return;
    }

    if (items.length === 0) {
      Alert.alert('Cart empty', 'Your cart is empty. Add items before paying.');
      return;
    }

    setIsPaying(true);

    try {
      // Simulated card authorization (no real gateway in this app yet)
      await new Promise<void>(resolve => setTimeout(resolve, 900));

      if (!user?.email) {
        throw new Error('You must be signed in to place an order.');
      }

      const saved = await placeOrder({
        userEmail: user.email,
        order: {
          customerEmail: user.email,
          customerName: user.name,
          items,
          productTotal: cartTotal,
          discount: DISCOUNT,
          deliveryFee,
          taxPercent: TAX_PERCENT,
          taxAmount,
          totalAmount: amount,
          paymentMethod: 'card',
          deliveryAddress: fullAddress,
          deliveryInstructions: deliveryInstructions.trim(),
          orderMode,
        },
      });

      await addNotification({
        title: 'Payment successful',
        body: `Card payment received for order ${saved.orderId}. Total ${formatPrice(
          amount,
        )}.`,
        orderId: saved.id,
      });

      if (
        orderMode === 'delivery' &&
        fullAddress &&
        fullAddress !== 'Select delivery address' &&
        fullAddress !== 'Detecting location...'
      ) {
        addSavedAddress('Location', fullAddress);
      }

      clearCart();
      navigation.navigate('MainTabs', {screen: 'Orders'});
    } catch (error) {
      Alert.alert(
        'Payment failed',
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Couldn't complete card payment. Please try again.",
      );
    } finally {
      setIsPaying(false);
    }
  };

  return {
    amountLabel: formatPrice(amount),
    cardHolder,
    setCardHolder,
    cardNumber,
    handleCardNumberChange,
    expiry,
    handleExpiryChange,
    cvv,
    handleCvvChange,
    previewNumber,
    previewName,
    previewExpiry,
    touched,
    errors,
    isPaying,
    stickyBottomPad,
    handleBack,
    handlePay,
  };
};

export default useController;
