import {useMemo, useState} from 'react';
import {Alert, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import type {RootStackParamList} from '../../../types/navigation';

type ContactUsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ContactUs'
>;

export const SUPPORT_PHONE = '03001234567';
export const SUPPORT_EMAIL = 'support@foodapp.com';
export const SUPPORT_WHATSAPP = '923001234567';

const useController = () => {
  const navigation = useNavigation<ContactUsNavigationProp>();
  const {user} = useAuth();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const canSend = useMemo(
    () => message.trim().length >= 5 && !sending,
    [message, sending],
  );

  const openLink = async (url: string, fallbackTitle: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(fallbackTitle, 'Unable to open this link on your device.');
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(fallbackTitle, 'Something went wrong. Please try again.');
    }
  };

  const handleSend = async () => {
    if (!canSend) {
      return;
    }
    setSending(true);
    try {
      const subject = encodeURIComponent('Food App support request');
      const body = encodeURIComponent(
        `Name: ${user?.name ?? 'Guest'}\nEmail: ${
          user?.email ?? 'n/a'
        }\n\n${message.trim()}`,
      );
      await openLink(
        `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`,
        'Email unavailable',
      );
      setMessage('');
    } finally {
      setSending(false);
    }
  };

  const callSupport = () => {
    void openLink(`tel:${SUPPORT_PHONE}`, 'Call unavailable');
  };

  const emailSupport = () => {
    void openLink(`mailto:${SUPPORT_EMAIL}`, 'Email unavailable');
  };

  const whatsappSupport = () => {
    void openLink(
      `https://wa.me/${SUPPORT_WHATSAPP}`,
      'WhatsApp unavailable',
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  return {
    message,
    sending,
    canSend,
    setMessage,
    handleSend,
    callSupport,
    emailSupport,
    whatsappSupport,
    goBack,
  };
};

export default useController;
