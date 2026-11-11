import type {OrderChannel, StoredOrder} from '../storage/orderStorage';
import {
  isOpenDineInTab,
  resolveOrderChannel,
} from '../storage/orderStorage';

export type ChannelTotals = {
  today: number;
  week: number;
  month: number;
  year: number;
  custom: number;
  ordersToday: number;
  ordersCustom: number;
};

export type ChannelRevenueBreakdown = {
  online: ChannelTotals;
  pos: ChannelTotals;
  combined: ChannelTotals;
};

export type SalesDateRange = {
  startMs: number;
  endMs: number;
};

export type RevenuePeriod = 'today' | 'week' | 'month' | 'year' | 'custom';

const emptyTotals = (): ChannelTotals => ({
  today: 0,
  week: 0,
  month: 0,
  year: 0,
  custom: 0,
  ordersToday: 0,
  ordersCustom: 0,
});

const startOfLocalDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const startOfLocalWeek = (date: Date) => {
  const next = startOfLocalDay(date);
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

const startOfLocalYear = (date: Date) => {
  const next = startOfLocalDay(date);
  next.setMonth(0, 1);
  return next;
};

export const isCountableSale = (order: StoredOrder) => {
  if (order.status === 'Cancelled' || order.status === 'Pending') {
    return false;
  }
  if (isOpenDineInTab(order)) {
    return false;
  }
  return true;
};

/** Inclusive local calendar month (monthIndex 0–11). */
export const getMonthRange = (
  year: number,
  monthIndex: number,
): SalesDateRange => {
  const start = new Date(year, monthIndex, 1, 0, 0, 0, 0);
  const end = new Date(year, monthIndex + 1, 1, 0, 0, 0, 0);
  return {startMs: start.getTime(), endMs: end.getTime()};
};

export const getPresetRange = (
  period: Exclude<RevenuePeriod, 'custom'>,
): SalesDateRange => {
  const now = new Date();
  if (period === 'today') {
    const start = startOfLocalDay(now);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return {startMs: start.getTime(), endMs: end.getTime()};
  }
  if (period === 'week') {
    const start = startOfLocalWeek(now);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return {startMs: start.getTime(), endMs: end.getTime()};
  }
  if (period === 'month') {
    const start = startOfLocalMonth(now);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    return {startMs: start.getTime(), endMs: end.getTime()};
  }
  const start = startOfLocalYear(now);
  const end = new Date(start.getFullYear() + 1, 0, 1);
  return {startMs: start.getTime(), endMs: end.getTime()};
};

export const formatMonthLabel = (year: number, monthIndex: number) =>
  new Date(year, monthIndex, 1).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });

/** Two consecutive calendar months ending at year/monthIndex. */
export const getTwoMonthRange = (
  year: number,
  monthIndex: number,
): SalesDateRange => {
  const start = new Date(year, monthIndex - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, monthIndex + 1, 1, 0, 0, 0, 0);
  return {startMs: start.getTime(), endMs: end.getTime()};
};

export const formatTwoMonthLabel = (year: number, monthIndex: number) => {
  const end = new Date(year, monthIndex, 1);
  const start = new Date(year, monthIndex - 1, 1);
  const startLabel = start.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
  const endLabel = end.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
  return `${startLabel} – ${endLabel}`;
};

export type HourlyFinancePoint = {
  label: string;
  income: number;
  expense: number;
};

export type ChartTrendPoint = HourlyFinancePoint;

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

/** Live chart series for any sales range (hour / day / month buckets). */
export const buildRangeTrend = (
  orders: StoredOrder[],
  range: SalesDateRange,
  options?: {branchId?: string | null},
): {points: ChartTrendPoint[]; isHourly: boolean; subtitle: string} => {
  const spanMs = Math.max(range.endMs - range.startMs, 1);
  const spanDays = spanMs / (24 * 60 * 60 * 1000);
  const start = new Date(range.startMs);

  const incomeByKey = new Map<string, number>();

  orders.forEach(order => {
    if (!matchesBranchFilter(order, options?.branchId)) {
      return;
    }
    if (!isCountableSale(order)) {
      return;
    }
    const createdAt = new Date(order.createdAt).getTime();
    if (Number.isNaN(createdAt) || !inRange(createdAt, range)) {
      return;
    }
    const date = new Date(createdAt);
    let key: string;
    if (spanDays <= 1.5) {
      key = String(date.getHours());
    } else if (spanDays <= 45) {
      key = dayKey(date);
    } else {
      key = `${date.getFullYear()}-${date.getMonth()}`;
    }
    incomeByKey.set(
      key,
      (incomeByKey.get(key) ?? 0) + (Number(order.totalAmount) || 0),
    );
  });

  const points: ChartTrendPoint[] = [];

  if (spanDays <= 1.5) {
    const lastHour =
      range.endMs > Date.now() ? new Date().getHours() : 23;
    for (let hour = 0; hour <= lastHour; hour += 1) {
      points.push({
        label: formatHourLabel(hour),
        income: incomeByKey.get(String(hour)) ?? 0,
        expense: 0,
      });
    }
    const subtitle = start.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    return {points, isHourly: true, subtitle: `By hour · ${subtitle}`};
  }

  if (spanDays <= 45) {
    const cursor = startOfLocalDay(start);
    while (cursor.getTime() < range.endMs) {
      const key = dayKey(cursor);
      points.push({
        label: cursor.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        }),
        income: incomeByKey.get(key) ?? 0,
        expense: 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    return {
      points,
      isHourly: false,
      subtitle: `${points[0]?.label ?? ''} – ${
        points[points.length - 1]?.label ?? ''
      }`,
    };
  }

  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cursor.getTime() < range.endMs) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}`;
    points.push({
      label: cursor.toLocaleDateString('en-GB', {
        month: 'short',
        year: '2-digit',
      }),
      income: incomeByKey.get(key) ?? 0,
      expense: 0,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return {
    points,
    isHourly: false,
    subtitle: 'By month',
  };
};

const formatHourLabel = (hour: number) => {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const suffix = hour < 12 ? 'a' : 'p';
  return `${h12}${suffix}`;
};

/** Hourly income buckets from midnight through the current hour (today). */
export const buildHourlySalesToday = (
  orders: StoredOrder[],
  options?: {branchId?: string | null},
): HourlyFinancePoint[] => {
  const now = new Date();
  const dayStart = startOfLocalDay(now);
  const dayStartMs = dayStart.getTime();
  const currentHour = now.getHours();

  const buckets: HourlyFinancePoint[] = [];
  for (let hour = 0; hour <= currentHour; hour += 1) {
    buckets.push({
      label: formatHourLabel(hour),
      income: 0,
      expense: 0,
    });
  }

  orders.forEach(order => {
    if (!matchesBranchFilter(order, options?.branchId)) {
      return;
    }
    if (!isCountableSale(order)) {
      return;
    }
    const createdAt = new Date(order.createdAt).getTime();
    if (Number.isNaN(createdAt) || createdAt < dayStartMs) {
      return;
    }
    const hour = new Date(createdAt).getHours();
    if (hour > currentHour) {
      return;
    }
    buckets[hour].income += Number(order.totalAmount) || 0;
  });

  return buckets;
};

/** Last N calendar months including current (newest first). */
export const listRecentMonths = (count = 12) => {
  const now = new Date();
  const items: {year: number; monthIndex: number; label: string; key: string}[] =
    [];
  for (let i = 0; i < count; i += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    items.push({
      year,
      monthIndex,
      label: formatMonthLabel(year, monthIndex),
      key: `${year}-${monthIndex}`,
    });
  }
  return items;
};

const matchesBranchFilter = (
  order: StoredOrder,
  branchId?: string | null,
) => {
  if (branchId == null || branchId === 'all') {
    return true;
  }
  if (order.branchId == null) {
    return false;
  }
  return order.branchId === branchId;
};

const inRange = (createdAt: number, range?: SalesDateRange | null) => {
  if (!range) {
    return true;
  }
  return createdAt >= range.startMs && createdAt < range.endMs;
};

export const buildChannelRevenueBreakdown = (
  orders: StoredOrder[],
  options?: {branchId?: string | null; customRange?: SalesDateRange | null},
): ChannelRevenueBreakdown => {
  const now = new Date();
  const dayStart = startOfLocalDay(now).getTime();
  const weekStart = startOfLocalWeek(now).getTime();
  const monthStart = startOfLocalMonth(now).getTime();
  const yearStart = startOfLocalYear(now).getTime();
  const branchId = options?.branchId;
  const customRange = options?.customRange ?? null;

  const online = emptyTotals();
  const pos = emptyTotals();

  const bump = (bucket: ChannelTotals, amount: number, createdAt: number) => {
    if (createdAt >= yearStart) {
      bucket.year += amount;
    }
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
    if (customRange && inRange(createdAt, customRange)) {
      bucket.custom += amount;
      bucket.ordersCustom += 1;
    }
  };

  orders.forEach(order => {
    if (!matchesBranchFilter(order, branchId)) {
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
      year: online.year + pos.year,
      custom: online.custom + pos.custom,
      ordersToday: online.ordersToday + pos.ordersToday,
      ordersCustom: online.ordersCustom + pos.ordersCustom,
    },
  };
};

export const sumSalesInRange = (
  orders: StoredOrder[],
  options?: {branchId?: string | null; range?: SalesDateRange | null},
) => {
  let income = 0;
  let orderCount = 0;

  orders.forEach(order => {
    if (!matchesBranchFilter(order, options?.branchId)) {
      return;
    }
    if (!isCountableSale(order)) {
      return;
    }
    const createdAt = new Date(order.createdAt).getTime();
    if (Number.isNaN(createdAt) || !inRange(createdAt, options?.range)) {
      return;
    }
    income += Number(order.totalAmount) || 0;
    orderCount += 1;
  });

  return {income, orderCount};
};

export const channelLabel = (channel: OrderChannel) =>
  channel === 'pos' ? 'POS' : 'Online';

export type TopSellingProduct = {
  id: string;
  name: string;
  units: number;
  revenue: number;
};

export type BranchTopSelling = {
  branchId: string;
  products: TopSellingProduct[];
};

export type CategoryTopSelling = {
  categoryId: string;
  categoryName: string;
  products: TopSellingProduct[];
};

type CatalogProductRef = {
  id: string;
  categoryId: string;
  name: string;
};

type CatalogCategoryRef = {
  id: string;
  name: string;
};

type ProductSalesOptions = {
  branchId?: string | null;
  /** Omit / number = cap list. Pass `null` to return every product. */
  limit?: number | null;
  range?: SalesDateRange | null;
};

const applyProductLimit = (
  products: TopSellingProduct[],
  limit?: number | null,
) => {
  if (limit == null) {
    return products;
  }
  return products.slice(0, limit);
};

const collectProductSales = (
  orders: StoredOrder[],
  options?: Omit<ProductSalesOptions, 'limit'>,
): TopSellingProduct[] => {
  const branchId = options?.branchId;
  const range = options?.range ?? null;
  const map = new Map<string, TopSellingProduct>();

  orders.forEach(order => {
    if (!matchesBranchFilter(order, branchId)) {
      return;
    }
    if (!isCountableSale(order)) {
      return;
    }
    const createdAt = new Date(order.createdAt).getTime();
    if (Number.isNaN(createdAt) || !inRange(createdAt, range)) {
      return;
    }

    (order.items ?? []).forEach(item => {
      const name = typeof item.name === 'string' ? item.name.trim() : '';
      if (!name) {
        return;
      }
      const units = Number(item.quantity) || 0;
      if (units <= 0) {
        return;
      }
      const unitPrice = Number(item.unitPrice) || 0;
      const key =
        typeof item.productId === 'string' && item.productId.trim()
          ? item.productId.trim()
          : name.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.units += units;
        existing.revenue += unitPrice * units;
      } else {
        map.set(key, {
          id: key,
          name,
          units,
          revenue: unitPrice * units,
        });
      }
    });
  });

  return Array.from(map.values());
};

/** Rank products by units sold from countable orders (optional date range). */
export const buildTopSellingProducts = (
  orders: StoredOrder[],
  options?: ProductSalesOptions,
): TopSellingProduct[] => {
  const limit = options?.limit === undefined ? 5 : options.limit;
  return applyProductLimit(
    collectProductSales(orders, options).sort(
      (a, b) => b.units - a.units || b.revenue - a.revenue,
    ),
    limit,
  );
};

/** Lowest selling countable products in range (still sold at least once). */
export const buildLeastSellingProducts = (
  orders: StoredOrder[],
  options?: ProductSalesOptions,
): TopSellingProduct[] => {
  const limit = options?.limit === undefined ? 5 : options.limit;
  return applyProductLimit(
    collectProductSales(orders, options).sort(
      (a, b) => a.units - b.units || a.revenue - b.revenue,
    ),
    limit,
  );
};

/**
 * Hot selling: strongest movers in the last ~24h window
 * (clamped to selected range when provided). Falls back to top sellers.
 */
export const buildHotSellingProducts = (
  orders: StoredOrder[],
  options?: ProductSalesOptions,
): TopSellingProduct[] => {
  const limit = options?.limit === undefined ? 5 : options.limit;
  const range = options?.range ?? null;
  const endMs = range?.endMs ?? Date.now();
  const hotStart = endMs - 24 * 60 * 60 * 1000;
  const hotRange: SalesDateRange = {
    startMs: range != null ? Math.max(range.startMs, hotStart) : hotStart,
    endMs,
  };

  const hot = applyProductLimit(
    collectProductSales(orders, {
      branchId: options?.branchId,
      range: hotRange,
    }).sort((a, b) => b.units - a.units || b.revenue - a.revenue),
    limit,
  );

  if (hot.length > 0) {
    return hot;
  }

  return buildTopSellingProducts(orders, options);
};

/** Best-selling products grouped by menu category (Pizza, Burgers, …). */
export const buildTopSellingByCategory = (
  orders: StoredOrder[],
  categories: CatalogCategoryRef[],
  menuItems: CatalogProductRef[],
  options?: ProductSalesOptions,
): CategoryTopSelling[] => {
  const limit = options?.limit === undefined ? null : options.limit;
  const byProductId = new Map(
    menuItems.map(item => [item.id, item] as const),
  );
  const byName = new Map(
    menuItems.map(item => [item.name.trim().toLowerCase(), item] as const),
  );

  const resolveCategoryId = (product: TopSellingProduct) => {
    const fromId = byProductId.get(product.id);
    if (fromId) {
      return fromId.categoryId;
    }
    const fromName = byName.get(product.name.trim().toLowerCase());
    return fromName?.categoryId ?? null;
  };

  const grouped = new Map<string, TopSellingProduct[]>();
  collectProductSales(orders, options).forEach(product => {
    const categoryId = resolveCategoryId(product);
    if (!categoryId) {
      return;
    }
    const list = grouped.get(categoryId) ?? [];
    list.push(product);
    grouped.set(categoryId, list);
  });

  return categories
    .map(category => {
      const products = applyProductLimit(
        (grouped.get(category.id) ?? []).sort(
          (a, b) => b.units - a.units || b.revenue - a.revenue,
        ),
        limit,
      );
      return {
        categoryId: category.id,
        categoryName: category.name,
        products,
      };
    })
    .filter(item => item.products.length > 0);
};

export type BranchProductSalesLists = {
  most: TopSellingProduct[];
  least: TopSellingProduct[];
  hot: TopSellingProduct[];
};

type SnapshotNamedUnits = {name: string; units: number};

const mapNamedUnitsToProducts = (
  items: SnapshotNamedUnits[] | undefined,
  keyPrefix: string,
): TopSellingProduct[] =>
  (items ?? []).map((item, index) => ({
    id: `${keyPrefix}-${index}`,
    name: item.name,
    units: item.units,
    revenue: 0,
  }));

/** Branch-scoped most / least / hot with optional snapshot fallback. */
export const getBranchProductSalesLists = (
  orders: StoredOrder[],
  options: {
    branchId?: string | null;
    range?: SalesDateRange | null;
    limit?: number | null;
    snapshot?: {
      topProducts?: SnapshotNamedUnits[];
      leastProducts?: SnapshotNamedUnits[];
      hotProducts?: SnapshotNamedUnits[];
    } | null;
  },
): BranchProductSalesLists => {
  const branchId = options.branchId ?? null;
  const range = options.range ?? null;
  const limit = options.limit === undefined ? null : options.limit;
  const key = branchId ?? 'all';

  const mostLive = buildTopSellingProducts(orders, {branchId, limit, range});
  const leastLive = buildLeastSellingProducts(orders, {
    branchId,
    limit,
    range,
  });
  const hotLive = buildHotSellingProducts(orders, {branchId, limit, range});

  return {
    most:
      mostLive.length > 0
        ? mostLive
        : mapNamedUnitsToProducts(options.snapshot?.topProducts, `most-${key}`),
    least:
      leastLive.length > 0
        ? leastLive
        : mapNamedUnitsToProducts(
            options.snapshot?.leastProducts,
            `least-${key}`,
          ),
    hot:
      hotLive.length > 0
        ? hotLive
        : mapNamedUnitsToProducts(options.snapshot?.hotProducts, `hot-${key}`),
  };
};

export const buildTopSellingByBranch = (
  orders: StoredOrder[],
  branchIds: string[],
  options?: {limit?: number; range?: SalesDateRange | null},
): BranchTopSelling[] => {
  const limit = options?.limit ?? 3;
  const range = options?.range ?? null;
  return branchIds
    .map(branchId => ({
      branchId,
      products: buildTopSellingProducts(orders, {branchId, limit, range}),
    }))
    .filter(item => item.products.length > 0);
};
