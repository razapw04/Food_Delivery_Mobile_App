import AsyncStorage from '@react-native-async-storage/async-storage';
import type {MenuItem} from '../screens/user/Menu/model';

const ADMIN_PRODUCTS_KEY = '@food_app/admin_products';

export type AdminProduct = MenuItem;

export const getAdminProducts = async (): Promise<AdminProduct[] | null> => {
  const raw = await AsyncStorage.getItem(ADMIN_PRODUCTS_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed as AdminProduct[];
  } catch {
    return null;
  }
};

export const saveAdminProducts = async (
  products: AdminProduct[],
): Promise<void> => {
  await AsyncStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
};

export const upsertAdminProduct = async (
  product: AdminProduct,
  seed: AdminProduct[],
): Promise<AdminProduct[]> => {
  const existing = (await getAdminProducts()) ?? seed;
  const index = existing.findIndex(item => item.id === product.id);
  const next =
    index >= 0
      ? existing.map((item, i) => (i === index ? product : item))
      : [product, ...existing];
  await saveAdminProducts(next);
  return next;
};

export const removeAdminProduct = async (
  productId: string,
  seed: AdminProduct[],
): Promise<AdminProduct[]> => {
  const existing = (await getAdminProducts()) ?? seed;
  const next = existing.filter(item => item.id !== productId);
  await saveAdminProducts(next);
  return next;
};

export const formatAdminPrice = (amount: number): string =>
  `Rs. ${amount.toLocaleString('en-PK')}`;

export const parseAdminPrice = (value: string): number => {
  const digits = value.replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
};
