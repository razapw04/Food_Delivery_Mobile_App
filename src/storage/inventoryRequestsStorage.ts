import AsyncStorage from '@react-native-async-storage/async-storage';
import {notifyInApp} from '../services/pushNotifications';
import {adjustInventoryQuantity} from './inventoryStorage';

const REQUESTS_KEY = '@food_app/inventory_requests_v1';

/** pending → manager · approved → cashier cash · arranged → stock updated · rejected */
export type InventoryRequestStatus =
  | 'pending'
  | 'approved'
  | 'arranged'
  | 'rejected';

export type InventoryRequest = {
  id: string;
  branchId: string;
  branchName: string;
  inventoryItemId: string;
  itemName: string;
  unit: string;
  currentQuantity: number;
  lowStockAt: number;
  requestedQuantity: number;
  note?: string;
  requestedByEmail: string;
  requestedByName: string;
  status: InventoryRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedByEmail?: string;
  reviewedByName?: string;
  reviewNote?: string;
  arrangedAt?: string;
  arrangedByEmail?: string;
  arrangedByName?: string;
  arrangedNote?: string;
  /** Cash paid by cashier to arrange stock (optional record). */
  cashAmount?: number;
};

const readAll = async (): Promise<InventoryRequest[]> => {
  const raw = await AsyncStorage.getItem(REQUESTS_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as InventoryRequest[]) : [];
  } catch {
    return [];
  }
};

const writeAll = async (items: InventoryRequest[]) => {
  await AsyncStorage.setItem(REQUESTS_KEY, JSON.stringify(items));
};

export const listInventoryRequests = async (options?: {
  branchId?: string | null;
  status?: InventoryRequestStatus | 'all';
}): Promise<InventoryRequest[]> => {
  let items = await readAll();
  if (options?.branchId) {
    items = items.filter(item => item.branchId === options.branchId);
  }
  if (options?.status && options.status !== 'all') {
    items = items.filter(item => item.status === options.status);
  }
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

export const createInventoryRequest = async (payload: {
  branchId: string;
  branchName: string;
  inventoryItemId: string;
  itemName: string;
  unit: string;
  currentQuantity: number;
  lowStockAt: number;
  requestedQuantity: number;
  note?: string;
  requestedByEmail: string;
  requestedByName: string;
}): Promise<{ok: true} | {ok: false; error: string}> => {
  const qty = Math.round(payload.requestedQuantity);
  if (!payload.branchId.trim()) {
    return {ok: false, error: 'No branch assigned.'};
  }
  if (qty <= 0) {
    return {ok: false, error: 'Enter a quantity greater than 0.'};
  }

  const existing = await readAll();
  const hasOpen = existing.some(
    item =>
      item.branchId === payload.branchId &&
      item.inventoryItemId === payload.inventoryItemId &&
      item.requestedByEmail === payload.requestedByEmail.trim().toLowerCase() &&
      (item.status === 'pending' || item.status === 'approved'),
  );
  if (hasOpen) {
    return {
      ok: false,
      error: 'You already have an open request for this item.',
    };
  }

  const next: InventoryRequest = {
    id: `inv-req-${Date.now()}`,
    branchId: payload.branchId,
    branchName: payload.branchName.trim() || payload.branchId,
    inventoryItemId: payload.inventoryItemId,
    itemName: payload.itemName.trim(),
    unit: payload.unit,
    currentQuantity: Math.max(0, Math.round(payload.currentQuantity)),
    lowStockAt: Math.max(0, Math.round(payload.lowStockAt)),
    requestedQuantity: qty,
    note: payload.note?.trim() || undefined,
    requestedByEmail: payload.requestedByEmail.trim().toLowerCase(),
    requestedByName: payload.requestedByName.trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  await writeAll([next, ...existing]);

  const qtyLabel = `${next.requestedQuantity} ${next.unit}`;
  await notifyInApp(
    'New inventory request',
    `${next.requestedByName} requested ${qtyLabel} of ${next.itemName} for ${next.branchName}.`,
    {
      type: 'inventory_request',
      targetRole: 'manager',
      targetBranchId: next.branchId,
      relatedId: next.id,
    },
  );
  await notifyInApp(
    'Inventory request logged',
    `${next.branchName}: ${next.itemName} · ${qtyLabel} (pending manager approval).`,
    {
      type: 'inventory_request',
      targetRole: 'superadmin',
      relatedId: next.id,
      showBanner: false,
    },
  );

  return {ok: true};
};

export const reviewInventoryRequest = async (payload: {
  requestId: string;
  decision: 'approved' | 'rejected';
  reviewedByEmail: string;
  reviewedByName: string;
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

  const next = [...items];
  next[index] = {
    ...request,
    status: payload.decision,
    reviewedAt: new Date().toISOString(),
    reviewedByEmail: payload.reviewedByEmail.trim().toLowerCase(),
    reviewedByName: payload.reviewedByName.trim(),
    reviewNote: payload.note?.trim() || undefined,
  };
  await writeAll(next);

  if (payload.decision === 'approved') {
    const qtyLabel = `${request.requestedQuantity} ${request.unit}`;
    await notifyInApp(
      'Arrange inventory with cash',
      `Manager approved ${qtyLabel} of ${request.itemName} for ${request.branchName}. Pay cash and arrange stock.`,
      {
        type: 'inventory_arrange',
        targetRole: 'cashier',
        targetBranchId: request.branchId,
        relatedId: request.id,
      },
    );
    await notifyInApp(
      'Inventory sent to cashier',
      `${request.branchName}: ${request.itemName} · ${qtyLabel} awaiting cash arrangement.`,
      {
        type: 'inventory_arrange',
        targetRole: 'superadmin',
        relatedId: request.id,
        showBanner: false,
      },
    );
  }

  return {ok: true};
};

/** Cashier pays cash and confirms stock was arranged — then inventory quantity increases. */
export const arrangeInventoryRequestWithCash = async (payload: {
  requestId: string;
  arrangedByEmail: string;
  arrangedByName: string;
  cashAmount?: number;
  note?: string;
}): Promise<{ok: true} | {ok: false; error: string}> => {
  const items = await readAll();
  const index = items.findIndex(item => item.id === payload.requestId);
  if (index < 0) {
    return {ok: false, error: 'Request not found.'};
  }

  const request = items[index];
  if (request.status !== 'approved') {
    return {
      ok: false,
      error: 'Only manager-approved requests can be arranged with cash.',
    };
  }

  const cashAmount =
    payload.cashAmount != null && Number.isFinite(payload.cashAmount)
      ? Math.max(0, Math.round(payload.cashAmount * 100) / 100)
      : undefined;

  const adjusted = await adjustInventoryQuantity({
    branchId: request.branchId,
    itemId: request.inventoryItemId,
    delta: request.requestedQuantity,
  });
  if (!adjusted.ok) {
    return adjusted;
  }

  const next = [...items];
  next[index] = {
    ...request,
    status: 'arranged',
    arrangedAt: new Date().toISOString(),
    arrangedByEmail: payload.arrangedByEmail.trim().toLowerCase(),
    arrangedByName: payload.arrangedByName.trim(),
    arrangedNote: payload.note?.trim() || undefined,
    cashAmount,
  };
  await writeAll(next);

  const qtyLabel = `${request.requestedQuantity} ${request.unit}`;
  const cashBit =
    cashAmount != null ? ` Cash spent: ${cashAmount.toFixed(2)}.` : '';
  await notifyInApp(
    'Inventory arranged',
    `${payload.arrangedByName} arranged ${qtyLabel} of ${request.itemName} with cash.${cashBit}`,
    {
      type: 'inventory_arranged',
      targetRole: 'manager',
      targetBranchId: request.branchId,
      relatedId: request.id,
      showBanner: false,
    },
  );
  await notifyInApp(
    'Inventory arranged',
    `${request.branchName}: ${request.itemName} · ${qtyLabel} stocked via cashier cash.${cashBit}`,
    {
      type: 'inventory_arranged',
      targetRole: 'superadmin',
      relatedId: request.id,
      showBanner: false,
    },
  );

  return {ok: true};
};

export const countPendingInventoryRequests = async (options?: {
  branchId?: string | null;
}): Promise<number> => {
  const pending = await listInventoryRequests({
    branchId: options?.branchId,
    status: 'pending',
  });
  return pending.length;
};

export const countApprovedAwaitingCashier = async (options?: {
  branchId?: string | null;
}): Promise<number> => {
  const approved = await listInventoryRequests({
    branchId: options?.branchId,
    status: 'approved',
  });
  return approved.length;
};
