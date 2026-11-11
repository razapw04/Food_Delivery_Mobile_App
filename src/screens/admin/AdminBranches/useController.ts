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
  listBranches,
  removeBranch,
  type AdminBranch,
} from '../../../storage/branchesStorage';
import type {
  AdminTabParamList,
  RootStackParamList,
} from '../../../types/navigation';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<AdminTabParamList, 'AdminBranches'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const useController = () => {
  const navigation = useNavigation<Nav>();
  const {isSuperAdmin} = useAuth();
  const {refreshCatalog} = useCatalog();
  const [branches, setBranches] = useState<AdminBranch[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBranches = useCallback(async () => {
    setLoading(true);
    try {
      setBranches(await listBranches());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!isSuperAdmin) {
        navigation.navigate('AdminRevenue');
        return;
      }
      void loadBranches();
    }, [isSuperAdmin, loadBranches, navigation]),
  );

  const handleDelete = useCallback(
    (branch: AdminBranch) => {
      Alert.alert(
        'Delete branch',
        `Remove "${branch.name}"? Staff assigned to it will need a new branch.`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              void (async () => {
                const next = await removeBranch(branch.id);
                setBranches(next);
                await refreshCatalog();
              })();
            },
          },
        ],
      );
    },
    [refreshCatalog],
  );

  return {
    navigation,
    branches,
    loading,
    loadBranches,
    handleDelete,
  };
};

export default useController;
