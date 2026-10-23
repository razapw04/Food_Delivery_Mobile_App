import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
  ImageBackground,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {RootStackParamList} from '../../types/navigation';
import {
  bestsellers,
  BestsellerItem,
  promos,
  recentOrders,
  RecentOrder,
} from './model';
import {styles} from './styles';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type OrderMode = 'delivery' | 'pickup';

let hasAutoOpenedAddressModal = false;

const HomeHeader = () => (
  <View style={styles.header}>
    <Pressable
      accessibilityLabel="Open menu"
      accessibilityRole="button"
      onPress={() =>
        Alert.alert('Menu', 'Side drawer will be available here.')
      }
      style={styles.iconButton}>
      <Icon name="menu" size={24} color="#1A1A1A" />
    </Pressable>

    <View style={styles.locationBlock}>
      <View style={styles.locationLabelRow}>
        <Icon name="map-marker" size={14} color="#FF7622" />
        <Text style={styles.locationLabel}>Deliver to</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => Alert.alert('Delivery location', 'Halal Lab office')}
        style={styles.locationButton}>
        <Text numberOfLines={1} style={styles.locationText}>
          Halal Lab office
        </Text>
        <Icon name="chevron-down" size={18} color="#1A1A1A" />
      </Pressable>
    </View>

    <Pressable
      accessibilityLabel="Shopping bag, 2 items"
      accessibilityRole="button"
      onPress={() => Alert.alert('Your bag', 'You have 2 items in your bag.')}
      style={styles.cartButton}>
      <Icon name="shopping-outline" size={22} color="#FFFFFF" />
      <View style={styles.cartBadge}>
        <Text style={styles.cartBadgeText}>2</Text>
      </View>
    </Pressable>
  </View>
);

const OrderModeToggle = ({
  mode,
  onChange,
  onDeliveryPress,
  onPickupPress,
}: {
  mode: OrderMode;
  onChange: (mode: OrderMode) => void;
  onDeliveryPress: () => void;
  onPickupPress: () => void;
}) => (
  <View style={styles.toggleWrap}>
    <View style={styles.toggleTrack}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{selected: mode === 'delivery'}}
        onPress={() => {
          onChange('delivery');
          onDeliveryPress();
        }}
        style={[
          styles.toggleButton,
          mode === 'delivery' && styles.toggleButtonActive,
        ]}>
        <Icon
          name="bike-fast"
          size={18}
          color={mode === 'delivery' ? '#FFFFFF' : '#6B7280'}
        />
        <Text
          style={[
            styles.toggleLabel,
            mode === 'delivery' && styles.toggleLabelActive,
          ]}>
          Delivery
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{selected: mode === 'pickup'}}
        onPress={() => {
          onChange('pickup');
          onPickupPress();
        }}
        style={[
          styles.toggleButton,
          mode === 'pickup' && styles.toggleButtonActive,
        ]}>
        <Icon
          name="storefront-outline"
          size={18}
          color={mode === 'pickup' ? '#FFFFFF' : '#6B7280'}
        />
        <Text
          style={[
            styles.toggleLabel,
            mode === 'pickup' && styles.toggleLabelActive,
          ]}>
          Pickup
        </Text>
      </Pressable>
    </View>
  </View>
);

const AddressModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}>
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <Pressable style={styles.modalSheet} onPress={event => event.stopPropagation()}>
        <View style={styles.modalHandle} />
        <Text style={styles.modalTitle}>Add or choose an address</Text>

        <Pressable
          style={styles.modalOption}
          onPress={() => {
            onClose();
            Alert.alert('Select location', 'Map location picker coming soon.');
          }}>
          <View style={styles.modalOptionIcon}>
            <Icon name="map-marker-radius-outline" size={22} color="#FF7622" />
          </View>
          <View style={styles.modalOptionTextWrap}>
            <Text style={styles.modalOptionTitle}>Select new location</Text>
            <Text style={styles.modalOptionSubtitle}>
              Choose a place on the map
            </Text>
          </View>
          <Icon name="chevron-right" size={22} color="#6B7280" />
        </Pressable>

        <Pressable
          style={styles.modalOption}
          onPress={() => {
            onClose();
            Alert.alert('Add address', 'Add new address coming soon.');
          }}>
          <View style={styles.modalOptionIcon}>
            <Icon name="plus" size={22} color="#FF7622" />
          </View>
          <View style={styles.modalOptionTextWrap}>
            <Text style={styles.modalOptionTitle}>Add new address</Text>
            <Text style={styles.modalOptionSubtitle}>
              Save a home, office, or other place
            </Text>
          </View>
          <Icon name="chevron-right" size={22} color="#6B7280" />
        </Pressable>
      </Pressable>
    </Pressable>
  </Modal>
);

const PROMO_AUTO_SLIDE_MS = 3500;

const PromoCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  activeIndexRef.current = activeIndex;

  const animateToIndex = (nextIndex: number, direction: 1 | -1 = 1) => {
    if (isAnimatingRef.current) {
      return;
    }

    const total = promos.length;
    const wrapped = ((nextIndex % total) + total) % total;
    if (wrapped === activeIndexRef.current) {
      return;
    }

    isAnimatingRef.current = true;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: direction * -28,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.96,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveIndex(wrapped);
      translateX.setValue(direction * 28);
      scale.setValue(1.02);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        isAnimatingRef.current = false;
      });
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      animateToIndex(activeIndexRef.current + 1, 1);
    }, PROMO_AUTO_SLIDE_MS);

    return () => clearInterval(timer);
  }, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          Math.abs(gesture.dx) > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx <= -40) {
            animateToIndex(activeIndexRef.current + 1, 1);
          } else if (gesture.dx >= 40) {
            animateToIndex(activeIndexRef.current - 1, -1);
          }
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [],
  );

  const activePromo = promos[activeIndex];

  return (
    <View style={styles.promoSection}>
      <View style={styles.promoFrame} {...panResponder.panHandlers}>
        <Animated.Image
          source={{uri: activePromo.image}}
          style={[
            styles.promoImage,
            {
              opacity,
              transform: [{translateX}, {scale}],
            },
          ]}
          resizeMode="cover"
        />
      </View>

      <View style={styles.promoDots}>
        {promos.map((promo, index) => (
          <Pressable
            key={promo.id}
            onPress={() =>
              animateToIndex(
                index,
                index > activeIndexRef.current ? 1 : -1,
              )
            }
            hitSlop={8}
            style={[
              styles.promoDot,
              index === activeIndex && styles.promoDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const BestsellerCard = ({
  item,
  onPress,
}: {
  item: BestsellerItem;
  onPress: () => void;
}) => (
  <Pressable style={styles.menuCard} onPress={onPress}>
    <View style={styles.menuCardImageWrap}>
      <Image
        source={{uri: item.image}}
        style={styles.menuCardImage}
        resizeMode="cover"
      />
    </View>
    <Text numberOfLines={2} style={styles.menuCardText}>
      {item.name}
    </Text>
  </Pressable>
);

const ExploreMenuBanner = ({onPress}: {onPress: () => void}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Explore our menu"
    onPress={onPress}
    style={styles.exploreBanner}>
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
      }}
      style={styles.exploreBannerImage}
      imageStyle={{borderRadius: 18}}
      resizeMode="cover">
      <View style={styles.exploreBannerOverlay} pointerEvents="none">
        <Text style={styles.exploreBannerTitle}>Explore our menu</Text>
        <Text style={styles.exploreBannerSubtitle}>
          Tap to browse all delicious items
        </Text>
      </View>
    </ImageBackground>
  </Pressable>
);

const RecentOrderCard = ({
  order,
  onReorder,
}: {
  order: RecentOrder;
  onReorder: () => void;
}) => (
  <View style={styles.recentOrderCard}>
    <Image
      source={{uri: order.image}}
      style={styles.recentOrderImage}
      resizeMode="cover"
    />
    <View style={styles.recentOrderBody}>
      <Text numberOfLines={1} style={styles.recentOrderTitle}>
        {order.title}
      </Text>
      <Text numberOfLines={1} style={styles.recentOrderMeta}>
        {order.day} · {order.time} · {order.itemsSummary}
      </Text>
      <Text style={styles.recentOrderPrice}>{order.price}</Text>
    </View>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Reorder ${order.title}`}
      onPress={onReorder}
      style={styles.reorderButton}>
      <Text style={styles.reorderButtonText}>Reorder</Text>
    </Pressable>
  </View>
);

const RecentOrdersSection = ({
  orders,
  onViewAll,
  onReorder,
}: {
  orders: RecentOrder[];
  onViewAll: () => void;
  onReorder: (order: RecentOrder) => void;
}) => {
  if (!orders.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onViewAll}
          style={styles.sectionActionWrap}
          hitSlop={8}>
          <Text style={styles.sectionAction}>View all</Text>
        </Pressable>
      </View>

      <View style={styles.recentOrdersList}>
        {orders.map(order => (
          <RecentOrderCard
            key={order.id}
            order={order}
            onReorder={() => onReorder(order)}
          />
        ))}
      </View>
    </View>
  );
};

const ExploreMenu = ({
  onViewAll,
  onSelectItem,
}: {
  onViewAll: () => void;
  onSelectItem: (name: string) => void;
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>Explore Menu</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onViewAll}
        style={styles.sectionActionWrap}
        hitSlop={8}>
        <Text style={styles.sectionAction}>View all</Text>
      </Pressable>
    </View>

    <View style={styles.menuGrid}>
      {bestsellers.map(item => (
        <BestsellerCard
          key={item.id}
          item={item}
          onPress={() => onSelectItem(item.name)}
        />
      ))}
    </View>
  </View>
);

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const [orderMode, setOrderMode] = useState<OrderMode>('delivery');
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  useEffect(() => {
    if (!hasAutoOpenedAddressModal) {
      hasAutoOpenedAddressModal = true;
      setAddressModalVisible(true);
    }
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <HomeHeader />
        <OrderModeToggle
          mode={orderMode}
          onChange={setOrderMode}
          onDeliveryPress={() => setAddressModalVisible(true)}
          onPickupPress={() => navigation.navigate('Branches')}
        />
        
        <PromoCarousel />
        <ExploreMenu
          onViewAll={() => navigation.navigate('Menu')}
          onSelectItem={name =>
            Alert.alert(name, `${name} details will open here.`)
          }
        />
        <RecentOrdersSection
          orders={recentOrders}
          onViewAll={() =>
            Alert.alert('Recent Orders', 'Full order history coming soon.')
          }
          onReorder={order =>
            Alert.alert('Reorder', `${order.title} will be added to your bag.`)
          }
        />
        <ExploreMenuBanner onPress={() => navigation.navigate('Menu')} />
      </ScrollView>

      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
