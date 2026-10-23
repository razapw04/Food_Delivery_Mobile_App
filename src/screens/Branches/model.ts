export type Branch = {
  id: string;
  name: string;
  address: string;
  openFrom: string;
  openTo: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  logo: string;
};

export const branches: Branch[] = [
  {
    id: 'gulberg',
    name: 'Gulberg Branch',
    address: 'MM Alam Road, Gulberg III, Lahore',
    openFrom: '11:00',
    openTo: '23:30',
    latitude: 31.5102,
    longitude: 74.3441,
    distanceKm: 1.8,
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'dha',
    name: 'DHA Phase 5 Branch',
    address: 'Y Block Market, DHA Phase 5, Lahore',
    openFrom: '10:00',
    openTo: '00:00',
    latitude: 31.4697,
    longitude: 74.4092,
    distanceKm: 4.2,
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'johar',
    name: 'Johar Town Branch',
    address: 'Near Emporium Mall, Johar Town, Lahore',
    openFrom: '12:00',
    openTo: '22:00',
    latitude: 31.4697,
    longitude: 74.2728,
    distanceKm: 6.5,
    logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'model-town',
    name: 'Model Town Branch',
    address: 'F Block Market, Model Town, Lahore',
    openFrom: '11:00',
    openTo: '23:00',
    latitude: 31.4822,
    longitude: 74.3263,
    distanceKm: 3.1,
    logo: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=120&q=80',
  },
];

/** Converts "HH:mm" to minutes from midnight. "00:00" as close time means midnight (1440). */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  if (hours === 0 && minutes === 0) {
    return 24 * 60;
  }
  return hours * 60 + minutes;
};

export const isBranchOpenNow = (openFrom: string, openTo: string): boolean => {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const from = timeToMinutes(openFrom);
  let to = timeToMinutes(openTo);

  if (to <= from) {
    // Overnight hours e.g. 10:00–00:00
    return current >= from || current < to;
  }

  return current >= from && current <= to;
};

export const formatBranchHours = (openFrom: string, openTo: string): string => {
  const format = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  return `${format(openFrom)} - ${format(openTo)}`;
};
