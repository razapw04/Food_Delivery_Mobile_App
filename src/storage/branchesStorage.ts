import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  branches as seedBranches,
  type Branch,
} from '../screens/user/Branches/model';

const BRANCHES_KEY = '@food_app/admin_branches';

const DEFAULT_LOGO =
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80';

export type AdminBranch = Branch;

const normalizeBranch = (item: Partial<Branch>, fallbackId: string): Branch => ({
  id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : fallbackId,
  name: typeof item.name === 'string' && item.name.trim() ? item.name.trim() : 'Branch',
  address:
    typeof item.address === 'string' && item.address.trim()
      ? item.address.trim()
      : 'Address pending',
  openFrom:
    typeof item.openFrom === 'string' && item.openFrom.trim()
      ? item.openFrom.trim()
      : '11:00',
  openTo:
    typeof item.openTo === 'string' && item.openTo.trim()
      ? item.openTo.trim()
      : '23:00',
  latitude: Number.isFinite(item.latitude) ? Number(item.latitude) : 31.5204,
  longitude: Number.isFinite(item.longitude) ? Number(item.longitude) : 74.3587,
  distanceKm: Number.isFinite(item.distanceKm) ? Number(item.distanceKm) : 0,
  logo:
    typeof item.logo === 'string' && item.logo.trim()
      ? item.logo.trim()
      : DEFAULT_LOGO,
});

export const getStoredBranches = async (): Promise<Branch[] | null> => {
  const raw = await AsyncStorage.getItem(BRANCHES_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed.map((item, index) =>
      normalizeBranch(item ?? {}, `branch-${index + 1}`),
    );
  } catch {
    return null;
  }
};

/** Admin-managed list when present; otherwise seed catalog branches. */
export const listBranches = async (): Promise<Branch[]> => {
  const stored = await getStoredBranches();
  return stored ?? seedBranches.map(item => ({...item}));
};

export const saveBranches = async (branches: Branch[]): Promise<void> => {
  await AsyncStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
};

export const upsertBranch = async (branch: Branch): Promise<Branch[]> => {
  const existing = await listBranches();
  const index = existing.findIndex(item => item.id === branch.id);
  const next =
    index >= 0
      ? existing.map((item, i) => (i === index ? normalizeBranch(branch, branch.id) : item))
      : [normalizeBranch(branch, branch.id), ...existing];
  await saveBranches(next);
  return next;
};

export const removeBranch = async (branchId: string): Promise<Branch[]> => {
  const existing = await listBranches();
  const next = existing.filter(item => item.id !== branchId);
  await saveBranches(next);
  return next;
};

export const createBranchId = (name: string) => {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${slug || 'branch'}-${Date.now().toString(36)}`;
};

export const defaultBranchLogo = DEFAULT_LOGO;
