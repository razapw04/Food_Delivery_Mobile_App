import type {Branch} from '../screens/Branches/model';
import type {Category, Restaurant} from '../screens/Home/model';
import type {MenuCategory, MenuItem} from '../screens/Menu/model';
import {apiRequest} from './apiClient';

export const fetchCategories = () =>
  apiRequest<Category[]>('/api/categories');

export const fetchRestaurants = (category?: string) => {
  const query =
    category && category !== 'all'
      ? `?category=${encodeURIComponent(category)}`
      : '';
  return apiRequest<Restaurant[]>(`/api/restaurants${query}`);
};

export const fetchMenuCategories = () =>
  apiRequest<MenuCategory[]>('/api/menu/categories');

export const fetchMenuItems = (categoryId?: string) => {
  const query = categoryId
    ? `?categoryId=${encodeURIComponent(categoryId)}`
    : '';
  return apiRequest<MenuItem[]>(`/api/menu/items${query}`);
};

export const fetchMenuItemById = (id: string) =>
  apiRequest<MenuItem>(`/api/menu/items/${encodeURIComponent(id)}`);

export const fetchBranches = () => apiRequest<Branch[]>('/api/branches');
