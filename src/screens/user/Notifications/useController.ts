import {useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNotifications} from '../../../context/NotificationsContext';
import {sendTestLocalNotification} from '../../../services/pushNotifications';
import type {RootStackParamList} from '../../../types/navigation';

type NotificationsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Notifications'
>;

export const formatTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const useController = () => {
  const navigation = useNavigation<NotificationsNavigationProp>();
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

  const goBack = () => {
    navigation.goBack();
  };

  const handleTestNotification = () => {
    sendTestLocalNotification();
  };

  return {
    notifications,
    goBack,
    handleTestNotification,
  };
};

export default useController;
