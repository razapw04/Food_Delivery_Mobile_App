import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
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

const AdminAdminFormScreen = ({navigation, route}: Props) => {
  const {isSuperAdmin} = useAuth();
  const {branches} = useCatalog();
  const editingEmail = route.params?.email;
  const isEditing = Boolean(editingEmail);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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
      setPhone(existing.phone);
      setBranchId(existing.branchId ?? branches[0]?.id ?? '');
    };

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [branches, editingEmail]);

  const canSave = useMemo(() => {
    if (!name.trim() || !branchId || saving) {
      return false;
    }
    if (isEditing) {
      return true;
    }
    return email.trim().length > 0 && password.length >= 6;
  }, [branchId, email, isEditing, name, password, saving]);

  const handleSave = async () => {
    if (!canSave) {
      return;
    }

    setSaving(true);
    try {
      const result = isEditing
        ? await updateAdminAccount({
            email: editingEmail!,
            name,
            phone,
            password: password.trim() || undefined,
            branchId,
          })
        : await createAdminAccount({
            name,
            email,
            phone,
            password,
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

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
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
          onChangeText={setPhone}
          placeholder="03XXXXXXXXX"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>
          {isEditing ? 'New password (optional)' : 'Password'}
        </Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder={isEditing ? 'Leave blank to keep current' : 'Min 6 characters'}
          placeholderTextColor="#9CA3AF"
          secureTextEntry
        />
        {!isEditing ? (
          <Text style={styles.hint}>Admin will use this email and password to log in.</Text>
        ) : null}

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
    </SafeAreaView>
  );
};

export default AdminAdminFormScreen;
