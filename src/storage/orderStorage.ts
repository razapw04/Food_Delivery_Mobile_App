import AsyncStorage from '@react-native-async-storage/async-storage';
import type {CartItem} from '../context/CartContext';

const ORDERS_KEY = '@food_app/orders';

export type StoredPaymentMethod = 'cod' | 'card' | 'jazzcash';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'On the way'
  | 'Delivered'
  | 'Cancelled';

/** App/user orders vs cashier POS counter orders. */
export type OrderChannel = 'online' | 'pos';

export type StoredOrder = {
  id: string;
  orderId: string;
  createdAt: string;
  updatedAt?: string;
  customerEmail: string;
  customerName: string;
  items: CartItem[];
  productTotal: number;
  discount: number;
  deliveryFee: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: StoredPaymentMethod;
  deliveryAddress: string;
  deliveryInstructions: string;
  orderMode: 'delivery' | 'pickup' | 'dine_in';
  /** Branch that should fulfill this order (pickup branch or assigned kitchen). */
  branchId: string | null;
  /** online = customer app; pos = cashier counter. */
  orderChannel: OrderChannel;
  /**
   * Dine-in only: tab stays open so cashier can add items mid-meal.
   * Cashier closes the tab when the guest finishes.
   */
  tabOpen?: boolean;
  /** Dine-in / POS table identifier, e.g. "12" or "A3". */
  tableNo?: string | null;
  /** Waiter / staff who took the order. */
  waiterName?: string | null;
  status: OrderStatus;
};

export type OrderMode = StoredOrder['orderMode'];

export const resolveOrderMode = (
  value: unknown,
): OrderMode => {
  if (value === 'pickup' || value === 'dine_in' || value === 'delivery') {
    return value;
  }
  return 'delivery';
};

export const isOpenDineInTab = (
  order: Pick<StoredOrder, 'orderMode' | 'tabOpen' | 'status'> | null | undefined,
): boolean => {
  if (!order || order.orderMode !== 'dine_in') {
    return false;
  }
  if (order.status === 'Delivered' || order.status === 'Cancelled') {
    return false;
  }
  return order.tabOpen !== false;
};

export const resolveOrderChannel = (
  order: Partial<StoredOrder> | null | undefined,
): OrderChannel => {
  if (order?.orderChannel === 'pos' || order?.orderChannel === 'online') {
    return order.orderChannel;
  }
  const email = (order?.customerEmail ?? '').toLowerCase();
  const instructions = (order?.deliveryInstructions ?? '').toLowerCase();
  if (email.startsWith('pos+') || instructions.includes('pos walk-in')) {
    return 'pos';
  }
  return 'online';
};

const normalizeStoredOrder = (order: Partial<StoredOrder>): StoredOrder => {
  const status = order.status ?? 'Pending';
  const orderMode = resolveOrderMode(order.orderMode);
  const closed = status === 'Delivered' || status === 'Cancelled';
  return {
    id: order.id ?? '',
    orderId: order.orderId ?? '',
    createdAt: order.createdAt ?? new Date().toISOString(),
    updatedAt: order.updatedAt,
    customerEmail: (order.customerEmail ?? '').toLowerCase(),
    customerName: order.customerName ?? 'Customer',
    items: Array.isArray(order.items) ? order.items : [],
    productTotal: Number(order.productTotal) || 0,
    discount: Number(order.discount) || 0,
    deliveryFee: Number(order.deliveryFee) || 0,
    taxPercent: Number(order.taxPercent) || 0,
    taxAmount: Number(order.taxAmount) || 0,
    totalAmount: Number(order.totalAmount) || 0,
    paymentMethod: order.paymentMethod ?? 'cod',
    deliveryAddress: order.deliveryAddress ?? '',
    deliveryInstructions: order.deliveryInstructions ?? '',
    orderMode,
    branchId: order.branchId ?? null,
    orderChannel: resolveOrderChannel(order),
    tabOpen:
      orderMode === 'dine_in' ? (order.tabOpen ?? !closed) && !closed : false,
    tableNo:
      typeof order.tableNo === 'string' && order.tableNo.trim()
        ? order.tableNo.trim()
        : null,
    waiterName:
      typeof order.waiterName === 'string' && order.waiterName.trim()
        ? order.waiterName.trim()
        : null,
    status,
  };
};

const mergeCartItems = (
  existing: CartItem[],
  incoming: CartItem[],
): CartItem[] => {
  const next = [...existing];
  incoming.forEach(item => {
    const index = next.findIndex(
      row =>
        row.productId === item.productId &&
        row.variation === item.variation &&
        [...row.toppings].sort().join('|') ===
          [...item.toppings].sort().join('|'),
    );
    if (index >= 0) {
      next[index] = {
        ...next[index],
        quantity: next[index].quantity + item.quantity,
      };
      return;
    }
    next.push({
      ...item,
      id: item.id || `pos-${item.productId}-${Date.now()}`,
    });
  });
  return next;
};

const recalcTotals = (
  items: CartItem[],
  taxPercent: number,
  discount: number,
  deliveryFee: number,
) => {
  const productTotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const taxAmount = Math.round((productTotal * taxPercent) / 100);
  const totalAmount = productTotal - discount + deliveryFee + taxAmount;
  return {productTotal, taxAmount, totalAmount};
};

const readOrders = async (): Promise<StoredOrder[]> => {
  const raw = await AsyncStorage.getItem(ORDERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredOrder>[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map(item => normalizeStoredOrder(item));
  } catch {
    return [];
  }
};

const writeOrders = async (orders: StoredOrder[]) => {
  await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

const createOrderIds = () => {
  const stamp = Date.now();
  const suffix = Math.floor(Math.random() * 900 + 100);
  return {
    id: `ord_${stamp}_${suffix}`,
    orderId: `FD-${stamp.toString().slice(-6)}${suffix}`,
  };
};

export const getStoredOrders = async (
  userEmail?: string | null,
): Promise<StoredOrder[]> => {
  if (!userEmail?.trim()) {
    return [];
  }

  const email = userEmail.trim().toLowerCase();
  const orders = await readOrders();
  return orders
    .filter(order => order.customerEmail === email)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

export const getAllStoredOrders = async (): Promise<StoredOrder[]> => {
  const orders = await readOrders();
  return orders.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

export const saveStoredOrder = async (
  order: Omit<
    StoredOrder,
    | 'id'
    | 'orderId'
    | 'createdAt'
    | 'updatedAt'
    | 'status'
    | 'orderChannel'
    | 'tabOpen'
    | 'tableNo'
    | 'waiterName'
  > &
    Partial<
      Pick<
        StoredOrder,
        | 'id'
        | 'orderId'
        | 'createdAt'
        | 'updatedAt'
        | 'status'
        | 'orderChannel'
        | 'tabOpen'
        | 'tableNo'
        | 'waiterName'
      >
    >,
  userEmail: string,
): Promise<StoredOrder> => {
  const email = userEmail.trim().toLowerCase();
  if (!email) {
    throw new Error('You must be signed in to place an order.');
  }

  const now = new Date().toISOString();
  const ids = createOrderIds();
  const orderMode = resolveOrderMode(order.orderMode);
  const status = order.status ?? 'Pending';
  const nextOrder: StoredOrder = normalizeStoredOrder({
    id: order.id ?? ids.id,
    orderId: order.orderId ?? ids.orderId,
    createdAt: order.createdAt ?? now,
    updatedAt: order.updatedAt ?? now,
    customerEmail: order.customerEmail?.trim().toLowerCase() || email,
    customerName: order.customerName?.trim() || 'Customer',
    items: order.items,
    productTotal: order.productTotal,
    discount: order.discount,
    deliveryFee: order.deliveryFee,
    taxPercent: order.taxPercent,
    taxAmount: order.taxAmount,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    deliveryAddress: order.deliveryAddress,
    deliveryInstructions: order.deliveryInstructions,
    orderMode,
    branchId: order.branchId ?? null,
    orderChannel: resolveOrderChannel({
      ...order,
      customerEmail: order.customerEmail?.trim().toLowerCase() || email,
      deliveryInstructions: order.deliveryInstructions,
    }),
    tabOpen:
      orderMode === 'dine_in'
        ? (order.tabOpen ??
          (status !== 'Delivered' && status !== 'Cancelled'))
        : false,
    tableNo: order.tableNo,
    waiterName: order.waiterName,
    status,
  });

  const orders = await readOrders();
  orders.unshift(nextOrder);
  await writeOrders(orders);
  return nextOrder;
};

export const getStoredOrderById = async (
  orderId: string,
): Promise<StoredOrder | null> => {
  const orders = await readOrders();
  return (
    orders.find(order => order.id === orderId || order.orderId === orderId) ??
    null
  );
};

/** Add items to an open dine-in tab; kitchen sees the updated ticket. */
export const appendItemsToStoredOrder = async (
  orderId: string,
  newItems: CartItem[],
): Promise<StoredOrder> => {
  if (!newItems.length) {
    throw new Error('Add at least one item.');
  }

  const orders = await readOrders();
  const index = orders.findIndex(
    order => order.id === orderId || order.orderId === orderId,
  );
  if (index < 0) {
    throw new Error('Order not found.');
  }

  const existing = orders[index];
  if (!isOpenDineInTab(existing)) {
    throw new Error('Only open dine-in tabs can accept more items.');
  }

  const items = mergeCartItems(existing.items ?? [], newItems);
  const {productTotal, taxAmount, totalAmount} = recalcTotals(
    items,
    existing.taxPercent,
    existing.discount,
    existing.deliveryFee,
  );

  // New items need kitchen attention again.
  const nextStatus: OrderStatus =
    existing.status === 'Cancelled' || existing.status === 'Delivered'
      ? existing.status
      : 'Confirmed';

  const updated: StoredOrder = normalizeStoredOrder({
    ...existing,
    items,
    productTotal,
    taxAmount,
    totalAmount,
    status: nextStatus,
    tabOpen: true,
    updatedAt: new Date().toISOString(),
  });
  orders[index] = updated;
  await writeOrders(orders);
  return updated;
};

export type OpenDineInTabUpdate = {
  items: CartItem[];
  customerName?: string;
  tableNo?: string;
  waiterName?: string;
  paymentMethod?: StoredPaymentMethod;
};

/**
 * Full edit of an open dine-in tab (items + guest details) until bill is paid / tab closed.
 */
export const updateOpenDineInTab = async (
  orderId: string,
  patch: OpenDineInTabUpdate,
): Promise<StoredOrder> => {
  if (!patch.items.length) {
    throw new Error('Keep at least one item on the open tab.');
  }

  const orders = await readOrders();
  const index = orders.findIndex(
    order => order.id === orderId || order.orderId === orderId,
  );
  if (index < 0) {
    throw new Error('Order not found.');
  }

  const existing = orders[index];
  if (!isOpenDineInTab(existing)) {
    throw new Error('Only open dine-in tabs can be edited. Close tab only after guest pays.');
  }

  const items = patch.items.map(item => ({
    ...item,
    id:
      item.id ||
      `pos-${item.productId}-${item.variation}-${Date.now()}`,
  }));
  const {productTotal, taxAmount, totalAmount} = recalcTotals(
    items,
    existing.taxPercent,
    existing.discount,
    existing.deliveryFee,
  );

  const nextStatus: OrderStatus =
    existing.status === 'Cancelled' || existing.status === 'Delivered'
      ? existing.status
      : 'Confirmed';

  const tableNo =
    typeof patch.tableNo === 'string' ? patch.tableNo.trim() : existing.tableNo;
  const waiterName =
    typeof patch.waiterName === 'string'
      ? patch.waiterName.trim()
      : existing.waiterName;
  const customerName =
    typeof patch.customerName === 'string'
      ? patch.customerName.trim() || existing.customerName
      : existing.customerName;

  const updated: StoredOrder = normalizeStoredOrder({
    ...existing,
    items,
    productTotal,
    taxAmount,
    totalAmount,
    customerName,
    tableNo: tableNo || null,
    waiterName: waiterName || null,
    paymentMethod: patch.paymentMethod ?? existing.paymentMethod,
    status: nextStatus,
    tabOpen: true,
    updatedAt: new Date().toISOString(),
  });
  orders[index] = updated;
  await writeOrders(orders);
  return updated;
};

/** Cashier closes dine-in tab after guest finishes; finalizes slip/revenue. */
export const closeDineInTab = async (
  orderId: string,
): Promise<StoredOrder> => {
  const orders = await readOrders();
  const index = orders.findIndex(
    order => order.id === orderId || order.orderId === orderId,
  );
  if (index < 0) {
    throw new Error('Order not found.');
  }

  const existing = orders[index];
  if (existing.orderMode !== 'dine_in') {
    throw new Error('Only dine-in orders have a closable tab.');
  }
  if (!isOpenDineInTab(existing)) {
    throw new Error('This dine-in tab is already closed.');
  }

  const updated: StoredOrder = normalizeStoredOrder({
    ...existing,
    tabOpen: false,
    status: 'Delivered',
    updatedAt: new Date().toISOString(),
  });
  orders[index] = updated;
  await writeOrders(orders);
  return updated;
};

export const updateStoredOrderStatus = async (
  orderId: string,
  status: OrderStatus,
): Promise<StoredOrder> => {
  const orders = await readOrders();
  const index = orders.findIndex(
    order => order.id === orderId || order.orderId === orderId,
  );

  if (index < 0) {
    throw new Error('Order not found.');
  }

  const existing = orders[index];
  const updated: StoredOrder = normalizeStoredOrder({
    ...existing,
    status,
    tabOpen:
      existing.orderMode === 'dine_in'
        ? status === 'Delivered' || status === 'Cancelled'
          ? false
          : existing.tabOpen
        : false,
    updatedAt: new Date().toISOString(),
  });
  orders[index] = updated;
  await writeOrders(orders);
  return updated;
};
