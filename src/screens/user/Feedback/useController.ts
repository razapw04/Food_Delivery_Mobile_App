import {useCallback, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {
  createFeedback,
  listFeedbackForUser,
  type FeedbackEntry,
} from '../../../storage/feedbackStorage';
import type {RootStackParamList} from '../../../types/navigation';

type FeedbackNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Feedback'
>;

export const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const useController = () => {
  const navigation = useNavigation<FeedbackNavigationProp>();
  const {user} = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [items, setItems] = useState<FeedbackEntry[]>([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!user?.email) {
      setItems([]);
      return;
    }
    setItems(await listFeedbackForUser(user.email));
  }, [user?.email]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const canSubmit = useMemo(
    () => rating >= 1 && comment.trim().length >= 3 && !saving && !!user,
    [comment, rating, saving, user],
  );

  const handleSubmit = async () => {
    if (!user || !canSubmit) {
      return;
    }
    setSaving(true);
    try {
      const result = await createFeedback({
        userEmail: user.email,
        userName: user.name,
        rating,
        comment,
      });
      if (!result.ok) {
        Alert.alert('Could not submit', result.error);
        return;
      }
      setRating(0);
      setComment('');
      await load();
      Alert.alert('Thanks!', 'Your feedback has been saved.');
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return {
    rating,
    comment,
    items,
    saving,
    canSubmit,
    setRating,
    setComment,
    handleSubmit,
    goBack,
  };
};

export default useController;
