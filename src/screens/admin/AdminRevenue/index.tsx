import React from 'react';
import {Pressable, ScrollView, StatusBar, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import ChannelRevenueCards from '../../../components/ChannelRevenueCards';
import FinanceCharts from './FinanceCharts';
import type {BranchRevenueSnapshot} from './mockData';
import {styles} from './styles';
import useController, {formatPrice} from './useController';

const RevenueBody = ({
  snapshot,
  title,
}: {
  snapshot: BranchRevenueSnapshot;
  title: string;
}) => (
  <>
    <Text style={styles.sectionTitle}>{title}</Text>

    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Income today</Text>
        <Text style={styles.incomeValue}>{formatPrice(snapshot.today)}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Expense today</Text>
        <Text style={styles.expenseValue}>
          {formatPrice(snapshot.expenseToday)}
        </Text>
      </View>
    </View>

    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Income this week</Text>
        <Text style={styles.statValue}>{formatPrice(snapshot.week)}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Expense this week</Text>
        <Text style={styles.statValue}>
          {formatPrice(snapshot.expenseWeek)}
        </Text>
      </View>
    </View>

    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Orders today</Text>
        <Text style={styles.statValue}>{snapshot.ordersToday}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Net today</Text>
        <Text
          style={
            snapshot.today - snapshot.expenseToday >= 0
              ? styles.incomeValue
              : styles.expenseValue
          }>
          {formatPrice(snapshot.today - snapshot.expenseToday)}
        </Text>
      </View>
    </View>

    <FinanceCharts snapshot={snapshot} />

    <Text style={styles.sectionTitle}>Top selling products</Text>
    <View style={styles.card}>
      {snapshot.topProducts.map((item, index) => (
        <View key={item.name} style={styles.topRow}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
          <Text style={styles.topName}>{item.name}</Text>
          <Text style={styles.topUnits}>{item.units} sold</Text>
        </View>
      ))}
    </View>

    <Text style={styles.sectionTitle}>Recent sales</Text>
    <View style={styles.card}>
      {snapshot.recentSales.map((sale, index) => (
        <View
          key={sale.id}
          style={[
            styles.saleRow,
            index === snapshot.recentSales.length - 1 && styles.saleRowLast,
          ]}>
          <View style={styles.saleLeft}>
            <Text style={styles.saleTitle}>{sale.title}</Text>
            <Text style={styles.saleMeta}>{sale.meta}</Text>
          </View>
          <Text style={styles.saleAmount}>{formatPrice(sale.amount)}</Text>
        </View>
      ))}
    </View>
  </>
);

const AdminRevenueScreen = () => {
  const {
    isSuperAdmin,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    adminBranch,
    adminSnapshot,
    superSnapshot,
    superTitle,
    channelBreakdown,
    handleBack,
  } = useController();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleBack}>
          <Icon name="arrow-left" size={22} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Revenue & Sales</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Live Online / POS / Combined totals come from real orders on this
            device. Charts below remain demo until the backend is connected.
          </Text>
        </View>

        {isSuperAdmin ? (
          <>
            <Text style={styles.sectionTitle}>Branch filter</Text>
            <View style={styles.chipsRow}>
              <Pressable
                accessibilityRole="button"
                style={[
                  styles.chip,
                  selectedBranchId === 'all' && styles.chipActive,
                ]}
                onPress={() => setSelectedBranchId('all')}>
                <Text
                  style={[
                    styles.chipText,
                    selectedBranchId === 'all' && styles.chipTextActive,
                  ]}>
                  All
                </Text>
              </Pressable>
              {branches.map(branch => {
                const active = selectedBranchId === branch.id;
                return (
                  <Pressable
                    key={branch.id}
                    accessibilityRole="button"
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setSelectedBranchId(branch.id)}>
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextActive,
                      ]}>
                      {branch.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <ChannelRevenueCards
              breakdown={channelBreakdown}
              title={`Live sales · ${superTitle}`}
            />
            <RevenueBody snapshot={superSnapshot} title={`${superTitle} (demo charts)`} />
          </>
        ) : adminSnapshot && adminBranch ? (
          <>
            <ChannelRevenueCards
              breakdown={channelBreakdown}
              title={`Live sales · ${adminBranch.name}`}
            />
            <RevenueBody
              snapshot={adminSnapshot}
              title={`${adminBranch.name} (demo charts)`}
            />
          </>
        ) : (
          <View style={styles.card}>
            <Text style={styles.saleTitle}>No branch assigned</Text>
            <Text style={styles.saleMeta}>
              Ask the super admin to assign you to a branch before you can view
              revenue.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminRevenueScreen;
