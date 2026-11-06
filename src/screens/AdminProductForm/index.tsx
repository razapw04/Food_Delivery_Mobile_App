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
  formatAdminPrice,
  getAdminProducts,
  parseAdminPrice,
  upsertAdminProduct,
} from '../../storage/adminProductsStorage';
import type {RootStackParamList} from '../../types/navigation';
import {styles} from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminProductForm'>;

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';

const AdminProductFormScreen = ({navigation, route}: Props) => {
  const {isSuperAdmin} = useAuth();
  const {menuItems, menuCategories} = useCatalog();
  const productId = route.params?.productId;
  const isEditing = Boolean(productId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [categoryId, setCategoryId] = useState(menuCategories[0]?.id ?? '');
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin) {
      navigation.replace('AdminOrders');
    }
  }, [isSuperAdmin, navigation]);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      if (!productId) {
        return;
      }
      const stored = (await getAdminProducts()) ?? menuItems;
      const existing = stored.find(item => item.id === productId);
      if (!existing || cancelled) {
        return;
      }
      setName(existing.name);
      setDescription(existing.description);
      setPriceInput(String(parseAdminPrice(existing.price) || ''));
      setCategoryId(existing.categoryId);
      setImage(existing.image);
    };

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [menuItems, productId]);

  const canSave = useMemo(() => {
    return (
      name.trim().length > 0 &&
      description.trim().length > 0 &&
      parseAdminPrice(priceInput) > 0 &&
      categoryId.length > 0 &&
      !saving
    );
  }, [categoryId, description, name, priceInput, saving]);

  const handleSave = async () => {
    if (!canSave) {
      return;
    }

    setSaving(true);
    try {
      const amount = parseAdminPrice(priceInput);
      const product = {
        id: productId ?? `local-${Date.now()}`,
        categoryId,
        name: name.trim(),
        description: description.trim(),
        price: formatAdminPrice(amount),
        image: image.trim() || DEFAULT_IMAGE,
      };

      await upsertAdminProduct(product, menuItems);
      Alert.alert(
        isEditing ? 'Product updated' : 'Product added',
        'Saved on this device. Backend sync will be added later.',
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    } catch {
      Alert.alert('Save failed', "Couldn't save product. Please try again.");
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
          {isEditing ? 'Edit product' : 'Add product'}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Product name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Margherita"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Short description"
          placeholderTextColor="#9CA3AF"
          multiline
        />

        <Text style={styles.label}>Price (PKR)</Text>
        <TextInput
          style={styles.input}
          value={priceInput}
          onChangeText={setPriceInput}
          placeholder="e.g. 1299"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
        />
        <Text style={styles.hint}>
          Preview: {formatAdminPrice(parseAdminPrice(priceInput) || 0)}
        </Text>

        <Text style={styles.label}>Category</Text>
        <View style={styles.chipsRow}>
          {menuCategories.map(category => {
            const active = category.id === categoryId;
            return (
              <Pressable
                key={category.id}
                accessibilityRole="button"
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setCategoryId(category.id)}>
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}>
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          value={image}
          onChangeText={setImage}
          placeholder="https://..."
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Pressable
          accessibilityRole="button"
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          disabled={!canSave}
          onPress={() => {
            void handleSave();
          }}>
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : isEditing ? 'Update product' : 'Add product'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminProductFormScreen;
