import type {UserRole} from '../storage/authStorage';
import type {OrderStatus} from '../storage/orderStorage';

export const STATUS_OPTIONS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'On the way',
  'Delivered',
  'Cancelled',
];

const FLOW_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'On the way',
  'Delivered',
];

/** Statuses each staff role is allowed to set (still must move forward). */
const ROLE_ALLOWED_TARGETS: Record<UserRole, OrderStatus[] | 'all'> = {
  customer: [],
  cashier: ['Confirmed', 'Cancelled'],
  kitchen: ['Preparing', 'On the way'],
  manager: 'all',
  superadmin: 'all',
};

export const canSelectStatus = (
  current: OrderStatus,
  option: OrderStatus,
  role: UserRole = 'manager',
): boolean => {
  if (option === current) {
    return false;
  }
  if (current === 'Delivered' || current === 'Cancelled') {
    return false;
  }

  const allowed = ROLE_ALLOWED_TARGETS[role] ?? [];
  if (allowed !== 'all' && !allowed.includes(option)) {
    return false;
  }

  if (option === 'Cancelled') {
    // Cashier/manager may cancel before kitchen finishes dispatch.
    return (
      current === 'Pending' ||
      current === 'Confirmed' ||
      (allowed === 'all' && current !== 'Delivered')
    );
  }

  const currentIndex = FLOW_STATUSES.indexOf(current);
  const optionIndex = FLOW_STATUSES.indexOf(option);
  if (currentIndex < 0 || optionIndex < 0) {
    return false;
  }
  return optionIndex > currentIndex;
};

export const formatOrderPrice = (value: number) =>
  `Rs. ${value.toLocaleString('en-PK')}`;

export const formatOrderWhen = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

/** Clock time only — used bold in cashier active-order cards. */
export const formatOrderTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

export type OrderTimePriority = 'low' | 'normal' | 'high' | 'urgent';

/** Waiting longer = higher priority for active cashier queue. */
export const getOrderTimePriority = (
  createdAt: string,
  nowMs: number = Date.now(),
): {level: OrderTimePriority; label: string; waitMinutes: number} => {
  const createdMs = new Date(createdAt).getTime();
  const waitMinutes = Math.max(
    0,
    Math.floor((nowMs - (Number.isFinite(createdMs) ? createdMs : nowMs)) / 60000),
  );

  if (waitMinutes >= 30) {
    return {level: 'urgent', label: 'Urgent', waitMinutes};
  }
  if (waitMinutes >= 20) {
    return {level: 'high', label: 'High', waitMinutes};
  }
  if (waitMinutes >= 10) {
    return {level: 'normal', label: 'Normal', waitMinutes};
  }
  return {level: 'low', label: 'Low', waitMinutes};
};

export const formatWaitLabel = (waitMinutes: number) => {
  if (waitMinutes < 1) {
    return 'Just now';
  }
  if (waitMinutes < 60) {
    return `${waitMinutes}m wait`;
  }
  const hours = Math.floor(waitMinutes / 60);
  const mins = waitMinutes % 60;
  return mins > 0 ? `${hours}h ${mins}m wait` : `${hours}h wait`;
};
