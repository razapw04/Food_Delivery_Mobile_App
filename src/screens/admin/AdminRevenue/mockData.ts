export type WeeklyFinancePoint = {
  label: string;
  income: number;
  expense: number;
};

export type BranchRevenueSnapshot = {
  branchId: string;
  today: number;
  week: number;
  month: number;
  ordersToday: number;
  expenseToday: number;
  expenseWeek: number;
  expenseMonth: number;
  weeklyTrend: WeeklyFinancePoint[];
  topProducts: {name: string; units: number}[];
  recentSales: {
    id: string;
    title: string;
    meta: string;
    amount: number;
  }[];
};

export const BRANCH_REVENUE: Record<string, BranchRevenueSnapshot> = {
  gulberg: {
    branchId: 'gulberg',
    today: 18450,
    week: 126800,
    month: 498350,
    ordersToday: 27,
    expenseToday: 6200,
    expenseWeek: 41200,
    expenseMonth: 168400,
    weeklyTrend: [
      {label: 'Mon', income: 16800, expense: 5400},
      {label: 'Tue', income: 19200, expense: 6100},
      {label: 'Wed', income: 15400, expense: 5800},
      {label: 'Thu', income: 21000, expense: 6900},
      {label: 'Fri', income: 24600, expense: 7200},
      {label: 'Sat', income: 18200, expense: 5500},
      {label: 'Sun', income: 11600, expense: 4300},
    ],
    topProducts: [
      {name: 'Pepperoni Feast', units: 42},
      {name: 'Family Feast', units: 31},
      {name: 'BBQ Chicken', units: 28},
    ],
    recentSales: [
      {id: 'g1', title: 'Order #FD-1042', meta: 'Today · 2:14 PM', amount: 2499},
      {id: 'g2', title: 'Order #FD-1041', meta: 'Today · 1:48 PM', amount: 1899},
      {id: 'g3', title: 'Order #FD-1040', meta: 'Today · 12:05 PM', amount: 3499},
    ],
  },
  dha: {
    branchId: 'dha',
    today: 22100,
    week: 142500,
    month: 512900,
    ordersToday: 31,
    expenseToday: 7800,
    expenseWeek: 48600,
    expenseMonth: 179500,
    weeklyTrend: [
      {label: 'Mon', income: 18800, expense: 6200},
      {label: 'Tue', income: 20500, expense: 6800},
      {label: 'Wed', income: 17600, expense: 6400},
      {label: 'Thu', income: 22900, expense: 7400},
      {label: 'Fri', income: 26800, expense: 8100},
      {label: 'Sat', income: 21400, expense: 7100},
      {label: 'Sun', income: 14500, expense: 5600},
    ],
    topProducts: [
      {name: 'Classic Burger', units: 38},
      {name: 'Margherita', units: 29},
      {name: 'Family Feast', units: 22},
    ],
    recentSales: [
      {id: 'd1', title: 'Order #FD-2048', meta: 'Today · 3:02 PM', amount: 2799},
      {id: 'd2', title: 'Order #FD-2047', meta: 'Today · 2:11 PM', amount: 1599},
      {id: 'd3', title: 'Order #FD-2046', meta: 'Today · 11:40 AM', amount: 4199},
    ],
  },
  johar: {
    branchId: 'johar',
    today: 9800,
    week: 71500,
    month: 268400,
    ordersToday: 14,
    expenseToday: 3400,
    expenseWeek: 24800,
    expenseMonth: 94500,
    weeklyTrend: [
      {label: 'Mon', income: 9200, expense: 3100},
      {label: 'Tue', income: 10400, expense: 3600},
      {label: 'Wed', income: 8800, expense: 3300},
      {label: 'Thu', income: 11200, expense: 3900},
      {label: 'Fri', income: 12900, expense: 4200},
      {label: 'Sat', income: 10100, expense: 3500},
      {label: 'Sun', income: 8900, expense: 3200},
    ],
    topProducts: [
      {name: 'BBQ Chicken', units: 19},
      {name: 'Soft Drink Bundle', units: 17},
      {name: 'Pepperoni Feast', units: 15},
    ],
    recentSales: [
      {id: 'j1', title: 'Order #FD-3011', meta: 'Today · 1:20 PM', amount: 1299},
      {id: 'j2', title: 'Order #FD-3010', meta: 'Today · 12:35 PM', amount: 2199},
      {id: 'j3', title: 'Order #FD-3009', meta: 'Yesterday · 8:50 PM', amount: 1899},
    ],
  },
  'model-town': {
    branchId: 'model-town',
    today: 14200,
    week: 98500,
    month: 356700,
    ordersToday: 19,
    expenseToday: 4900,
    expenseWeek: 33200,
    expenseMonth: 121800,
    weeklyTrend: [
      {label: 'Mon', income: 12400, expense: 4100},
      {label: 'Tue', income: 14100, expense: 4700},
      {label: 'Wed', income: 11800, expense: 4300},
      {label: 'Thu', income: 15200, expense: 5100},
      {label: 'Fri', income: 17600, expense: 5600},
      {label: 'Sat', income: 14900, expense: 4900},
      {label: 'Sun', income: 12500, expense: 4500},
    ],
    topProducts: [
      {name: 'Family Feast', units: 26},
      {name: 'Classic Burger', units: 21},
      {name: 'Margherita', units: 18},
    ],
    recentSales: [
      {id: 'm1', title: 'Order #FD-4015', meta: 'Today · 4:05 PM', amount: 3299},
      {id: 'm2', title: 'Order #FD-4014', meta: 'Today · 2:55 PM', amount: 1499},
      {id: 'm3', title: 'Order #FD-4013', meta: 'Today · 1:10 PM', amount: 2099},
    ],
  },
};

export const aggregateRevenue = (
  snapshots: BranchRevenueSnapshot[],
): BranchRevenueSnapshot => {
  const topMap = new Map<string, number>();
  const recentSales = snapshots
    .flatMap(item => item.recentSales)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  snapshots.forEach(snapshot => {
    snapshot.topProducts.forEach(product => {
      topMap.set(
        product.name,
        (topMap.get(product.name) ?? 0) + product.units,
      );
    });
  });

  const topProducts = Array.from(topMap.entries())
    .map(([name, units]) => ({name, units}))
    .sort((a, b) => b.units - a.units)
    .slice(0, 4);

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyTrend: WeeklyFinancePoint[] = dayLabels.map((label, index) => ({
    label,
    income: snapshots.reduce(
      (sum, item) => sum + (item.weeklyTrend[index]?.income ?? 0),
      0,
    ),
    expense: snapshots.reduce(
      (sum, item) => sum + (item.weeklyTrend[index]?.expense ?? 0),
      0,
    ),
  }));

  return {
    branchId: 'all',
    today: snapshots.reduce((sum, item) => sum + item.today, 0),
    week: snapshots.reduce((sum, item) => sum + item.week, 0),
    month: snapshots.reduce((sum, item) => sum + item.month, 0),
    ordersToday: snapshots.reduce((sum, item) => sum + item.ordersToday, 0),
    expenseToday: snapshots.reduce((sum, item) => sum + item.expenseToday, 0),
    expenseWeek: snapshots.reduce((sum, item) => sum + item.expenseWeek, 0),
    expenseMonth: snapshots.reduce((sum, item) => sum + item.expenseMonth, 0),
    weeklyTrend,
    topProducts,
    recentSales,
  };
};
