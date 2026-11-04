import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  branches as localBranches,
  type Branch,
} from '../screens/Branches/model';
import {
  menuCategories as localMenuCategories,
  menuItems as localMenuItems,
  popularMenuItemIds,
  type MenuCategory,
  type MenuItem,
} from '../screens/Menu/model';
import {
  fetchBranches,
  fetchMenuCategories,
  fetchMenuItems,
} from '../services/catalogApi';

type CatalogContextValue = {
  isLoading: boolean;
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
  popularMenuItems: MenuItem[];
  branches: Branch[];
  getMenuItemById: (id: string) => MenuItem | undefined;
  refreshCatalog: () => Promise<void>;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export const CatalogProvider = ({children}: {children: React.ReactNode}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [menuCategories, setMenuCategories] =
    useState<MenuCategory[]>(localMenuCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(localMenuItems);
  const [branches, setBranches] = useState<Branch[]>(localBranches);

  const refreshCatalog = useCallback(async () => {
    try {
      const [categories, items, nextBranches] = await Promise.all([
        fetchMenuCategories(),
        fetchMenuItems(),
        fetchBranches(),
      ]);

      if (categories.length > 0) {
        setMenuCategories(categories);
      }
      if (items.length > 0) {
        setMenuItems(items);
      }
      if (nextBranches.length > 0) {
        setBranches(nextBranches);
      }
    } catch {
      // Keep local seed data if API is unreachable.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const getMenuItemById = useCallback(
    (id: string) => menuItems.find(item => item.id === id),
    [menuItems],
  );

  const popularMenuItems = useMemo(
    () =>
      popularMenuItemIds
        .map(id => menuItems.find(item => item.id === id))
        .filter((item): item is MenuItem => item != null),
    [menuItems],
  );

  const value = useMemo(
    () => ({
      isLoading,
      menuCategories,
      menuItems,
      popularMenuItems,
      branches,
      getMenuItemById,
      refreshCatalog,
    }),
    [
      isLoading,
      menuCategories,
      menuItems,
      popularMenuItems,
      branches,
      getMenuItemById,
      refreshCatalog,
    ],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
};

export const useCatalog = (): CatalogContextValue => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within CatalogProvider');
  }
  return context;
};
