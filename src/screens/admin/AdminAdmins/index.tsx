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
import {
  staffRoleLabel,
  type StoredUser,
} from '../../../storage/authStorage';
import {styles} from './styles';
import useController from './useController';

const StaffCard = ({
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
  const roleLabel = staffRoleLabel(item.role);

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardBody}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{roleLabel}</Text>
          </View>
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
          {item.role === 'manager' ? (
            <Text
              style={
                item.canViewRevenue
                  ? styles.permissionGranted
                  : styles.permissionDenied
              }>
              {item.canViewRevenue
                ? 'Revenue access: allowed'
                : 'Revenue access: not allowed'}
            </Text>
          ) : null}
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
  const {
    navigation,
    staff,
    loading,
    branchName,
    loadStaff,
    handleDelete,
    handleBack,
  } = useController();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleBack}>
          <Icon name="arrow-left" size={22} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Manage Staff</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Create manager, cashier, or kitchen accounts and assign each to a
          branch. Saved on this device until backend is connected.
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
            <Text style={styles.emptyTitle}>No staff yet</Text>
            <Text style={styles.emptySubtitle}>
              Add a manager, cashier, or kitchen account for a branch.
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <StaffCard
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
        accessibilityLabel="Add staff"
        accessibilityRole="button"
        style={styles.fab}
        onPress={() => navigation.navigate('AdminAdminForm', {})}>
        <Icon name="plus" size={22} color="#FFFFFF" />
        <Text style={styles.fabText}>Add staff</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default AdminAdminsScreen;
