import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  calcVoucherDiscount,
  type VoucherOffer,
} from '../screens/user/Voucher/model';
import {useAuth} from './AuthContext';

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
  appliedVoucher: VoucherOffer | null;
  discountAmount: number;
  applyVoucher: (voucher: VoucherOffer) => {ok: true} | {ok: false; error: string};
  clearVoucher: () => void;
  addItem: (item: AddCartItemInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const buildCartItemId = (item: AddCartItemInput) =>
  `${item.productId}-${item.variation}-${[...item.toppings].sort().join('|')}`;

export const CartProvider = ({children}: {children: React.ReactNode}) => {
  const {user} = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherOffer | null>(
    null,
  );
  const lastUserEmailRef = useRef<string | null>(null);

  // New / switched accounts always start with an empty cart.
  useEffect(() => {
    const email = user?.email?.toLowerCase() ?? null;
    if (lastUserEmailRef.current === email) {
      return;
    }
    lastUserEmailRef.current = email;
    setItems([]);
    setAppliedVoucher(null);
  }, [user?.email]);

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
    setAppliedVoucher(null);
  }, []);

  const clearVoucher = useCallback(() => {
    setAppliedVoucher(null);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const cartTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );

  const applyVoucher = useCallback(
    (voucher: VoucherOffer) => {
      if (cartTotal <= 0) {
        return {ok: false as const, error: 'Add items to your cart first.'};
      }
      if (cartTotal < voucher.minOrder) {
        return {
          ok: false as const,
          error: `Minimum order for this voucher is Rs. ${voucher.minOrder.toLocaleString('en-PK')}.`,
        };
      }
      setAppliedVoucher(voucher);
      return {ok: true as const};
    },
    [cartTotal],
  );

  const discountAmount = useMemo(
    () => calcVoucherDiscount(appliedVoucher, cartTotal),
    [appliedVoucher, cartTotal],
  );

  // Drop voucher if cart no longer meets minimum.
  useEffect(() => {
    if (!appliedVoucher) {
      return;
    }
    if (cartTotal < appliedVoucher.minOrder) {
      setAppliedVoucher(null);
    }
  }, [appliedVoucher, cartTotal]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      cartTotal,
      appliedVoucher,
      discountAmount,
      applyVoucher,
      clearVoucher,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      itemCount,
      cartTotal,
      appliedVoucher,
      discountAmount,
      applyVoucher,
      clearVoucher,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ],
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
