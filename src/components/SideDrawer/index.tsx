import React from 'react';
import {
  Alert,
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
  const {user, logout} = useAuth();
  const navigation = useNavigation<DrawerNav>();

  const displayName = user?.name ?? 'Guest User';
  const displayPhone = user?.phone?.trim()
    ? user.phone
    : 'No phone number added';

  const menuItems: MenuItem[] = [
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
      onPress: () => Alert.alert('My Favorites', 'Coming soon.'),
    },
    {
      key: 'menu',
      label: 'Explore Menu',
      icon: 'food',
      onPress: () => navigation.navigate('MainTabs', {screen: 'Menu'}),
    },
    {
      key: 'addresses',
      label: 'Saved Addresses',
      icon: 'map-marker-outline',
      onPress: () => Alert.alert('Saved Addresses', 'Coming soon.'),
    },
    {
      key: 'feedback',
      label: 'Ratings & Feedbacks',
      icon: 'star-outline',
      onPress: () => Alert.alert('Ratings & Feedbacks', 'Coming soon.'),
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: 'logout',
      danger: true,
      onPress: async () => {
        await logout();
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.panel} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Pressable
              accessibilityLabel="Notifications"
              accessibilityRole="button"
              style={styles.notificationButton}
              onPress={() =>
                Alert.alert('Notifications', 'No new notifications.')
              }>
              <Icon name="bell-outline" size={22} color="#1A1A1A" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}>
            <View style={styles.profileSection}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userPhone}>{displayPhone}</Text>

              <Pressable
                accessibilityRole="button"
                style={styles.viewProfileButton}
                onPress={() => {
                  onClose();
                  Alert.alert('Profile', 'Profile screen coming soon.');
                }}>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </Pressable>
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

        <Pressable style={styles.dismissArea} onPress={onClose} />
      </View>
    </Modal>
  );
};

export default SideDrawer;
