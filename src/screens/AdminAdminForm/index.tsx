import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
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
import {useAuth} from '../../context/AuthContext';
import {useCatalog} from '../../context/CatalogContext';
import {
  createAdminAccount,
  getStoredUserByEmail,
  updateAdminAccount,
} from '../../storage/authStorage';
import type {RootStackParamList} from '../../types/navigation';
import {styles} from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminAdminForm'>;

const MAX_PHONE_LENGTH = 13;

const AdminAdminFormScreen = ({navigation, route}: Props) => {
  const {isSuperAdmin} = useAuth();
  const {branches} = useCatalog();
  const editingEmail = route.params?.email;
  const isEditing = Boolean(editingEmail);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [branchId, setBranchId] = useState(branches[0]?.id ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin) {
      navigation.replace('AdminOrders');
    }
  }, [isSuperAdmin, navigation]);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      if (!editingEmail) {
        return;
      }
      const existing = await getStoredUserByEmail(editingEmail);
      if (!existing || existing.role !== 'admin' || cancelled) {
        return;
      }
      setName(existing.name);
      setEmail(existing.email);
      setPhone(existing.phone.slice(0, MAX_PHONE_LENGTH));
      setPassword(existing.password);
      setConfirmPassword(existing.password);
      setBranchId(existing.branchId ?? branches[0]?.id ?? '');
    };

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [branches, editingEmail]);

  const passwordsMatch =
    password.trim().length > 0 && password.trim() === confirmPassword.trim();

  const canSave = useMemo(() => {
    if (!name.trim() || !branchId || saving) {
      return false;
    }
    if (password.trim().length < 6 || !passwordsMatch) {
      return false;
    }
    return isEditing || email.trim().length > 0;
  }, [
    branchId,
    email,
    isEditing,
    name,
    password,
    passwordsMatch,
    saving,
  ]);

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, '').slice(0, MAX_PHONE_LENGTH);
    setPhone(cleaned);
  };

  const handleSave = async () => {
    if (!canSave) {
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      Alert.alert('Password mismatch', 'Password and confirm password must match.');
      return;
    }

    setSaving(true);
    try {
      const result = isEditing
        ? await updateAdminAccount({
            email: editingEmail!,
            name,
            phone,
            password: password.trim(),
            branchId,
          })
        : await createAdminAccount({
            name,
            email,
            phone,
            password: password.trim(),
            branchId,
          });

      if (!result.ok) {
        Alert.alert('Save failed', result.error);
        return;
      }

      Alert.alert(
        isEditing ? 'Admin updated' : 'Admin access granted',
        isEditing
          ? 'Admin credentials and branch assignment were updated on this device.'
          : 'This admin can now log in with the credentials you set. They will only see their assigned branch revenue.',
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    } finally {
      setSaving(false);
    }
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
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit admin' : 'Add admin'}
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
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Admin name"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, isEditing && styles.inputDisabled]}
            value={email}
            onChangeText={setEmail}
            placeholder="admin@branch.com"
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
                : 'Admin will use this email and password to log in.'}
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
                  ? 'Update admin'
                  : 'Grant admin access'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminAdminFormScreen;
