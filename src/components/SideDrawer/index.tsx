import React, {useEffect, useRef} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
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

const PANEL_WIDTH = Math.min(Dimensions.get('window').width * 0.78, 340);

const SideDrawer = ({visible, onClose}: SideDrawerProps) => {
  const {user, logout, isAdmin, isSuperAdmin} = useAuth();
  const {unreadCount} = useNotifications();
  const navigation = useNavigation<DrawerNav>();
  const [mounted, setMounted] = React.useState(visible);
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateX.setValue(-PANEL_WIDTH);
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
        toValue: -PANEL_WIDTH,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({finished}) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [visible, mounted, overlayOpacity, translateX]);

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
                key: 'admin-orders',
                label: 'Manage Orders',
                icon: 'clipboard-list-outline',
                onPress: () => navigation.navigate('AdminOrders'),
              },
              {
                key: 'admin-products',
                label: 'Manage Products',
                icon: 'food',
                onPress: () => navigation.navigate('AdminProducts'),
              },
              {
                key: 'admin-revenue',
                label: 'Revenue & Sales',
                icon: 'chart-line',
                onPress: () => navigation.navigate('AdminRevenue'),
              },
              {
                key: 'admin-admins',
                label: 'Manage Admins',
                icon: 'account-key',
                onPress: () => navigation.navigate('AdminAdmins'),
              },
            ]
          : [
              {
                key: 'admin-orders',
                label: 'Manage Orders',
                icon: 'clipboard-list-outline',
                onPress: () => navigation.navigate('AdminOrders'),
              },
              {
                key: 'admin-revenue',
                label: 'My Branch Revenue',
                icon: 'chart-line',
                onPress: () => navigation.navigate('AdminRevenue'),
              },
            ]),
        logoutItem,
      ]
    : [
        {
          key: 'orders',
          label: 'Order History',
          icon: 'package-variant-closed',
          onPress: () => navigation.navigate('MainTabs', {screen: 'Orders'}),
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
          onPress: () => Alert.alert('Ratings & Feedbacks', 'Coming soon.'),
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
              width: PANEL_WIDTH,
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
              {!isAdmin ? (
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
              ) : (
                <View style={styles.notificationButton} />
              )}
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
                      ? 'Admin'
                      : displayPhone}
                </Text>

                {!isAdmin ? (
                  <Pressable
                    accessibilityRole="button"
                    style={styles.viewProfileButton}
                    onPress={() => {
                      onClose();
                      Alert.alert('Profile', 'Profile screen coming soon.');
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
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SideDrawer;
