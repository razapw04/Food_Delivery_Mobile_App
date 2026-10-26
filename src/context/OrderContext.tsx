import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type {Branch} from '../screens/Branches/model';

export type OrderMode = 'delivery' | 'pickup';

type OrderContextValue = {
  orderMode: OrderMode;
  selectedBranch: Branch | null;
  setOrderMode: (mode: OrderMode) => void;
  selectBranch: (branch: Branch) => void;
  clearBranch: () => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export const OrderProvider = ({children}: {children: React.ReactNode}) => {
  const [orderMode, setOrderModeState] = useState<OrderMode>('delivery');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const setOrderMode = useCallback((mode: OrderMode) => {
    setOrderModeState(mode);
  }, []);

  const selectBranch = useCallback((branch: Branch) => {
    setSelectedBranch(branch);
    setOrderModeState('pickup');
  }, []);

  const clearBranch = useCallback(() => {
    setSelectedBranch(null);
  }, []);

  const value = useMemo(
    () => ({
      orderMode,
      selectedBranch,
      setOrderMode,
      selectBranch,
      clearBranch,
    }),
    [orderMode, selectedBranch, setOrderMode, selectBranch, clearBranch],
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextValue => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};
