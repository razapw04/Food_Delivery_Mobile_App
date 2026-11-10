import {useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import type {RootStackParamList} from '../../../types/navigation';

type ProfileNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

const useController = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const {user, updateProfile} = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setPhone(user?.phone ?? '');
  }, [user?.name, user?.phone]);

  const initials = useMemo(() => {
    const parts = (user?.name ?? 'U').trim().split(/\s+/);
    return parts
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() ?? '')
      .join('');
  }, [user?.name]);

  const canSave = useMemo(() => {
    if (!user || saving) {
      return false;
    }
    const nextName = name.trim();
    const nextPhone = phone.trim();
    if (!nextName) {
      return false;
    }
    return nextName !== user.name || nextPhone !== (user.phone ?? '');
  }, [name, phone, saving, user]);

  const handleSave = async () => {
    if (!canSave) {
      return;
    }
    setSaving(true);
    try {
      const result = await updateProfile({name, phone});
      if (!result.ok) {
        Alert.alert('Update failed', result.error);
        return;
      }
      Alert.alert('Saved', 'Your profile has been updated.');
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return {
    user,
    name,
    phone,
    saving,
    initials,
    canSave,
    setName,
    setPhone,
    handleSave,
    goBack,
  };
};

export default useController;
