export type MenuCategory = {
  id: string;
  name: string;
  image: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: string;
  image: string;
};

export const menuCategories: MenuCategory[] = [
  {
    id: 'pizza',
    name: 'Pizza',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'deals',
    name: 'Deals',
    image:
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'sandwich',
    name: 'Sandwich',
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'burgers',
    name: 'Burgers',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'side-orders',
    name: 'Side Orders',
    image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'soft-drink',
    name: 'Soft Drink',
    image:
      'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'addons',
    name: 'Addons',
    image:
      'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'special-pizza',
    name: 'Special Pizza',
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=200&q=80',
  },
];

export const menuItems: MenuItem[] = [
  {
    id: 'piz-1',
    categoryId: 'pizza',
    name: 'Margherita',
    description: 'Fresh mozzarella, basil & tomato sauce',
    price: 'Rs. 1,299',
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'piz-2',
    categoryId: 'pizza',
    name: 'Pepperoni Feast',
    description: 'Loaded pepperoni with mozzarella',
    price: 'Rs. 1,699',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'piz-3',
    categoryId: 'pizza',
    name: 'BBQ Chicken',
    description: 'Smoky BBQ sauce, chicken & onions',
    price: 'Rs. 1,799',
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'deal-1',
    categoryId: 'deals',
    name: 'Family Feast',
    description: '2 large pizzas + fries + 1.5L drink',
    price: 'Rs. 3,499',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'deal-2',
    categoryId: 'deals',
    name: 'Burger Combo',
    description: '2 burgers + fries + 2 drinks',
    price: 'Rs. 1,899',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'deal-3',
    categoryId: 'deals',
    name: 'Weekday Special',
    description: 'Any medium pizza + soft drink',
    price: 'Rs. 1,499',
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'san-1',
    categoryId: 'sandwich',
    name: 'Club Sandwich',
    description: 'Triple layer chicken, egg & veggies',
    price: 'Rs. 799',
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'san-2',
    categoryId: 'sandwich',
    name: 'Chicken Grilled',
    description: 'Grilled chicken with garlic mayo',
    price: 'Rs. 749',
    image:
      'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'san-3',
    categoryId: 'sandwich',
    name: 'Crispy Zinger',
    description: 'Crispy fillet, lettuce & spicy sauce',
    price: 'Rs. 849',
    image:
      'https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'bur-1',
    categoryId: 'burgers',
    name: 'Smash Burger',
    description: 'Double smash patty with cheddar',
    price: 'Rs. 999',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'bur-2',
    categoryId: 'burgers',
    name: 'Classic Beef',
    description: 'Beef patty, lettuce, tomato & pickles',
    price: 'Rs. 899',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'bur-3',
    categoryId: 'burgers',
    name: 'Crispy Chicken',
    description: 'Crispy chicken with house sauce',
    price: 'Rs. 949',
    image:
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'side-1',
    categoryId: 'side-orders',
    name: 'Loaded Fries',
    description: 'Cheese, jalapeños & special sauce',
    price: 'Rs. 499',
    image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'side-2',
    categoryId: 'side-orders',
    name: 'Onion Rings',
    description: 'Crispy golden onion rings',
    price: 'Rs. 399',
    image:
      'https://images.unsplash.com/photo-1639024471283-035662674694?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'side-3',
    categoryId: 'side-orders',
    name: 'Garlic Bread',
    description: 'Toasted with garlic butter',
    price: 'Rs. 349',
    image:
      'https://images.unsplash.com/photo-1573140401552-3fab57d5da39?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'drink-1',
    categoryId: 'soft-drink',
    name: 'Coca-Cola',
    description: 'Chilled 500ml',
    price: 'Rs. 149',
    image:
      'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'drink-2',
    categoryId: 'soft-drink',
    name: 'Sprite',
    description: 'Chilled 500ml',
    price: 'Rs. 149',
    image:
      'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'drink-3',
    categoryId: 'soft-drink',
    name: 'Fresh Lemonade',
    description: 'House-made lemonade',
    price: 'Rs. 199',
    image:
      'https://images.unsplash.com/photo-1523677011783-c91d1bbe2fdc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'add-1',
    categoryId: 'addons',
    name: 'Extra Cheese',
    description: 'Add melted cheese to any item',
    price: 'Rs. 99',
    image:
      'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'add-2',
    categoryId: 'addons',
    name: 'Dip Sauce Pack',
    description: 'Garlic, BBQ & spicy mayo',
    price: 'Rs. 149',
    image:
      'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'add-3',
    categoryId: 'addons',
    name: 'Extra Patty',
    description: 'Add an extra burger patty',
    price: 'Rs. 249',
    image:
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'spiz-1',
    categoryId: 'special-pizza',
    name: 'Tandoori Special',
    description: 'Tandoori chicken, onions & peppers',
    price: 'Rs. 2,199',
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'spiz-2',
    categoryId: 'special-pizza',
    name: 'Four Cheese',
    description: 'Mozzarella, cheddar, parmesan & feta',
    price: 'Rs. 2,099',
    image:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'spiz-3',
    categoryId: 'special-pizza',
    name: 'Supreme Deluxe',
    description: 'Loaded meats & garden veggies',
    price: 'Rs. 2,399',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
  },
];

/** Featured products shown under Popular searches on Explore */
export const popularMenuItemIds = [
  'piz-2',
  'bur-1',
  'deal-2',
  'san-1',
  'side-1',
  'spiz-1',
] as const;

export const getMenuItemById = (id: string): MenuItem | undefined =>
  menuItems.find(item => item.id === id);

export const popularMenuItems: MenuItem[] = popularMenuItemIds
  .map(id => getMenuItemById(id))
  .filter((item): item is MenuItem => item != null);
