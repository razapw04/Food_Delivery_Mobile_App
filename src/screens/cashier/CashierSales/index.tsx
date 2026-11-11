import React from 'react';
import {Pressable, ScrollView, StatusBar, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import ChannelRevenueCards, {
  type RevenuePeriod,
} from '../../../components/ChannelRevenueCards';
import BranchProductSalesLists from '../../../components/BranchProductSalesLists';
import {styles} from './styles';
import useController, {formatPrice} from './useController';

const PERIODS: {key: RevenuePeriod; label: string}[] = [
  {key: 'today', label: 'Today'},
  {key: 'week', label: 'Week'},
  {key: 'month', label: 'Month'},
  {key: 'custom', label: 'Custom'},
];

const CashierSalesScreen = () => {
  const {
    branch,
    period,
    setPeriod,
    monthOptions,
    customYear,
    customMonthIndex,
    customLabel,
    selectCustomMonth,
    channelBreakdown,
    productSales,
    handleBack,
  } = useController();

  const combinedAmount =
    period === 'week'
      ? channelBreakdown.combined.week
      : period === 'month'
        ? channelBreakdown.combined.month
        : period === 'custom'
          ? channelBreakdown.combined.custom
          : channelBreakdown.combined.today;

  const ordersCount =
    period === 'custom'
      ? channelBreakdown.combined.ordersCustom
      : channelBreakdown.combined.ordersToday;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Back to orders"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleBack}>
          <Icon name="arrow-left" size={22} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Branch Sales</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Live sales for {branch?.name ?? 'your branch'}. Use Today / Week /
            Month, or Custom to pick any recent month.
          </Text>
        </View>

        {branch ? (
          <>
            <Text style={styles.sectionTitle}>{branch.name}</Text>

            <View style={styles.periodRow}>
              {PERIODS.map(item => {
                const active = period === item.key;
                return (
                  <Pressable
                    key={item.key}
                    accessibilityRole="button"
                    style={[
                      styles.periodChip,
                      active && styles.periodChipActive,
                    ]}
                    onPress={() => {
                      if (item.key === 'custom') {
                        selectCustomMonth(customYear, customMonthIndex);
                        return;
                      }
                      setPeriod(item.key);
                    }}>
                    <Text
                      style={[
                        styles.periodChipText,
                        active && styles.periodChipTextActive,
                      ]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {period === 'custom' ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.monthChipsRow}>
                {monthOptions.map(option => {
                  const active =
                    option.year === customYear &&
                    option.monthIndex === customMonthIndex;
                  return (
                    <Pressable
                      key={option.key}
                      accessibilityRole="button"
                      style={[styles.monthChip, active && styles.monthChipActive]}
                      onPress={() =>
                        selectCustomMonth(option.year, option.monthIndex)
                      }>
                      <Text
                        style={[
                          styles.monthChipText,
                          active && styles.monthChipTextActive,
                        ]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : null}

            <ChannelRevenueCards
              breakdown={channelBreakdown}
              period={period}
              customLabel={customLabel}
            />

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>
                  Combined ·{' '}
                  {period === 'custom'
                    ? customLabel
                    : period === 'week'
                      ? 'Week'
                      : period === 'month'
                        ? 'Month'
                        : 'Today'}
                </Text>
                <Text style={styles.incomeValue}>
                  {formatPrice(combinedAmount)}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>
                  {period === 'today' || period === 'custom'
                    ? 'Orders'
                    : 'Orders today'}
                </Text>
                <Text style={styles.statValue}>{ordersCount}</Text>
              </View>
            </View>

            <BranchProductSalesLists
              most={productSales.most}
              hot={productSales.hot}
              least={productSales.least}
              meta={
                period === 'custom'
                  ? customLabel
                  : `${branch.name} · selected period`
              }
              emptyText="No countable sales yet for this period."
            />
          </>
        ) : (
          <View style={styles.card}>
            <Text style={styles.saleTitle}>No branch assigned</Text>
            <Text style={styles.saleMeta}>
              Ask super admin to assign this cashier to a branch.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CashierSalesScreen;
