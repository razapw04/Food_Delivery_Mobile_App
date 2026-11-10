import type {OrderChannel, StoredOrder} from '../storage/orderStorage';
import {
  isOpenDineInTab,
  resolveOrderChannel,
} from '../storage/orderStorage';

export type ChannelTotals = {
  today: number;
  week: number;
  month: number;
  ordersToday: number;
};

export type ChannelRevenueBreakdown = {
  online: ChannelTotals;
  pos: ChannelTotals;
  combined: ChannelTotals;
};

const emptyTotals = (): ChannelTotals => ({
  today: 0,
  week: 0,
  month: 0,
  ordersToday: 0,
});

const startOfLocalDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const startOfLocalWeek = (date: Date) => {
  const next = startOfLocalDay(date);
  // Monday-start week
  const day = next.getDay();
  const diff = day === 0 ? 6 : day - 1;
  next.setDate(next.getDate() - diff);
  return next;
};

const startOfLocalMonth = (date: Date) => {
  const next = startOfLocalDay(date);
  next.setDate(1);
  return next;
};

const isCountableSale = (order: StoredOrder) => {
  if (order.status === 'Cancelled' || order.status === 'Pending') {
    return false;
  }
  // Open dine-in tabs finalize when cashier closes them.
  if (isOpenDineInTab(order)) {
    return false;
  }
  return true;
};

export const buildChannelRevenueBreakdown = (
  orders: StoredOrder[],
  options?: {branchId?: string | null},
): ChannelRevenueBreakdown => {
  const now = new Date();
  const dayStart = startOfLocalDay(now).getTime();
  const weekStart = startOfLocalWeek(now).getTime();
  const monthStart = startOfLocalMonth(now).getTime();
  const branchId = options?.branchId;

  const online = emptyTotals();
  const pos = emptyTotals();

  const bump = (bucket: ChannelTotals, amount: number, createdAt: number) => {
    if (createdAt >= monthStart) {
      bucket.month += amount;
    }
    if (createdAt >= weekStart) {
      bucket.week += amount;
    }
    if (createdAt >= dayStart) {
      bucket.today += amount;
      bucket.ordersToday += 1;
    }
  };

  orders.forEach(order => {
    if (branchId != null && order.branchId != null && order.branchId !== branchId) {
      return;
    }
    if (branchId != null && order.branchId == null) {
      return;
    }
    if (!isCountableSale(order)) {
      return;
    }

    const createdAt = new Date(order.createdAt).getTime();
    if (Number.isNaN(createdAt)) {
      return;
    }

    const channel = resolveOrderChannel(order);
    const amount = Number(order.totalAmount) || 0;
    bump(channel === 'pos' ? pos : online, amount, createdAt);
  });

  return {
    online,
    pos,
    combined: {
      today: online.today + pos.today,
      week: online.week + pos.week,
      month: online.month + pos.month,
      ordersToday: online.ordersToday + pos.ordersToday,
    },
  };
};

export const channelLabel = (channel: OrderChannel) =>
  channel === 'pos' ? 'POS' : 'Online';
