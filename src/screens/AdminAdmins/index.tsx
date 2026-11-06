import React, {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../context/AuthContext';
import {useCatalog} from '../../context/CatalogContext';
import {
  listAdminAccounts,
  removeAdminAccount,
  type StoredUser,
} from '../../storage/authStorage';
import type {RootStackParamList} from '../../types/navigation';
import {styles} from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminAdmins'>;

const AdminCard = ({
  item,
  branchLabel,
  onEdit,
  onDelete,
}: {
  item: StoredUser;
  branchLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardBody}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <View style={styles.passwordRow}>
            <Text style={styles.passwordLabel}>Password: </Text>
            <Text style={styles.passwordValue}>
              {showPassword ? item.password : '••••••••'}
            </Text>
            <Pressable
              accessibilityLabel={
                showPassword ? 'Hide password' : 'Show password'
              }
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setShowPassword(prev => !prev)}
              style={styles.passwordEye}>
              <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color="#6B7280"
              />
            </Pressable>
          </View>
          <Text style={styles.branch}>{branchLabel}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            accessibilityLabel={`Edit ${item.name}`}
            accessibilityRole="button"
            style={styles.iconButton}
            onPress={onEdit}>
            <Icon name="pencil" size={18} color="#1A1A1A" />
          </Pressable>
          <Pressable
            accessibilityLabel={`Remove ${item.name}`}
            accessibilityRole="button"
            style={[styles.iconButton, styles.iconButtonDanger]}
            onPress={onDelete}>
            <Icon name="delete-outline" size={18} color="#C74440" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const AdminAdminsScreen = () => {
  const navigation = useNavigation<Nav>();
  const {isSuperAdmin} = useAuth();
  const {branches} = useCatalog();
  const [admins, setAdmins] = useState<StoredUser[]>([]);
  const [loading, setLoading] = useState(true);

  const branchName = useCallback(
    (branchId: string | null) =>
      branches.find(item => item.id === branchId)?.name ?? 'No branch assigned',
    [branches],
  );

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const next = await listAdminAccounts();
      setAdmins(next);
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
      void loadAdmins();
    }, [isSuperAdmin, loadAdmins, navigation]),
  );

  const handleDelete = (admin: StoredUser) => {
    Alert.alert(
      'Remove admin access',
      `Remove access for ${admin.email}? They will no longer be able to log in as admin on this device.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              const result = await removeAdminAccount(admin.email);
              if (!result.ok) {
                Alert.alert('Remove failed', result.error);
                return;
              }
              await loadAdmins();
            })();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Manage Admins</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Only super admin can create admin accounts and assign a branch.
          Accounts are saved on this device until backend is connected.
        </Text>
      </View>

      <FlatList
        data={admins}
        keyExtractor={item => item.email}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={() => {
          void loadAdmins();
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No admins yet</Text>
            <Text style={styles.emptySubtitle}>
              Add an admin and assign them to a specific branch.
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <AdminCard
            item={item}
            branchLabel={branchName(item.branchId)}
            onEdit={() =>
              navigation.navigate('AdminAdminForm', {email: item.email})
            }
            onDelete={() => handleDelete(item)}
          />
        )}
      />

      <Pressable
        accessibilityLabel="Add admin"
        accessibilityRole="button"
        style={styles.fab}
        onPress={() => navigation.navigate('AdminAdminForm', {})}>
        <Icon name="plus" size={22} color="#FFFFFF" />
        <Text style={styles.fabText}>Add admin</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default AdminAdminsScreen;
