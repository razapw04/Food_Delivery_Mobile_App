import React from 'react';
import {FlatList, Image, Pressable, StatusBar, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {AppNotification} from '../../../storage/notificationsStorage';
import {styles} from './styles';
import useController, {formatTime} from './useController';

const logoSource = require('../../../assets/images/Logo.png');

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
  const {notifications, goBack, handleTestNotification} = useController();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={goBack}
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#202321" />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send test notification"
          onPress={handleTestNotification}
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
