import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  variation: string;
  toppings: string[];
  unitPrice: number;
  quantity: number;
};

type AddCartItemInput = {
  productId: string;
  name: string;
  image: string;
  variation: string;
  toppings: string[];
  unitPrice: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  cartTotal: number;
  addItem: (item: AddCartItemInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const buildCartItemId = (item: AddCartItemInput) =>
  `${item.productId}-${item.variation}-${[...item.toppings].sort().join('|')}`;

export const CartProvider = ({children}: {children: React.ReactNode}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((input: AddCartItemInput) => {
    const id = buildCartItemId(input);
    setItems(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item =>
          item.id === id
            ? {...item, quantity: item.quantity + input.quantity}
            : item,
        );
      }

      return [
        ...prev,
        {
          id,
          productId: input.productId,
          name: input.name,
          image: input.image,
          variation: input.variation,
          toppings: input.toppings,
          unitPrice: input.unitPrice,
          quantity: input.quantity,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems(prev => {
      if (quantity <= 0) {
        return prev.filter(item => item.id !== id);
      }
      return prev.map(item =>
        item.id === id ? {...item, quantity} : item,
      );
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const cartTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      cartTotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, itemCount, cartTotal, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
