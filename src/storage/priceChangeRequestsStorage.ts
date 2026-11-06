import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  formatAdminPrice,
  getAdminProducts,
  parseAdminPrice,
  upsertAdminProduct,
  type AdminProduct,
} from './adminProductsStorage';

const REQUESTS_KEY = '@food_app/price_change_requests';

export type PriceChangeStatus = 'pending' | 'approved' | 'rejected';

export type PriceChangeRequest = {
  id: string;
  productId: string;
  productName: string;
  currentPrice: string;
  requestedPrice: string;
  requestedByEmail: string;
  requestedByName: string;
  branchId: string | null;
  status: PriceChangeStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewNote?: string;
};

const readAll = async (): Promise<PriceChangeRequest[]> => {
  const raw = await AsyncStorage.getItem(REQUESTS_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PriceChangeRequest[]) : [];
  } catch {
    return [];
  }
};

const writeAll = async (items: PriceChangeRequest[]) => {
  await AsyncStorage.setItem(REQUESTS_KEY, JSON.stringify(items));
};

export const listPriceChangeRequests = async (): Promise<
  PriceChangeRequest[]
> => {
  const items = await readAll();
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

export const listPendingPriceChangeRequests = async (): Promise<
  PriceChangeRequest[]
> => {
  const items = await listPriceChangeRequests();
  return items.filter(item => item.status === 'pending');
};

export const createPriceChangeRequest = async (payload: {
  product: AdminProduct;
  requestedAmount: number;
  requestedByEmail: string;
  requestedByName: string;
  branchId: string | null;
}): Promise<{ok: true} | {ok: false; error: string}> => {
  const amount = Math.round(payload.requestedAmount);
  if (amount <= 0) {
    return {ok: false, error: 'Enter a valid price greater than 0.'};
  }

  const requestedPrice = formatAdminPrice(amount);
  if (requestedPrice === payload.product.price) {
    return {ok: false, error: 'New price is the same as current price.'};
  }

  const existing = await readAll();
  const hasPending = existing.some(
    item =>
      item.productId === payload.product.id &&
      item.requestedByEmail === payload.requestedByEmail.toLowerCase() &&
      item.status === 'pending',
  );
  if (hasPending) {
    return {
      ok: false,
      error: 'You already have a pending request for this product.',
    };
  }

  const next: PriceChangeRequest = {
    id: `pcr-${Date.now()}`,
    productId: payload.product.id,
    productName: payload.product.name,
    currentPrice: payload.product.price,
    requestedPrice,
    requestedByEmail: payload.requestedByEmail.trim().toLowerCase(),
    requestedByName: payload.requestedByName.trim(),
    branchId: payload.branchId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  await writeAll([next, ...existing]);
  return {ok: true};
};

export const reviewPriceChangeRequest = async (payload: {
  requestId: string;
  decision: 'approved' | 'rejected';
  seedProducts: AdminProduct[];
  note?: string;
}): Promise<{ok: true} | {ok: false; error: string}> => {
  const items = await readAll();
  const index = items.findIndex(item => item.id === payload.requestId);
  if (index < 0) {
    return {ok: false, error: 'Request not found.'};
  }

  const request = items[index];
  if (request.status !== 'pending') {
    return {ok: false, error: 'This request was already reviewed.'};
  }

  if (payload.decision === 'approved') {
    const products = (await getAdminProducts()) ?? payload.seedProducts;
    const product = products.find(item => item.id === request.productId);
    if (!product) {
      return {ok: false, error: 'Product no longer exists.'};
    }
    await upsertAdminProduct(
      {...product, price: request.requestedPrice},
      payload.seedProducts,
    );
  }

  const next = [...items];
  next[index] = {
    ...request,
    status: payload.decision,
    reviewedAt: new Date().toISOString(),
    reviewNote: payload.note?.trim() || undefined,
  };
  await writeAll(next);
  return {ok: true};
};

export const countPendingPriceChangeRequests = async (): Promise<number> => {
  const pending = await listPendingPriceChangeRequests();
  return pending.length;
};

export {parseAdminPrice};
