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
  formatAdminPrice,
  getAdminProducts,
  parseAdminPrice,
  type AdminProduct,
} from '../../storage/adminProductsStorage';
import {createPriceChangeRequest} from '../../storage/priceChangeRequestsStorage';
import type {RootStackParamList} from '../../types/navigation';
import {styles} from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminPriceRequest'>;

const AdminPriceRequestScreen = ({navigation, route}: Props) => {
  const {isAdmin, isSuperAdmin, user} = useAuth();
  const {menuItems} = useCatalog();
  const productId = route.params.productId;

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [priceInput, setPriceInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin || isSuperAdmin) {
      navigation.replace(isSuperAdmin ? 'AdminProducts' : 'AdminOrders');
    }
  }, [isAdmin, isSuperAdmin, navigation]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const stored = (await getAdminProducts()) ?? menuItems;
      const found = stored.find(item => item.id === productId) ?? null;
      if (!cancelled) {
        setProduct(found);
        if (found) {
          setPriceInput(String(parseAdminPrice(found.price) || ''));
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [menuItems, productId]);

  const canSubmit = useMemo(() => {
    if (!product || saving) {
      return false;
    }
    const amount = parseAdminPrice(priceInput);
    return amount > 0 && formatAdminPrice(amount) !== product.price;
  }, [priceInput, product, saving]);

  const handleSubmit = async () => {
    if (!product || !user || !canSubmit) {
      return;
    }

    setSaving(true);
    try {
      const result = await createPriceChangeRequest({
        product,
        requestedAmount: parseAdminPrice(priceInput),
        requestedByEmail: user.email,
        requestedByName: user.name,
        branchId: user.branchId,
      });

      if (!result.ok) {
        Alert.alert('Request failed', result.error);
        return;
      }

      Alert.alert(
        'Request sent',
        'Price change is waiting for super admin approval. It will apply only after approval.',
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
        <Text style={styles.headerTitle}>Request price change</Text>
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
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Branch admins cannot update prices directly. Super admin must
              approve this request first.
            </Text>
          </View>

          {product ? (
            <>
              <View style={styles.card}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.meta}>{product.description}</Text>
                <Text style={styles.currentPrice}>
                  Current: {product.price}
                </Text>
              </View>

              <Text style={styles.label}>Requested price (PKR)</Text>
              <TextInput
                style={styles.input}
                value={priceInput}
                onChangeText={setPriceInput}
                placeholder="e.g. 1499"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
              />
              <Text style={styles.hint}>
                Preview: {formatAdminPrice(parseAdminPrice(priceInput) || 0)}
              </Text>

              <Pressable
                accessibilityRole="button"
                style={[
                  styles.saveButton,
                  !canSubmit && styles.saveButtonDisabled,
                ]}
                disabled={!canSubmit}
                onPress={() => {
                  void handleSubmit();
                }}>
                <Text style={styles.saveButtonText}>
                  {saving ? 'Sending...' : 'Send for approval'}
                </Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.card}>
              <Text style={styles.productName}>Product not found</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminPriceRequestScreen;
