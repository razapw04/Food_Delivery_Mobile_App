import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getStoredFavoriteIds,
  saveStoredFavoriteIds,
} from '../storage/favoritesStorage';
import type {MenuItem} from '../screens/user/Menu/model';
import {useCatalog} from './CatalogContext';

type FavoritesContextValue = {
  favoriteIds: string[];
  favoriteItems: MenuItem[];
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (itemId: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export const FavoritesProvider = ({children}: {children: React.ReactNode}) => {
  const {menuItems} = useCatalog();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const ids = await getStoredFavoriteIds();
      if (active) {
        setFavoriteIds(ids);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback(async (ids: string[]) => {
    setFavoriteIds(ids);
    await saveStoredFavoriteIds(ids);
  }, []);

  const isFavorite = useCallback(
    (itemId: string) => favoriteIds.includes(itemId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    (itemId: string) => {
      const next = favoriteIds.includes(itemId)
        ? favoriteIds.filter(id => id !== itemId)
        : [...favoriteIds, itemId];
      persist(next);
    },
    [favoriteIds, persist],
  );

  const favoriteItems = useMemo(
    () =>
      favoriteIds
        .map(id => menuItems.find(item => item.id === id))
        .filter((item): item is MenuItem => Boolean(item)),
    [favoriteIds, menuItems],
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      favoriteItems,
      isFavorite,
      toggleFavorite,
    }),
    [favoriteIds, favoriteItems, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextValue => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
