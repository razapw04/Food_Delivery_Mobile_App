import {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {
  listAdminAccounts,
  removeAdminAccount,
  staffRoleLabel,
  type StoredUser,
} from '../../../storage/authStorage';
import type {RootStackParamList} from '../../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminAdmins'>;

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isSuperAdmin} = useAuth();
  const {branches} = useCatalog();
  const [staff, setStaff] = useState<StoredUser[]>([]);
  const [loading, setLoading] = useState(true);

  const branchName = useCallback(
    (branchId: string | null) =>
      branches.find(item => item.id === branchId)?.name ?? 'No branch assigned',
    [branches],
  );

  const loadStaff = useCallback(async () => {
    setLoading(true);
    try {
      const next = await listAdminAccounts();
      setStaff(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!isSuperAdmin) {
        navigation.replace('AdminOrders');
        return;
      }
      void loadStaff();
    }, [isSuperAdmin, loadStaff, navigation]),
  );

  const handleDelete = useCallback(
    (account: StoredUser) => {
      const label = staffRoleLabel(account.role);
      Alert.alert(
        `Remove ${label.toLowerCase()} access`,
        `Remove access for ${account.email}? They will no longer be able to log in as ${label.toLowerCase()} on this device.`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              void (async () => {
                const result = await removeAdminAccount(account.email);
                if (!result.ok) {
                  Alert.alert('Remove failed', result.error);
                  return;
                }
                await loadStaff();
              })();
            },
          },
        ],
      );
    },
    [loadStaff],
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    navigation,
    staff,
    loading,
    branchName,
    loadStaff,
    handleDelete,
    handleBack,
  };
};

export default useController;
