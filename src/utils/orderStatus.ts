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
