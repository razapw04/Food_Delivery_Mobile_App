import React, {useEffect, useMemo, useRef} from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../context/AuthContext';
import {useNotifications} from '../../context/NotificationsContext';
import {useResponsive} from '../../hooks/useResponsive';
import type {RootStackParamList} from '../../types/navigation';
import {styles} from './styles';

type SideDrawerProps = {
  visible: boolean;
  onClose: () => void;
};

type DrawerNav = NativeStackNavigationProp<RootStackParamList>;

type MenuItem = {
  key: string;
  label: string;
  icon: string;
  onPress: () => void;
  danger?: boolean;
};

const SideDrawer = ({visible, onClose}: SideDrawerProps) => {
  const {
    user,
    logout,
    isAdmin,
    isSuperAdmin,
    isCashier,
    isKitchen,
    isStaff,
    canViewRevenue,
  } = useAuth();
  const {unreadCount} = useNotifications();
  const {width, isTablet} = useResponsive();
  const navigation = useNavigation<DrawerNav>();
  const panelWidth = useMemo(
    () => Math.min(width * (isTablet ? 0.42 : 0.78), isTablet ? 400 : 340),
    [isTablet, width],
  );
  const [mounted, setMounted] = React.useState(visible);
  const translateX = useRef(new Animated.Value(-panelWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateX.setValue(-panelWidth);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(translateX, {
          toValue: 0,
          damping: 22,
          stiffness: 180,
          mass: 0.9,
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
      Animated.timing(translateX, {
        toValue: -panelWidth,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({finished}) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [visible, mounted, overlayOpacity, panelWidth, translateX]);

  const displayName = user?.name ?? 'Guest User';
  const displayPhone = user?.phone?.trim()
    ? user.phone
    : 'No phone number added';

  const logoutItem: MenuItem = {
    key: 'logout',
    label: 'Logout',
    icon: 'logout',
    danger: true,
    onPress: () => {
      void (async () => {
        try {
          await logout();
        } catch {
          // ignore logout errors so navigation still happens
        } finally {
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }
      })();
    },
  };

  const menuItems: MenuItem[] = isAdmin
    ? [
        ...(isSuperAdmin
          ? [
              {
                key: 'admin-revenue',
                label: 'Revenue & Sales',
                icon: 'chart-line',
                onPress: () =>
                  navigation.navigate('AdminTabs', {screen: 'AdminRevenue'}),
              },
              {
                key: 'admin-live-sales',
                label: 'Live Sales',
                icon: 'cash-multiple',
                onPress: () =>
                  navigation.navigate('AdminTabs', {screen: 'AdminLiveSales'}),
              },
              {
                key: 'admin-branches',
                label: 'Manage Branches',
                icon: 'store-outline',
                onPress: () =>
                  navigation.navigate('AdminTabs', {screen: 'AdminBranches'}),
              },
              {
                key: 'admin-admins',
                label: 'Manage Staff',
                icon: 'account-key',
                onPress: () =>
                  navigation.navigate('AdminTabs', {screen: 'AdminAdmins'}),
              },
              {
                key: 'admin-products',
                label: 'Manage Menu',
                icon: 'food',
                onPress: () =>
                  navigation.navigate('AdminTabs', {screen: 'AdminProducts'}),
              },
              {
                key: 'admin-orders',
                label: 'Manage Orders',
                icon: 'clipboard-list-outline',
                onPress: () => navigation.navigate('AdminOrders'),
              },
              {
                key: 'admin-approvals',
                label: 'Price Approvals',
                icon: 'clipboard-check-outline',
                onPress: () => navigation.navigate('AdminPriceApprovals'),
              },
              {
                key: 'admin-inventory-requests',
                label: 'Inventory Requests',
                icon: 'package-variant-closed',
                onPress: () => navigation.navigate('AdminInventoryRequests'),
              },
            ]
          : [
              ...(canViewRevenue
                ? [
                    {
                      key: 'admin-revenue',
                      label: 'Branch Sales',
                      icon: 'chart-line',
                      onPress: () =>
                        navigation.navigate('AdminTabs', {
                          screen: 'AdminRevenue',
                        }),
                    },
                    {
                      key: 'admin-live-sales',
                      label: 'Live Sales',
                      icon: 'cash-multiple',
                      onPress: () =>
                        navigation.navigate('AdminTabs', {
                          screen: 'AdminLiveSales',
                        }),
                    },
                  ]
                : []),
              {
                key: 'admin-orders',
                label: 'Manage Orders',
                icon: 'clipboard-list-outline',
                onPress: () =>
                  navigation.navigate('AdminTabs', {screen: 'AdminOrders'}),
              },
              {
                key: 'admin-employees',
                label: 'Branch Employees',
                icon: 'account-group-outline',
                onPress: () =>
                  navigation.navigate('AdminTabs', {screen: 'AdminAdmins'}),
              },
              {
                key: 'admin-products',
                label: 'Menu / Prices',
                icon: 'food',
                onPress: () =>
                  navigation.navigate('AdminTabs', {screen: 'AdminProducts'}),
              },
              {
                key: 'admin-inventory-requests',
                label: 'Inventory Requests',
                icon: 'package-variant-closed',
                onPress: () => navigation.navigate('AdminInventoryRequests'),
              },
            ]),
        logoutItem,
      ]
    : isCashier
      ? [
          {
            key: 'cashier-orders',
            label: 'Orders',
            icon: 'clipboard-list-outline',
            onPress: () =>
              navigation.navigate('CashierTabs', {screen: 'CashierOrders'}),
          },
          {
            key: 'cashier-pos',
            label: 'POS',
            icon: 'point-of-sale',
            onPress: () =>
              navigation.navigate('CashierTabs', {screen: 'CashierPOS'}),
          },
          {
            key: 'cashier-history',
            label: 'Order History',
            icon: 'history',
            onPress: () =>
              navigation.navigate('CashierTabs', {
                screen: 'CashierOrderHistory',
              }),
          },
          {
            key: 'cashier-sales',
            label: 'Branch Sales',
            icon: 'chart-line',
            onPress: () =>
              navigation.navigate('CashierTabs', {screen: 'CashierSales'}),
          },
          {
            key: 'cashier-inventory',
            label: 'Inventory Cash',
            icon: 'cash-multiple',
            onPress: () =>
              navigation.navigate('CashierTabs', {screen: 'CashierInventory'}),
          },
          logoutItem,
        ]
      : isKitchen
        ? [
            {
              key: 'kitchen-orders',
              label: 'Kitchen Orders',
              icon: 'chef-hat',
              onPress: () =>
                navigation.navigate('KitchenTabs', {screen: 'KitchenOrders'}),
            },
            logoutItem,
          ]
        : [
            {
              key: 'orders',
              label: 'Order History',
              icon: 'package-variant-closed',
              onPress: () =>
                navigation.navigate('MainTabs', {screen: 'Orders'}),
            },
            {
              key: 'favorites',
              label: 'My Favorites',
              icon: 'heart-outline',
              onPress: () => navigation.navigate('Favorites'),
            },
            {
              key: 'menu',
              label: 'Explore Menu',
              icon: 'food',
              onPress: () => navigation.navigate('Menu'),
            },
            {
              key: 'addresses',
              label: 'Saved Addresses',
              icon: 'map-marker-outline',
              onPress: () => navigation.navigate('SavedAddresses'),
            },
            {
              key: 'feedback',
              label: 'Ratings & Feedbacks',
              icon: 'star-outline',
              onPress: () => navigation.navigate('Feedback'),
            },
            logoutItem,
          ];

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: overlayOpacity,
            },
          ]}>
          <Pressable style={styles.dismissArea} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.panelWrap,
            {
              width: panelWidth,
              transform: [{translateX}],
            },
          ]}>
          <SafeAreaView style={styles.panel} edges={['top', 'bottom']}>
            <View style={styles.header}>
              <Image
                source={require('../../assets/images/Logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              {!isStaff ? (
                <Pressable
                  accessibilityLabel="Notifications"
                  accessibilityRole="button"
                  style={styles.notificationButton}
                  onPress={() => {
                    onClose();
                    navigation.navigate('Notifications');
                  }}>
                  <Icon
                    name={unreadCount > 0 ? 'bell' : 'bell-outline'}
                    size={22}
                    color="#1A1A1A"
                  />
                  {unreadCount > 0 ? (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>
                        {unreadCount > 9 ? '9+' : String(unreadCount)}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              ) : null}
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}>
              <View style={styles.profileSection}>
                <Text style={styles.userName}>{displayName}</Text>
                <Text style={styles.userPhone}>
                  {isSuperAdmin
                    ? 'Super Admin'
                    : isAdmin
                      ? 'Manager'
                      : isCashier
                        ? 'Cashier'
                        : isKitchen
                          ? 'Kitchen'
                          : displayPhone}
                </Text>

                {!isStaff ? (
                  <Pressable
                    accessibilityRole="button"
                    style={styles.viewProfileButton}
                    onPress={() => {
                      onClose();
                      navigation.navigate('Profile');
                    }}>
                    <Text style={styles.viewProfileText}>View Profile</Text>
                  </Pressable>
                ) : null}
              </View>

              <View style={styles.menuSection}>
                {menuItems.map(item => (
                  <Pressable
                    key={item.key}
                    accessibilityRole="button"
                    style={styles.menuItem}
                    onPress={() => {
                      onClose();
                      item.onPress();
                    }}>
                    <View style={styles.menuItemLeft}>
                      <View
                        style={[
                          styles.menuIconWrap,
                          item.danger && styles.menuIconWrapDanger,
                        ]}>
                        <Icon
                          name={item.icon}
                          size={20}
                          color={item.danger ? '#C74440' : '#FF7622'}
                        />
                      </View>
                      <Text
                        style={[
                          styles.menuItemLabel,
                          item.danger && styles.menuItemLabelDanger,
                        ]}>
                        {item.label}
                      </Text>
                    </View>
                    <Icon
                      name="chevron-right"
                      size={22}
                      color={item.danger ? '#C74440' : '#6B7280'}
                    />
                  </Pressable>
                ))}
              </View>

              <View style={styles.contactFooter}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Contact us"
                  style={styles.contactButton}
                  onPress={() => {
                    onClose();
                    navigation.navigate('ContactUs');
                  }}>
                  <Icon name="headset" size={20} color="#FFFFFF" />
                  <Text style={styles.contactButtonText}>Contact Us</Text>
                </Pressable>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SideDrawer;
