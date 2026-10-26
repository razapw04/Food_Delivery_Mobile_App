export type OrderStatus =
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
 */
export const orderHistory: OrderHistoryItem[] = [
  {
    id: '1',
    orderId: '#FD-1001',
    status: 'Delivered',
    title: 'Smash Burger Combo',
    details: '1x Smash Burger, 1x Loaded Fries, 1x Soft Drink',
    price: 'Rs. 1,299',
    date: 'Today',
    time: '2:45 PM',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    orderId: '#FD-1000',
    status: 'Delivered',
    title: 'Pepperoni Pizza',
    details: '1x Large Pepperoni, 1x Choco Shake',
    price: 'Rs. 1,899',
    date: 'Yesterday',
    time: '8:10 PM',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    orderId: '#FD-0998',
    status: 'Cancelled',
    title: 'Crispy Wings Bucket',
    details: '1x 8pc Wings, 1x Garlic Dip',
    price: 'Rs. 999',
    date: '12 Oct',
    time: '7:20 PM',
    image:
      'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=400&q=80',
  },
];
