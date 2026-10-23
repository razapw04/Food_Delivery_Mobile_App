export type MenuCategory = {
  id: string;
  name: string;
  itemCount: number;
  image: string;
};

export const menuCategories: MenuCategory[] = [
  {
    id: 'burgers',
    name: 'Burgers',
    itemCount: 12,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pizza',
    name: 'Pizza',
    itemCount: 8,
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'wings',
    name: 'Wings & Sides',
    itemCount: 10,
    image:
      'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'wraps',
    name: 'Wraps',
    itemCount: 6,
    image:
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'drinks',
    name: 'Drinks',
    itemCount: 9,
    image:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'desserts',
    name: 'Desserts',
    itemCount: 7,
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
  },
];
