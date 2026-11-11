import React, {useState} from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AdminMenuButton from '../../../components/AdminMenuButton';
import {
  staffRoleLabel,
  type StoredUser,
  type UserRole,
} from '../../../storage/authStorage';
import {styles} from './styles';
import useController from './useController';

const ROLE_UI: Record<
  'manager' | 'cashier' | 'kitchen',
  {icon: string; card: object; badge: object; badgeText: object; iconColor: string}
> = {
  manager: {
    icon: 'account-tie',
    card: styles.cardManager,
    badge: styles.roleBadgeManager,
    badgeText: styles.roleBadgeTextManager,
    iconColor: '#1D4ED8',
  },
  cashier: {
    icon: 'cash-register',
    card: styles.cardCashier,
    badge: styles.roleBadgeCashier,
    badgeText: styles.roleBadgeTextCashier,
    iconColor: '#C2410C',
  },
  kitchen: {
    icon: 'chef-hat',
    card: styles.cardKitchen,
    badge: styles.roleBadgeKitchen,
    badgeText: styles.roleBadgeTextKitchen,
    iconColor: '#15803D',
  },
};

const getRoleUi = (role: UserRole) =>
  role === 'manager' || role === 'cashier' || role === 'kitchen'
    ? ROLE_UI[role]
    : ROLE_UI.manager;

const StaffCard = ({
  item,
  branchLabel,
  canManage,
  onEdit,
  onDelete,
}: {
  item: StoredUser;
  branchLabel: string;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const roleLabel = staffRoleLabel(item.role);
  const roleUi = getRoleUi(item.role);

  return (
    <View style={[styles.card, roleUi.card]}>
      <View style={styles.cardTop}>
        <View style={[styles.roleIconWrap, roleUi.badge]}>
          <Icon name={roleUi.icon} size={22} color={roleUi.iconColor} />
        </View>
        <View style={styles.cardBody}>
          <View style={[styles.roleBadge, roleUi.badge]}>
            <Icon
              name={roleUi.icon}
              size={12}
              color={roleUi.iconColor}
              style={styles.roleBadgeIcon}
            />
            <Text style={[styles.roleBadgeText, roleUi.badgeText]}>
              {roleLabel}
            </Text>
          </View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
          {canManage ? (
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
          ) : null}
          <Text style={styles.branch}>{branchLabel}</Text>
          {canManage && item.role === 'manager' ? (
            <Text style={styles.permissionGranted}>
              Branch sales + employees · No approvals
            </Text>
          ) : null}
        </View>
        {canManage ? (
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
        ) : null}
      </View>
    </View>
  );
};

const AdminAdminsScreen = () => {
  const {
    navigation,
    canManageStaff,
    staff,
    loading,
    branchName,
    loadStaff,
    handleDelete,
  } = useController();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <AdminMenuButton />
        <Text style={styles.headerTitle}>
          {canManageStaff ? 'Manage Staff' : 'Branch Employees'}
        </Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          {canManageStaff
            ? 'Create manager, cashier, or kitchen accounts and assign each to a branch. Only super admin can approve price changes.'
            : 'View cashier and kitchen staff for your branch. Only super admin can add/edit employees or approve requests.'}
        </Text>
      </View>

      <FlatList
        data={staff}
        keyExtractor={item => item.email}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={() => {
          void loadStaff();
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No employees yet</Text>
            <Text style={styles.emptySubtitle}>
              {canManageStaff
                ? 'Add a manager, cashier, or kitchen account for a branch.'
                : 'No cashier or kitchen staff assigned to your branch yet.'}
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <StaffCard
            item={item}
            branchLabel={branchName(item.branchId)}
            canManage={canManageStaff}
            onEdit={() =>
              navigation.navigate('AdminAdminForm', {email: item.email})
            }
            onDelete={() => handleDelete(item)}
          />
        )}
      />

      {canManageStaff ? (
        <Pressable
          accessibilityLabel="Add staff"
          accessibilityRole="button"
          style={styles.fab}
          onPress={() => navigation.navigate('AdminAdminForm', {})}>
          <Icon name="plus" size={22} color="#FFFFFF" />
          <Text style={styles.fabText}>Add staff</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
};

export default AdminAdminsScreen;
