import React from 'react';
import {Text, View} from 'react-native';
import type {ChannelRevenueBreakdown} from '../../utils/revenueFromOrders';
import {styles} from './styles';

const formatPrice = (value: number) =>
  `Rs. ${value.toLocaleString('en-PK')}`;

type Props = {
  breakdown: ChannelRevenueBreakdown;
  /** Defaults to "today" focus; week/month still shown. */
  title?: string;
};

const ChannelBlock = ({
  label,
  today,
  week,
  month,
  ordersToday,
  emphasize,
}: {
  label: string;
  today: number;
  week: number;
  month: number;
  ordersToday: number;
  emphasize?: boolean;
}) => (
  <View style={[styles.block, emphasize ? styles.blockEmphasize : null]}>
    <Text style={styles.blockLabel}>{label}</Text>
    <Text style={styles.blockToday}>{formatPrice(today)}</Text>
    <Text style={styles.blockMeta}>Today · {ordersToday} orders</Text>
    <View style={styles.blockRow}>
      <Text style={styles.blockSide}>Week {formatPrice(week)}</Text>
      <Text style={styles.blockSide}>Month {formatPrice(month)}</Text>
    </View>
  </View>
);

const ChannelRevenueCards = ({
  breakdown,
  title = 'Live sales by channel',
}: Props) => (
  <View style={styles.wrap}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>
      Online (app) and POS (counter) are tracked separately, with a combined
      total.
    </Text>

    <ChannelBlock
      label="Online orders"
      today={breakdown.online.today}
      week={breakdown.online.week}
      month={breakdown.online.month}
      ordersToday={breakdown.online.ordersToday}
    />
    <ChannelBlock
      label="POS orders"
      today={breakdown.pos.today}
      week={breakdown.pos.week}
      month={breakdown.pos.month}
      ordersToday={breakdown.pos.ordersToday}
    />
    <ChannelBlock
      label="Combined"
      today={breakdown.combined.today}
      week={breakdown.combined.week}
      month={breakdown.combined.month}
      ordersToday={breakdown.combined.ordersToday}
      emphasize
    />
  </View>
);

export default ChannelRevenueCards;
