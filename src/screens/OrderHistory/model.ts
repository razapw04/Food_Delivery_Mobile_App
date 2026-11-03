export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Delivered'
  | 'On the way'
  | 'Preparing'
  | 'Cancelled';

export type OrderHistoryItem = {
  id: string;
  orderId: string;
  status: OrderStatus;
  title: string;
  details: string;
  price: string;
  date: string;
  time: string;
  image: string;
};

/**
 * Past orders for the signed-in user.
 * Keep empty `[]` when the user has no past orders — empty state shows automatically.
 * Real orders come from per-user AsyncStorage via OrderHistory screen.
 */
export const orderHistory: OrderHistoryItem[] = [];
