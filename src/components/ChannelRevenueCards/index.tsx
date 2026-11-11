import React from 'react';
import {Text, View} from 'react-native';
import type {
  ChannelRevenueBreakdown,
  RevenuePeriod,
} from '../../utils/revenueFromOrders';
import {styles} from './styles';

const formatPrice = (value: number) =>
  `Rs. ${value.toLocaleString('en-PK')}`;

export type {RevenuePeriod};

type Props = {
  breakdown: ChannelRevenueBreakdown;
  period?: RevenuePeriod;
  title?: string;
  /** Shown when period is custom (e.g. "Mar 2026"). */
  customLabel?: string;
};

const amountForPeriod = (
  totals: ChannelRevenueBreakdown['online'],
  period: RevenuePeriod,
) => {
  if (period === 'week') {
    return totals.week;
  }
  if (period === 'month') {
    return totals.month;
  }
  if (period === 'year') {
    return totals.year;
  }
  if (period === 'custom') {
    return totals.custom;
  }
  return totals.today;
};

const ordersForPeriod = (
  totals: ChannelRevenueBreakdown['online'],
  period: RevenuePeriod,
) => {
  if (period === 'custom') {
    return totals.ordersCustom;
  }
  if (period === 'today') {
    return totals.ordersToday;
  }
  return null;
};

const periodHint = (period: RevenuePeriod, customLabel?: string) => {
  if (period === 'week') {
    return 'This week';
  }
  if (period === 'month') {
    return 'This month';
  }
  if (period === 'year') {
    return 'This year';
  }
  if (period === 'custom') {
    return customLabel ?? 'Custom';
  }
  return 'Today';
};

const ChannelBlock = ({
  label,
  amount,
  orderCount,
  emphasize,
  hint,
}: {
  label: string;
  amount: number;
  orderCount: number | null;
  emphasize?: boolean;
  hint: string;
}) => (
  <View style={[styles.block, emphasize ? styles.blockEmphasize : null]}>
    <Text
      style={[styles.blockLabel, emphasize ? styles.blockLabelEmphasize : null]}>
      {label}
    </Text>
    <Text
      style={[styles.blockValue, emphasize ? styles.blockValueEmphasize : null]}
      numberOfLines={1}
      adjustsFontSizeToFit>
      {formatPrice(amount)}
    </Text>
    <Text style={styles.blockMeta}>
      {orderCount != null ? `${orderCount} orders` : hint}
    </Text>
  </View>
);

const ChannelRevenueCards = ({
  breakdown,
  period = 'today',
  title = 'Sales by channel',
  customLabel,
}: Props) => {
  const hint = periodHint(period, customLabel);

  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>

      <View style={styles.grid}>
        <ChannelBlock
          label="Online"
          amount={amountForPeriod(breakdown.online, period)}
          orderCount={ordersForPeriod(breakdown.online, period)}
          hint={hint}
        />
        <ChannelBlock
          label="POS"
          amount={amountForPeriod(breakdown.pos, period)}
          orderCount={ordersForPeriod(breakdown.pos, period)}
          hint={hint}
        />
        <ChannelBlock
          label="Combined"
          amount={amountForPeriod(breakdown.combined, period)}
          orderCount={ordersForPeriod(breakdown.combined, period)}
          hint={hint}
          emphasize
        />
      </View>
    </View>
  );
};

export default ChannelRevenueCards;
