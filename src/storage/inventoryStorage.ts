import AsyncStorage from '@react-native-async-storage/async-storage';
import {notifyInApp} from '../services/pushNotifications';
import {listBranches} from './branchesStorage';

const INVENTORY_KEY = '@food_app/branch_inventory_v1';

export type InventoryItem = {
  id: string;
  branchId: string;
  name: string;
  unit: string;
  quantity: number;
  lowStockAt: number;
  updatedAt: string;
  /** Set when a low-stock alert was already sent for the current low stretch. */
  lowStockNotifiedAt?: string | null;
};

export type InventoryPriority = 'low' | 'medium' | 'high';

/** Stock priority from quantity vs low threshold. */
export const getInventoryPriority = (
  quantity: number,
  lowStockAt: number,
): InventoryPriority => {
  const lowAt = Math.max(0, lowStockAt);
  if (quantity <= lowAt) {
    return 'low';
  }
  if (quantity <= lowAt * 2) {
    return 'medium';
  }
  return 'high';
};

export const inventoryPriorityLabel = (
  priority: InventoryPriority,
): string => {
  if (priority === 'low') {
    return 'Low priority · restock soon';
  }
  if (priority === 'medium') {
    return 'Medium priority · monitor stock';
  }
  return 'High stock · healthy';
};

export const inventoryPriorityRank = (priority: InventoryPriority): number => {
  if (priority === 'low') {
    return 0;
  }
  if (priority === 'medium') {
    return 1;
  }
  return 2;
};

const DEFAULT_CATALOG: Array<{
  key: string;
  name: string;
  unit: string;
  quantity: number;
  lowStockAt: number;
}> = [
  {key: 'flour', name: 'Flour', unit: 'kg', quantity: 40, lowStockAt: 10},
  {key: 'cheese', name: 'Mozzarella Cheese', unit: 'kg', quantity: 18, lowStockAt: 5},
  {key: 'chicken', name: 'Chicken', unit: 'kg', quantity: 22, lowStockAt: 6},
  {key: 'beef', name: 'Beef Patty Mix', unit: 'kg', quantity: 12, lowStockAt: 4},
  {key: 'sauce', name: 'Pizza Sauce', unit: 'L', quantity: 15, lowStockAt: 4},
  {key: 'oil', name: 'Cooking Oil', unit: 'L', quantity: 10, lowStockAt: 3},
  {key: 'dough', name: 'Dough Balls', unit: 'pcs', quantity: 80, lowStockAt: 20},
  {key: 'boxes', name: 'Pizza Boxes', unit: 'pcs', quantity: 120, lowStockAt: 30},
  {key: 'cups', name: 'Drink Cups', unit: 'pcs', quantity: 200, lowStockAt: 40},
  {key: 'napkins', name: 'Napkins', unit: 'packs', quantity: 25, lowStockAt: 5},
];

type InventoryStore = Record<string, InventoryItem[]>;

const readStore = async (): Promise<InventoryStore> => {
  const raw = await AsyncStorage.getItem(INVENTORY_KEY);
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object'
      ? (parsed as InventoryStore)
      : {};
  } catch {
    return {};
  }
};

const writeStore = async (store: InventoryStore) => {
  await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(store));
};

const seedBranchInventory = (branchId: string): InventoryItem[] => {
  const now = new Date().toISOString();
  return DEFAULT_CATALOG.map(item => ({
    id: `${branchId}-${item.key}`,
    branchId,
    name: item.name,
    unit: item.unit,
    quantity: item.quantity,
    lowStockAt: item.lowStockAt,
    updatedAt: now,
  }));
};

export const listBranchInventory = async (
  branchId: string,
): Promise<InventoryItem[]> => {
  if (!branchId.trim()) {
    return [];
  }
  const store = await readStore();
  const existing = store[branchId];
  if (existing && existing.length > 0) {
    return [...existing].sort((a, b) => {
      const rankDiff =
        inventoryPriorityRank(getInventoryPriority(a.quantity, a.lowStockAt)) -
        inventoryPriorityRank(getInventoryPriority(b.quantity, b.lowStockAt));
      if (rankDiff !== 0) {
        return rankDiff;
      }
      return a.name.localeCompare(b.name);
    });
  }
  const seeded = seedBranchInventory(branchId);
  store[branchId] = seeded;
  await writeStore(store);
  return seeded;
};

export const getInventoryItem = async (
  branchId: string,
  itemId: string,
): Promise<InventoryItem | null> => {
  const items = await listBranchInventory(branchId);
  return items.find(item => item.id === itemId) ?? null;
};

const resolveBranchName = async (branchId: string) => {
  try {
    const branches = await listBranches();
    return branches.find(item => item.id === branchId)?.name ?? branchId;
  } catch {
    return branchId;
  }
};

const isLowStock = (quantity: number, lowStockAt: number) =>
  quantity <= Math.max(0, lowStockAt);

const notifyLowStock = async (item: InventoryItem) => {
  const branchName = await resolveBranchName(item.branchId);
  const body = `${item.name} is low at ${branchName}: ${item.quantity} ${item.unit} left (threshold ${item.lowStockAt} ${item.unit}).`;

  await notifyInApp('Low stock alert', body, {
    type: 'inventory_low_stock',
    targetRole: 'manager',
    targetBranchId: item.branchId,
    relatedId: item.id,
  });
  await notifyInApp('Low stock alert', body, {
    type: 'inventory_low_stock',
    targetRole: 'kitchen',
    targetBranchId: item.branchId,
    relatedId: item.id,
  });
  await notifyInApp('Low stock logged', body, {
    type: 'inventory_low_stock',
    targetRole: 'superadmin',
    relatedId: item.id,
    showBanner: false,
  });
};

/**
 * If stock just crossed into low (or is low and never alerted), notify
 * manager + kitchen once until stock recovers above the threshold.
 */
const maybeNotifyLowStock = async (
  previous: InventoryItem,
  next: InventoryItem,
): Promise<InventoryItem> => {
  const wasLow = isLowStock(previous.quantity, previous.lowStockAt);
  const nowLow = isLowStock(next.quantity, next.lowStockAt);

  if (!nowLow) {
    if (previous.lowStockNotifiedAt) {
      return {...next, lowStockNotifiedAt: null};
    }
    return next;
  }

  const shouldAlert = !wasLow || !previous.lowStockNotifiedAt;
  if (!shouldAlert) {
    return next;
  }

  await notifyLowStock(next);
  return {
    ...next,
    lowStockNotifiedAt: new Date().toISOString(),
  };
};

export const adjustInventoryQuantity = async (payload: {
  branchId: string;
  itemId: string;
  delta: number;
}): Promise<{ok: true; item: InventoryItem} | {ok: false; error: string}> => {
  const store = await readStore();
  let items = store[payload.branchId];
  if (!items || items.length === 0) {
    items = seedBranchInventory(payload.branchId);
  }
  const index = items.findIndex(item => item.id === payload.itemId);
  if (index < 0) {
    return {ok: false, error: 'Inventory item not found.'};
  }
  const current = items[index];
  const nextQty = Math.max(0, Math.round(current.quantity + payload.delta));
  let updated: InventoryItem = {
    ...current,
    quantity: nextQty,
    updatedAt: new Date().toISOString(),
  };
  updated = await maybeNotifyLowStock(current, updated);

  const nextItems = [...items];
  nextItems[index] = updated;
  store[payload.branchId] = nextItems;
  await writeStore(store);
  return {ok: true, item: updated};
};

/** Kitchen records stock used — decreases quantity and may trigger low-stock alerts. */
export const recordInventoryUsage = async (payload: {
  branchId: string;
  itemId: string;
  usedQuantity: number;
}): Promise<{ok: true; item: InventoryItem} | {ok: false; error: string}> => {
  const used = Math.round(payload.usedQuantity);
  if (used <= 0) {
    return {ok: false, error: 'Enter a quantity greater than 0.'};
  }
  return adjustInventoryQuantity({
    branchId: payload.branchId,
    itemId: payload.itemId,
    delta: -used,
  });
};

/** On inventory open: alert any low items that were never notified. */
export const scanBranchLowStockAlerts = async (
  branchId: string,
): Promise<number> => {
  if (!branchId.trim()) {
    return 0;
  }
  const store = await readStore();
  let items = store[branchId];
  if (!items || items.length === 0) {
    items = seedBranchInventory(branchId);
    store[branchId] = items;
    await writeStore(store);
    return 0;
  }

  let alerted = 0;
  const nextItems = [...items];
  for (let i = 0; i < nextItems.length; i += 1) {
    const item = nextItems[i];
    if (!isLowStock(item.quantity, item.lowStockAt) || item.lowStockNotifiedAt) {
      continue;
    }
    await notifyLowStock(item);
    nextItems[i] = {
      ...item,
      lowStockNotifiedAt: new Date().toISOString(),
    };
    alerted += 1;
  }

  if (alerted > 0) {
    store[branchId] = nextItems;
    await writeStore(store);
  }
  return alerted;
};
