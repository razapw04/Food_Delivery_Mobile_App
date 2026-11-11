import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {staffRoleLabel} from '../../../storage/authStorage';
import type {RootStackParamList} from '../../../types/navigation';
import {styles} from './styles';
import useController, {
  MAX_PHONE_LENGTH,
  STAFF_ROLE_OPTIONS,
} from './useController';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminAdminForm'>;

const AdminAdminFormScreen = ({navigation, route}: Props) => {
  const {
    isEditing,
    name,
    setName,
    email,
    setEmail,
    phone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    role,
    setRole,
    roleTitle,
    branchId,
    setBranchId,
    saving,
    canSave,
    passwordsMatch,
    branches,
    handlePhoneChange,
    handleSave,
    handleBack,
  } = useController(navigation, route);

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
        <Text style={styles.headerTitle}>
          {isEditing ? `Edit ${roleTitle}` : `Add ${roleTitle}`}
        </Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Role</Text>
          <View style={styles.roleRows}>
            {STAFF_ROLE_OPTIONS.map(option => {
              const active = option === role;
              const meta =
                option === 'manager'
                  ? {
                      icon: 'account-tie',
                      row: styles.roleRowManager,
                      rowActive: styles.roleRowManagerActive,
                      iconWrap: styles.roleIconManager,
                      color: '#1D4ED8',
                    }
                  : option === 'cashier'
                    ? {
                        icon: 'cash-register',
                        row: styles.roleRowCashier,
                        rowActive: styles.roleRowCashierActive,
                        iconWrap: styles.roleIconCashier,
                        color: '#C2410C',
                      }
                    : {
                        icon: 'chef-hat',
                        row: styles.roleRowKitchen,
                        rowActive: styles.roleRowKitchenActive,
                        iconWrap: styles.roleIconKitchen,
                        color: '#15803D',
                      };
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{selected: active, disabled: isEditing}}
                  style={[
                    styles.roleRow,
                    meta.row,
                    active && meta.rowActive,
                    isEditing && !active && styles.roleRowDisabled,
                  ]}
                  onPress={() => setRole(option)}
                  disabled={isEditing}>
                  <View style={[styles.roleIconWrap, meta.iconWrap]}>
                    <Icon name={meta.icon} size={20} color={meta.color} />
                  </View>
                  <Text
                    style={[
                      styles.roleRowText,
                      {color: meta.color},
                      active && styles.roleRowTextActive,
                    ]}>
                    {staffRoleLabel(option)}
                  </Text>
                  {active ? (
                    <Icon name="check-circle" size={18} color={meta.color} />
                  ) : (
                    <View style={styles.roleRowSpacer} />
                  )}
                </Pressable>
              );
            })}
          </View>
          {isEditing ? (
            <Text style={styles.hint}>
              Role cannot be changed while editing. Remove and recreate to
              switch roles.
            </Text>
          ) : null}

          {role === 'manager' ? (
            <View style={styles.permissionRow}>
              <View style={styles.permissionCopy}>
                <Text style={styles.label}>Manager permissions</Text>
                <Text style={styles.permissionHint}>
                  Can view branch employees and branch sales. Cannot approve
                  price-change requests — only super admin can approve.
                </Text>
              </View>
            </View>
          ) : null}

          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={`${roleTitle} name`}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, isEditing && styles.inputDisabled]}
            value={email}
            onChangeText={setEmail}
            placeholder={`${role}@branch.com`}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!isEditing}
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={handlePhoneChange}
            placeholder="03XXXXXXXXX"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            maxLength={MAX_PHONE_LENGTH}
          />
          <Text style={styles.hint}>
            Max {MAX_PHONE_LENGTH} characters ({phone.length}/{MAX_PHONE_LENGTH})
          </Text>

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="Min 6 characters"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              accessibilityLabel={
                showPassword ? 'Hide password' : 'Show password'
              }
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setShowPassword(prev => !prev)}
              style={styles.eyeButton}>
              <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#858B87"
              />
            </Pressable>
          </View>

          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              accessibilityLabel={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setShowConfirmPassword(prev => !prev)}
              style={styles.eyeButton}>
              <Icon
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#858B87"
              />
            </Pressable>
          </View>
          {confirmPassword.length > 0 && !passwordsMatch ? (
            <Text style={styles.errorText}>Passwords do not match.</Text>
          ) : (
            <Text style={styles.hint}>
              {isEditing
                ? 'Current password is loaded. Confirm again if you change it.'
                : `${roleTitle} will use this email and password to log in.`}
            </Text>
          )}

          <Text style={styles.label}>Assigned branch</Text>
          <View style={styles.chipsRow}>
            {branches.map(branch => {
              const active = branch.id === branchId;
              return (
                <Pressable
                  key={branch.id}
                  accessibilityRole="button"
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setBranchId(branch.id)}>
                  <Text
                    style={[styles.chipText, active && styles.chipTextActive]}>
                    {branch.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            disabled={!canSave}
            onPress={() => {
              void handleSave();
            }}>
            <Text style={styles.saveButtonText}>
              {saving
                ? 'Saving...'
                : isEditing
                  ? `Update ${roleTitle}`
                  : `Grant ${roleTitle} access`}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminAdminFormScreen;
