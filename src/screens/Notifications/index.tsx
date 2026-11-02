import React, {useCallback} from 'react';
import {FlatList, Image, Pressable, StatusBar, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNotifications} from '../../context/NotificationsContext';
import {sendTestLocalNotification} from '../../services/pushNotifications';
import type {AppNotification} from '../../storage/notificationsStorage';
import type {RootStackParamList} from '../../types/navigation';
import {styles} from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Notifications'>;

const logoSource = require('../../assets/images/Logo.png');

const formatTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const NotificationRow = ({item}: {item: AppNotification}) => (
  <View style={styles.row}>
    <Image
      source={logoSource}
      style={styles.appIcon}
      resizeMode="contain"
      accessibilityLabel="App icon"
    />
    <View style={styles.content}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{item.title}</Text>
        {!item.read ? <View style={styles.unreadDot} /> : null}
      </View>
      <Text style={styles.body}>{item.body}</Text>
      <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
    </View>
  </View>
);

const EmptyNotifications = () => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyIconWrap}>
      <Image source={logoSource} style={styles.emptyLogo} resizeMode="contain" />
    </View>
    <Text style={styles.emptyTitle}>No notifications</Text>
    <Text style={styles.emptySubtitle}>
      Updates about your orders will appear here.
    </Text>
  </View>
);

const NotificationsScreen = () => {
  const navigation = useNavigation<Nav>();
  const {notifications, refreshNotifications, markAllRead} =
    useNotifications();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        await refreshNotifications();
        if (active) {
          await markAllRead();
        }
      };
      load();
      return () => {
        active = false;
      };
    }, [refreshNotifications, markAllRead]),
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#202321" />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send test notification"
          onPress={() => sendTestLocalNotification()}
          style={styles.testButton}
          hitSlop={8}>
          <Text style={styles.testButtonText}>Test</Text>
        </Pressable>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyNotifications />}
        renderItem={({item}) => <NotificationRow item={item} />}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;
