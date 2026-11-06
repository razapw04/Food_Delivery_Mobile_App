import React, {useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, StatusBar, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../context/AuthContext';
import {useCatalog} from '../../context/CatalogContext';
import type {RootStackParamList} from '../../types/navigation';
import FinanceCharts from './FinanceCharts';
import {
  aggregateRevenue,
  BRANCH_REVENUE,
  type BranchRevenueSnapshot,
} from './mockData';
import {styles} from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminRevenue'>;

const formatPrice = (value: number) => `Rs. ${value.toLocaleString('en-PK')}`;

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
  const navigation = useNavigation<Nav>();
  const {isAdmin, isSuperAdmin, user} = useAuth();
  const {branches} = useCatalog();
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  useEffect(() => {
    if (!isAdmin) {
      navigation.replace('Login');
    }
  }, [isAdmin, navigation]);

  const branchSnapshots = useMemo(
    () =>
      branches
        .map(branch => BRANCH_REVENUE[branch.id])
        .filter((item): item is BranchRevenueSnapshot => item != null),
    [branches],
  );

  const allSnapshot = useMemo(
    () => aggregateRevenue(branchSnapshots),
    [branchSnapshots],
  );

  const adminBranchId = user?.branchId ?? null;
  const adminBranch = branches.find(item => item.id === adminBranchId);
  const adminSnapshot =
    adminBranchId != null ? BRANCH_REVENUE[adminBranchId] : null;

  const superSnapshot =
    selectedBranchId === 'all'
      ? allSnapshot
      : BRANCH_REVENUE[selectedBranchId] ?? allSnapshot;

  const superTitle =
    selectedBranchId === 'all'
      ? 'All branches'
      : branches.find(item => item.id === selectedBranchId)?.name ??
        'Selected branch';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
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
            {isSuperAdmin
              ? 'Demo income/expense charts for all branches. Live totals will connect when the backend is ready.'
              : 'You can only view income/expense for your assigned branch. Demo charts for now.'}
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

            <RevenueBody snapshot={superSnapshot} title={superTitle} />
          </>
        ) : adminSnapshot && adminBranch ? (
          <RevenueBody snapshot={adminSnapshot} title={adminBranch.name} />
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
