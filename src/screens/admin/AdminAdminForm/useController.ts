import {useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {
  createAdminAccount,
  getStoredUserByEmail,
  isStaffAccountRole,
  staffRoleLabel,
  updateAdminAccount,
  type StaffAccountRole,
} from '../../../storage/authStorage';
import type {RootStackParamList} from '../../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminAdminForm'>;
type Route = RouteProp<RootStackParamList, 'AdminAdminForm'>;

export const MAX_PHONE_LENGTH = 13;

export const STAFF_ROLE_OPTIONS: StaffAccountRole[] = [
  'manager',
  'cashier',
  'kitchen',
];

const useController = (navigation: Nav, route: Route) => {
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
  const [role, setRole] = useState<StaffAccountRole>(
    route.params?.role ?? 'manager',
  );
  const [canViewRevenue, setCanViewRevenue] = useState(false);
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
      if (!existing || !isStaffAccountRole(existing.role) || cancelled) {
        return;
      }
      setName(existing.name);
      setEmail(existing.email);
      setPhone(existing.phone.slice(0, MAX_PHONE_LENGTH));
      setPassword(existing.password);
      setConfirmPassword(existing.password);
      setRole(existing.role);
      setCanViewRevenue(Boolean(existing.canViewRevenue));
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

  const roleTitle = staffRoleLabel(role);

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, '').slice(0, MAX_PHONE_LENGTH);
    setPhone(cleaned);
  };

  const handleSave = async () => {
    if (!canSave) {
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      Alert.alert(
        'Password mismatch',
        'Password and confirm password must match.',
      );
      return;
    }

    setSaving(true);
    try {
      const revenueAccess = role === 'manager' ? canViewRevenue : false;
      const result = isEditing
        ? await updateAdminAccount({
            email: editingEmail!,
            name,
            phone,
            password: password.trim(),
            branchId,
            role,
            canViewRevenue: revenueAccess,
          })
        : await createAdminAccount({
            name,
            email,
            phone,
            password: password.trim(),
            branchId,
            role,
            canViewRevenue: revenueAccess,
          });

      if (!result.ok) {
        Alert.alert('Save failed', result.error);
        return;
      }

      Alert.alert(
        isEditing ? `${roleTitle} updated` : `${roleTitle} access granted`,
        isEditing
          ? `${roleTitle} credentials and branch assignment were updated on this device.`
          : `This ${roleTitle.toLowerCase()} can now log in with the credentials you set for their assigned branch.`,
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return {
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
    canViewRevenue,
    setCanViewRevenue,
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
  };
};

export default useController;
