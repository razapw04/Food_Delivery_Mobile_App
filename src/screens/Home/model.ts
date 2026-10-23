export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type Promo = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  accent: string;
};

export type Restaurant = {
  id: string;
  name: string;
  tags: string;
  category: string;
  rating: string;
  delivery: string;
  time: string;
  image: string;
  isFreeDelivery?: boolean;
};

export type FoodItem = {
  id: string;
  name: string;
  category: string;
  rating: string;
  price: string;
  image: string;
};

export type BestsellerItem = {
  id: string;
  name: string;
  image: string;
};

export type RecentOrder = {
  id: string;
  title: string;
  price: string;
  day: string;
  time: string;
  itemsSummary: string;
  image: string;
};

export const categories: Category[] = [
  {
    id: 'all',
    name: 'All',
    icon: 'food',
  },
  {
    id: 'burger',
    name: 'Burgers',
    icon: 'hamburger',
  },
  {
    id: 'pizza',
    name: 'Pizza',
    icon: 'pizza',
  },
  {
    id: 'hot-dog',
    name: 'Hot Dog',
    icon: 'hot-dog',
  },
  {
    id: 'drinks',
    name: 'Drinks',
    icon: 'cup',
  },
  {
    id: 'dessert',
    name: 'Dessert',
    icon: 'cupcake',
  },
];

/**
 * Recent orders for the signed-in user.
 * Keep empty `[]` when the user has no past orders — section hides automatically.
 */
export const recentOrders: RecentOrder[] = [
  {
    id: 'ord-1001',
    title: 'Smash Burger Combo',
    price: 'Rs. 1,299',
    day: 'Today',
    time: '2:45 PM',
    itemsSummary: '1x Smash Burger, 1x Loaded Fries',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ord-1000',
    title: 'Pepperoni Pizza',
    price: 'Rs. 1,899',
    day: 'Yesterday',
    time: '8:10 PM',
    itemsSummary: '1x Large Pepperoni, 1x Choco Shake',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
  },
];

/** Popular dishes shown in Explore Menu grid. */
export const bestsellers: BestsellerItem[] = [
  {
    id: 'smash-burger',
    name: 'Smash Burger',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'pepperoni-pizza',
    name: 'Pepperoni Pizza',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'crispy-wings',
    name: 'Crispy Wings',
    image:
      'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'loaded-fries',
    name: 'Loaded Fries',
    image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'zinger-wrap',
    name: 'Zinger Wrap',
    image:
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'choc-shake',
    name: 'Choco Shake',
    image:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80',
  },
];

export const promos: Promo[] = [
  {
    id: 'bogo',
    title: 'Buy 1 Get 1',
    subtitle: 'On selected burgers this week',
    badge: 'LIMITED',
    accent: '#FF7622',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'free-delivery',
    title: 'Free Delivery',
    subtitle: 'Orders above Rs. 1,499',
    badge: 'DEAL',
    accent: '#E53935',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'combo',
    title: 'Family Combo',
    subtitle: 'Save up to 30% tonight',
    badge: 'HOT',
    accent: '#F57C00',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
  },
];

export const foods: FoodItem[] = [
  {
    id: 'pepperoni-pizza',
    name: 'Pepperoni Pizza',
    category: 'Pizza',
    rating: '4.8',
    price: 'Rs. 1,299',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'classic-burger',
    name: 'Classic Smash Burger',
    category: 'Burgers',
    rating: '4.7',
    price: 'Rs. 799',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'loaded-hot-dog',
    name: 'Loaded Hot Dog',
    category: 'Hot Dog',
    rating: '4.6',
    price: 'Rs. 549',
    image:
      'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'bbq-wings',
    name: 'BBQ Chicken Wings',
    category: 'Burgers',
    rating: '4.9',
    price: 'Rs. 999',
    image:
      'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'fresh-lemonade',
    name: 'Fresh Lemonade',
    category: 'Drinks',
    rating: '4.5',
    price: 'Rs. 249',
    image:
      'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'choco-lava',
    name: 'Choco Lava Cake',
    category: 'Dessert',
    rating: '4.8',
    price: 'Rs. 399',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80',
  },
];

export const restaurants: Restaurant[] = [
  {
    id: 'flame-grill',
    name: 'Flame Grill Kitchen',
    tags: 'Burgers · Wings · Fries',
    category: 'Burgers',
    rating: '4.8',
    delivery: 'Free',
    time: '25-35 min',
    isFreeDelivery: true,
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'slice-house',
    name: 'The Slice House',
    tags: 'Pizza · Pasta · Garlic Bread',
    category: 'Pizza',
    rating: '4.9',
    delivery: 'Free',
    time: '20-30 min',
    isFreeDelivery: true,
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'sauce-lab',
    name: 'Sauce Lab Express',
    tags: 'Burgers · Hot Dog · Combos',
    category: 'Hot Dog',
    rating: '4.7',
    delivery: 'Rs. 99',
    time: '30-40 min',
    image:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'sweet-spot',
    name: 'Sweet Spot Desserts',
    tags: 'Dessert · Shakes · Coffee',
    category: 'Dessert',
    rating: '4.6',
    delivery: 'Free',
    time: '15-25 min',
    isFreeDelivery: true,
    image:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
  },
];
