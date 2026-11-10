import AsyncStorage from '@react-native-async-storage/async-storage';

const FEEDBACK_KEY = '@food_app/feedback';

export type FeedbackEntry = {
  id: string;
  userEmail: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const readAll = async (): Promise<FeedbackEntry[]> => {
  const raw = await AsyncStorage.getItem(FEEDBACK_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FeedbackEntry[]) : [];
  } catch {
    return [];
  }
};

const writeAll = async (items: FeedbackEntry[]) => {
  await AsyncStorage.setItem(FEEDBACK_KEY, JSON.stringify(items));
};

export const listFeedbackForUser = async (
  email: string,
): Promise<FeedbackEntry[]> => {
  const normalized = email.trim().toLowerCase();
  const items = await readAll();
  return items
    .filter(item => item.userEmail === normalized)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

export const createFeedback = async (payload: {
  userEmail: string;
  userName: string;
  rating: number;
  comment: string;
}): Promise<{ok: true} | {ok: false; error: string}> => {
  const rating = Math.round(payload.rating);
  if (rating < 1 || rating > 5) {
    return {ok: false, error: 'Select a rating from 1 to 5 stars.'};
  }

  const comment = payload.comment.trim();
  if (comment.length < 3) {
    return {ok: false, error: 'Please write a short comment (at least 3 characters).'};
  }

  const items = await readAll();
  const next: FeedbackEntry = {
    id: `fb-${Date.now()}`,
    userEmail: payload.userEmail.trim().toLowerCase(),
    userName: payload.userName.trim() || 'Customer',
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };
  await writeAll([next, ...items]);
  return {ok: true};
};
