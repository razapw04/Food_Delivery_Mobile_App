import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {StoredOrder} from '../../storage/orderStorage';
import {
  buildOrderSlipHtml,
  buildOrderSlipText,
} from '../../utils/orderSlip';
import {styles} from './styles';

type Props = {
  visible: boolean;
  order: StoredOrder | null;
  onClose: () => void;
};

const formatPrice = (value: number) => `Rs. ${value.toLocaleString('en-PK')}`;

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const OrderSlipModal = ({visible, order, onClose}: Props) => {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const [busy, setBusy] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(480)).current;
  const paperScale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      overlayOpacity.setValue(0);
      sheetY.setValue(480);
      paperScale.setValue(0.94);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(sheetY, {
          toValue: 0,
          damping: 20,
          stiffness: 180,
          mass: 0.9,
          useNativeDriver: true,
        }),
        Animated.spring(paperScale, {
          toValue: 1,
          damping: 14,
          stiffness: 160,
          mass: 0.8,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!mounted) {
      return;
    }

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sheetY, {
        toValue: 480,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({finished}) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [visible, mounted, overlayOpacity, paperScale, sheetY]);

  const handleShare = async () => {
    if (!order) {
      return;
    }
    setBusy(true);
    try {
      await Share.share({
        title: `Order ${order.orderId}`,
        message: buildOrderSlipText(order),
      });
    } catch {
      Alert.alert('Share failed', 'Could not share this order slip.');
    } finally {
      setBusy(false);
    }
  };

  const handlePrint = async () => {
    if (!order) {
      return;
    }
    setBusy(true);
    try {
      // Dynamic import so the app still runs if the native module is missing.
      const Print = require('react-native-print') as {
        print: (options: {html: string; jobName?: string}) => Promise<void>;
      };
      await Print.print({
        html: buildOrderSlipHtml(order),
        jobName: `Order-${order.orderId}`,
      });
    } catch (error) {
      // Fallback: share slip text when system print is unavailable.
      Alert.alert(
        'Print unavailable',
        'System print module is not ready on this build. You can share the slip instead.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Share slip',
            onPress: () => {
              void handleShare();
            },
          },
        ],
      );
      if (__DEV__) {
        console.warn('Order slip print failed', error);
      }
    } finally {
      setBusy(false);
    }
  };

  if (!mounted || !order) {
    return null;
  }

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, {opacity: overlayOpacity}]}>
          <Pressable style={{flex: 1}} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, 16),
              transform: [{translateY: sheetY}],
            },
          ]}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Order slip</Text>
              <Text style={styles.subtitle}>
                Confirmed · ready to print for kitchen
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close slip"
              style={styles.closeButton}
              onPress={onClose}>
              <Icon name="close" size={20} color="#1A1A1A" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.slipScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 8}}>
            <Animated.View
              style={[styles.paper, {transform: [{scale: paperScale}]}]}>
              <Text style={styles.brand}>Food Delivery</Text>
              <Text style={styles.brandSub}>Kitchen Order Slip</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Order</Text>
                <Text style={styles.metaValue}>{order.orderId}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>
                  {formatWhen(order.createdAt)}
                </Text>
              </View>
              {order.tableNo ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Table</Text>
                  <Text style={styles.metaValue}>{order.tableNo}</Text>
                </View>
              ) : null}
              {order.waiterName ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Waiter</Text>
                  <Text style={styles.metaValue}>{order.waiterName}</Text>
                </View>
              ) : null}
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Customer</Text>
                <Text style={styles.metaValue}>
                  {order.customerName || 'Customer'}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Mode</Text>
                <Text style={styles.metaValue}>
                  {order.orderMode === 'dine_in'
                    ? 'Dine-in'
                    : order.orderMode === 'pickup'
                      ? 'Pickup'
                      : 'Delivery'}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Payment</Text>
                <Text style={styles.metaValue}>
                  {order.paymentMethod.toUpperCase()}
                </Text>
              </View>

              <View style={styles.divider} />

              {(order.items ?? []).map(item => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemName}>
                    {item.quantity}x {item.name}
                    {item.variation ? ` (${item.variation})` : ''}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.unitPrice * item.quantity)}
                  </Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Subtotal</Text>
                <Text style={styles.metaValue}>
                  {formatPrice(order.productTotal)}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Discount</Text>
                <Text style={styles.metaValue}>
                  - {formatPrice(order.discount)}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Delivery</Text>
                <Text style={styles.metaValue}>
                  {formatPrice(order.deliveryFee)}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Tax ({order.taxPercent}%)</Text>
                <Text style={styles.metaValue}>
                  {formatPrice(order.taxAmount)}
                </Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.totalValue}>
                  {formatPrice(order.totalAmount)}
                </Text>
              </View>

              {order.deliveryAddress ? (
                <Text style={styles.address}>
                  Address: {order.deliveryAddress}
                </Text>
              ) : null}
              {order.deliveryInstructions?.trim() ? (
                <Text style={styles.address}>
                  Note: {order.deliveryInstructions.trim()}
                </Text>
              ) : null}

              <Text style={styles.thanks}>Thank you!</Text>
            </Animated.View>
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              style={[styles.secondaryButton, busy && styles.buttonDisabled]}
              disabled={busy}
              onPress={() => {
                void handleShare();
              }}>
              <Icon name="share-variant" size={18} color="#1A1A1A" />
              <Text style={styles.secondaryText}>Share</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={[styles.primaryButton, busy && styles.buttonDisabled]}
              disabled={busy}
              onPress={() => {
                void handlePrint();
              }}>
              <Icon name="printer" size={18} color="#FFFFFF" />
              <Text style={styles.primaryText}>
                {busy ? 'Working...' : 'Print slip'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default OrderSlipModal;
