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
  type AdminProduct,
} from '../../../storage/adminProductsStorage';
import {createPriceChangeRequest} from '../../../storage/priceChangeRequestsStorage';
import type {RootStackParamList} from '../../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminPriceRequest'>;
type Route = RouteProp<RootStackParamList, 'AdminPriceRequest'>;

const useController = (navigation: Nav, route: Route) => {
  const {isAdmin, isSuperAdmin, user} = useAuth();
  const {menuItems} = useCatalog();
  const productId = route.params.productId;

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [priceInput, setPriceInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin || isSuperAdmin) {
      navigation.replace('AdminTabs', {
        screen: 'AdminProducts',
      });
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

  const pricePreview = formatAdminPrice(parseAdminPrice(priceInput) || 0);

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
        'Suggestion sent',
        'Your suggested price is waiting for super admin review. They can approve a different final price.',
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
    product,
    priceInput,
    setPriceInput,
    saving,
    canSubmit,
    pricePreview,
    handleSubmit,
    handleBack,
  };
};

export default useController;
