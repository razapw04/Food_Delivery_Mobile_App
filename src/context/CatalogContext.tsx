import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {queryKeys} from '../lib/queryClient';
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
import {ApiError} from '../services/apiClient';
import {
  fetchBranches,
  fetchMenuCategories,
  fetchMenuItems,
} from '../services/catalogApi';

type CatalogPayload = {
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
  branches: Branch[];
  usedFallback: boolean;
  errorMessage: string | null;
};

type CatalogContextValue = {
  isLoading: boolean;
  error: string | null;
  isUsingFallback: boolean;
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
  popularMenuItems: MenuItem[];
  branches: Branch[];
  getMenuItemById: (id: string) => MenuItem | undefined;
  refreshCatalog: () => Promise<void>;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

const fetchCatalog = async (): Promise<CatalogPayload> => {
  try {
    const [categories, items, nextBranches] = await Promise.all([
      fetchMenuCategories(),
      fetchMenuItems(),
      fetchBranches(),
    ]);

    return {
      menuCategories:
        categories.length > 0 ? categories : localMenuCategories,
      menuItems: items.length > 0 ? items : localMenuItems,
      branches: nextBranches.length > 0 ? nextBranches : localBranches,
      usedFallback: false,
      errorMessage: null,
    };
  } catch (err) {
    return {
      menuCategories: localMenuCategories,
      menuItems: localMenuItems,
      branches: localBranches,
      usedFallback: true,
      errorMessage:
        err instanceof ApiError
          ? err.message
          : "Couldn't load latest menu. Showing saved data.",
    };
  }
};

export const CatalogProvider = ({children}: {children: React.ReactNode}) => {
  const queryClient = useQueryClient();
  const catalogQuery = useQuery({
    queryKey: queryKeys.catalog,
    queryFn: fetchCatalog,
  });

  const payload = catalogQuery.data;
  const menuCategories = payload?.menuCategories ?? localMenuCategories;
  const menuItems = payload?.menuItems ?? localMenuItems;
  const branches = payload?.branches ?? localBranches;
  const isUsingFallback = payload?.usedFallback ?? false;
  const error = payload?.errorMessage ?? null;

  const refreshCatalog = useCallback(async () => {
    await queryClient.invalidateQueries({queryKey: queryKeys.catalog});
  }, [queryClient]);

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
      isLoading: catalogQuery.isPending,
      error,
      isUsingFallback,
      menuCategories,
      menuItems,
      popularMenuItems,
      branches,
      getMenuItemById,
      refreshCatalog,
    }),
    [
      catalogQuery.isPending,
      error,
      isUsingFallback,
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
