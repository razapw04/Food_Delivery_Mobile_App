export type VoucherOffer = {
  id: string;
  code: string;
  title: string;
  description: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
};

export const AVAILABLE_VOUCHERS: VoucherOffer[] = [
  {
    id: 'welcome10',
    code: 'WELCOME10',
    title: 'Welcome 10%',
    description: '10% off on orders of Rs. 800 or more.',
    type: 'percent',
    value: 10,
    minOrder: 800,
  },
  {
    id: 'flat150',
    code: 'SAVE150',
    title: 'Flat Rs. 150 off',
    description: 'Save Rs. 150 on orders of Rs. 1,200 or more.',
    type: 'flat',
    value: 150,
    minOrder: 1200,
  },
  {
    id: 'weekend20',
    code: 'WEEKEND20',
    title: 'Weekend 20%',
    description: '20% off (max Rs. 400) on orders of Rs. 1,500 or more.',
    type: 'percent',
    value: 20,
    minOrder: 1500,
  },
];

export const calcVoucherDiscount = (
  voucher: VoucherOffer | null,
  cartTotal: number,
): number => {
  if (!voucher || cartTotal < voucher.minOrder) {
    return 0;
  }
  if (voucher.type === 'flat') {
    return Math.min(cartTotal, voucher.value);
  }
  const percentOff = Math.round((cartTotal * voucher.value) / 100);
  // Cap percent vouchers so totals stay sensible in demo.
  const cap = voucher.id === 'weekend20' ? 400 : percentOff;
  return Math.min(cartTotal, Math.min(percentOff, cap));
};

export const formatVoucherValue = (voucher: VoucherOffer) =>
  voucher.type === 'percent'
    ? `${voucher.value}% off`
    : `Rs. ${voucher.value} off`;
