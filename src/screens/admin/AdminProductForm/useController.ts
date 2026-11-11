import {useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import {useAuth} from '../../../context/AuthContext';
import {useCatalog} from '../../../context/CatalogContext';
import {
  formatAdminPrice,
  getAdminProducts,
  parseAdminPrice,
  upsertAdminProduct,
} from '../../../storage/adminProductsStorage';
import type {RootStackParamList} from '../../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminProductForm'>;
type Route = RouteProp<RootStackParamList, 'AdminProductForm'>;

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';

const useController = (navigation: Nav, route: Route) => {
  const {isSuperAdmin} = useAuth();
  const {menuItems, menuCategories, refreshCatalog} = useCatalog();
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
      navigation.replace('AdminTabs', {screen: 'AdminProducts'});
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

  const pricePreview = formatAdminPrice(parseAdminPrice(priceInput) || 0);

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
      await refreshCatalog();
      Alert.alert(
        isEditing ? 'Product updated' : 'Product added',
        'Saved on this device. Customer menu and POS are updated too.',
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    } catch {
      Alert.alert('Save failed', "Couldn't save product. Please try again.");
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
    description,
    setDescription,
    priceInput,
    setPriceInput,
    categoryId,
    setCategoryId,
    image,
    setImage,
    saving,
    canSave,
    pricePreview,
    menuCategories,
    handleSave,
    handleBack,
  };
};

export default useController;
