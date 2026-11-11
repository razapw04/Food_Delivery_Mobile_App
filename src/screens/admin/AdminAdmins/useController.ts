import {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  type CompositeNavigationProp,
} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {
  listAdminAccounts,
  removeAdminAccount,
  staffRoleLabel,
  type StoredUser,
} from '../../../storage/authStorage';
import type {
  AdminTabParamList,
  RootStackParamList,
} from '../../../types/navigation';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<AdminTabParamList, 'AdminAdmins'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isAdmin, isSuperAdmin, user} = useAuth();
  const {branches} = useCatalog();
  const [staff, setStaff] = useState<StoredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const canManageStaff = isSuperAdmin;
  const managerBranchId = user?.branchId ?? null;

  const branchName = useCallback(
    (branchId: string | null) =>
      branches.find(item => item.id === branchId)?.name ?? 'No branch assigned',
    [branches],
  );

  const loadStaff = useCallback(async () => {
    setLoading(true);
    try {
      const next = await listAdminAccounts();
      if (isSuperAdmin) {
        setStaff(next);
      } else {
        // Managers only view employees for their assigned branch.
        setStaff(
          next.filter(
            item =>
              managerBranchId != null &&
              item.branchId === managerBranchId &&
              item.role !== 'manager',
          ),
        );
      }
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin, managerBranchId]);

  useFocusEffect(
    useCallback(() => {
      if (!isAdmin) {
        navigation.replace('Login');
        return;
      }
      void loadStaff();
    }, [isAdmin, loadStaff, navigation]),
  );

  const handleDelete = useCallback(
    (account: StoredUser) => {
      if (!canManageStaff) {
        return;
      }
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
    [canManageStaff, loadStaff],
  );

  const handleBack = useCallback(() => {
    navigation.navigate(isSuperAdmin ? 'AdminBranches' : 'AdminOrders');
  }, [isSuperAdmin, navigation]);

  return {
    navigation,
    isSuperAdmin,
    canManageStaff,
    staff,
    loading,
    branchName,
    loadStaff,
    handleDelete,
    handleBack,
  };
};

export default useController;
