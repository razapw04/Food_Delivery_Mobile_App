import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import AdminMenuButton from '../../../components/AdminMenuButton';
import type {RevenuePeriod} from '../../../components/ChannelRevenueCards';
import BranchProductSalesLists from '../../../components/BranchProductSalesLists';
import TopSellingProducts from '../../../components/TopSellingProducts';
import {useAuth} from '../../../context/AuthContext';
import {colors} from '../../../theme';
import type {RootStackParamList} from '../../../types/navigation';
import type {TopSellingProduct} from '../../../utils/revenueFromOrders';
import FinanceCharts from './FinanceCharts';
import type {BranchRevenueSnapshot} from './mockData';
import RevenueFilterModal from './RevenueFilterModal';
import {styles} from './styles';
import useController, {formatPrice} from './useController';

const periodChipLabel = (
  period: RevenuePeriod,
  customLabel: string,
): string => {
  if (period === 'custom') {
    return customLabel;
  }
  if (period === 'week') {
    return 'Week';
  }
  if (period === 'month') {
    return 'Month';
  }
  if (period === 'year') {
    return 'Year';
  }
  return 'Today';
};

const DetailSections = ({
  snapshot,
  topProducts,
  mostProducts,
  hotProducts,
  leastProducts,
  topTitle,
  topMeta,
  onTopMetaPress,
  showBranchSalesLists,
  showRecentSales,
}: {
  snapshot: BranchRevenueSnapshot;
  topProducts: TopSellingProduct[];
  mostProducts?: TopSellingProduct[];
  hotProducts?: TopSellingProduct[];
  leastProducts?: TopSellingProduct[];
  topTitle: string;
  topMeta: string;
  onTopMetaPress?: () => void;
  showBranchSalesLists?: boolean;
  showRecentSales: boolean;
}) => (
  <>
    {showBranchSalesLists ? (
      <BranchProductSalesLists
        most={mostProducts ?? topProducts}
        hot={hotProducts ?? []}
        least={leastProducts ?? []}
        meta={topMeta}
        emptyText="No countable product sales yet."
      />
    ) : (
      <TopSellingProducts
        title={topTitle}
        meta={topMeta}
        products={topProducts}
        onMetaPress={onTopMetaPress}
        emptyText="No countable product sales yet."
      />
    )}

    {showRecentSales ? (
      <>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent sales</Text>
          <Text style={styles.sectionMeta}>Latest orders</Text>
        </View>
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
    ) : null}
  </>
);

const AdminRevenueScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {logout} = useAuth();
  const {
    isSuperAdmin,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    period,
    setPeriod,
    customLabel,
    customStartDate,
    customEndDate,
    selectCustomRange,
    periodMetrics,
    adminBranch,
    adminSnapshot,
    superSnapshot,
    superTitle,
    topProductsOverall,
    topProductsAllBranches,
    leastProductsOverall,
    hotProductsOverall,
    chartTrend,
    chartTotals,
  } = useController();

  const [branchModalVisible, setBranchModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [lossWarningDismissed, setLossWarningDismissed] = useState(false);

  useEffect(() => {
    setLossWarningDismissed(false);
  }, [period, selectedBranchId]);

  const topSellingMetaLabel = isSuperAdmin
    ? 'All branches'
    : (adminBranch?.name ?? 'My branch');

  const displayedTopProducts = isSuperAdmin
    ? topProductsAllBranches
    : topProductsOverall;

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Do you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              await logout();
            } catch {
              // ignore
            } finally {
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            }
          })();
        },
      },
    ]);
  }, [logout, navigation]);

  const scopeLabel = isSuperAdmin
    ? superTitle
    : (adminBranch?.name ?? 'Your branch');
  const hasData = isSuperAdmin
    ? Boolean(superSnapshot)
    : Boolean(adminSnapshot && adminBranch);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <AdminMenuButton />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {isSuperAdmin ? 'Revenue' : 'Sales'}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Logout"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleLogout}>
          <Icon name="logout" size={22} color="#C74440" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {hasData && periodMetrics ? (
          <>
            <LinearGradient
              colors={
                periodMetrics.net < 0
                  ? ['#DC2626', '#EF4444', '#F87171']
                  : [colors.primary, '#FF8A45', '#FF9A56']
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.heroCard}>
              <View style={styles.heroTopRow}>
                <View
                  style={[
                    styles.heroStatusPill,
                    periodMetrics.net < 0
                      ? styles.heroStatusPillLoss
                      : styles.heroStatusPillProfit,
                  ]}>
                  <Icon
                    name={
                      periodMetrics.net < 0 ? 'trending-down' : 'trending-up'
                    }
                    size={14}
                    color={periodMetrics.net < 0 ? '#FF3B30' : '#16A34A'}
                  />
                  <Text
                    style={[
                      styles.heroStatusPillText,
                      periodMetrics.net < 0
                        ? styles.heroStatusPillTextLoss
                        : styles.heroStatusPillTextProfit,
                    ]}>
                    {periodMetrics.net < 0 ? 'Loss' : 'Profit'}
                  </Text>
                </View>
                {isSuperAdmin ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Select branch"
                    style={styles.heroScopeButton}
                    onPress={() => setBranchModalVisible(true)}>
                    <Text style={styles.heroScope} numberOfLines={1}>
                      {scopeLabel}
                    </Text>
                    <Icon
                      name="chevron-down"
                      size={16}
                      color="#FFFFFF"
                    />
                  </Pressable>
                ) : (
                  <View style={styles.heroScopeButton}>
                    <Text style={styles.heroScope} numberOfLines={1}>
                      {scopeLabel}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.heroNetLabelRow}>
                <Text style={styles.heroNetLabel}>
                  {periodMetrics.hideExpense
                    ? 'Live sales'
                    : periodMetrics.net < 0
                      ? 'Net loss'
                      : 'Net profit'}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Filter sales"
                  style={styles.heroPeriodButton}
                  onPress={() => setFilterModalVisible(true)}>
                  <Text style={styles.heroPeriodButtonText} numberOfLines={1}>
                    {periodChipLabel(period, customLabel)}
                  </Text>
                  <Icon name="filter-variant" size={14} color="#FFFFFF" />
                </Pressable>
              </View>

              <View style={styles.heroNetRow}>
                <Text style={styles.heroNetValue}>
                  {periodMetrics.net < 0 ? '−' : ''}
                  {formatPrice(Math.abs(periodMetrics.net))}
                </Text>
                <View style={styles.heroStatusIcon}>
                  <Icon
                    name={
                      periodMetrics.net < 0 ? 'trending-down' : 'trending-up'
                    }
                    size={18}
                    color={periodMetrics.net < 0 ? '#FF3B30' : '#16A34A'}
                  />
                </View>
              </View>

              <View style={styles.heroMetrics}>
                <View style={styles.heroMetric}>
                  <View style={styles.heroMetricLabelRow}>
                    <Text style={styles.heroMetricLabel}>Income</Text>
                    <Icon name="trending-up" size={14} color="#16A34A" />
                  </View>
                  <Text style={styles.heroMetricValue} numberOfLines={1}>
                    {formatPrice(periodMetrics.income)}
                  </Text>
                </View>
                {!periodMetrics.hideExpense ? (
                  <View style={styles.heroMetric}>
                    <View style={styles.heroMetricLabelRow}>
                      <Text style={styles.heroMetricLabel}>Expense</Text>
                      <Icon name="trending-down" size={14} color="#DC2626" />
                    </View>
                    <Text style={styles.heroMetricValue} numberOfLines={1}>
                      {formatPrice(periodMetrics.expense)}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.heroMetric}>
                  <View style={styles.heroMetricLabelRow}>
                    <Text style={styles.heroMetricLabel}>Orders</Text>
                    <Icon
                      name="clipboard-list-outline"
                      size={14}
                      color="rgba(255,255,255,0.95)"
                    />
                  </View>
                  <Text style={styles.heroMetricValue} numberOfLines={1}>
                    {String(periodMetrics.orders ?? 0)}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {periodMetrics.net < 0 && !lossWarningDismissed ? (
              <View style={styles.lossWarningCard}>
                <View style={styles.lossWarningIconWrap}>
                  <Icon name="alert-outline" size={22} color="#B91C1C" />
                </View>
                <View style={styles.lossWarningCopy}>
                  <Text style={styles.lossWarningTitle}>Loss alert</Text>
                  <Text style={styles.lossWarningText}>
                    You are down{' '}
                    {formatPrice(Math.abs(periodMetrics.net))} for{' '}
                    {periodMetrics.label}. Check expenses, low sales, or branch
                    performance so you can fix this in time.
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss loss warning"
                  onPress={() => setLossWarningDismissed(true)}
                  hitSlop={8}
                  style={styles.lossWarningClose}>
                  <Icon name="close" size={18} color="#B91C1C" />
                </Pressable>
              </View>
            ) : null}

            <FinanceCharts
              period={period}
              chartTrend={chartTrend}
              income={chartTotals.income}
              expense={chartTotals.expense}
              hideExpense={chartTotals.hideExpense}
            />

            <DetailSections
              snapshot={isSuperAdmin ? superSnapshot : adminSnapshot!}
              topProducts={displayedTopProducts}
              mostProducts={
                isSuperAdmin ? displayedTopProducts : topProductsOverall
              }
              hotProducts={isSuperAdmin ? undefined : hotProductsOverall}
              leastProducts={isSuperAdmin ? undefined : leastProductsOverall}
              topTitle={
                isSuperAdmin ? 'Top selling overall' : 'Most selling'
              }
              topMeta={topSellingMetaLabel}
              onTopMetaPress={() =>
                navigation.navigate('AdminTopSelling', {
                  branchId: isSuperAdmin ? 'all' : undefined,
                  period,
                })
              }
              showBranchSalesLists={!isSuperAdmin}
              showRecentSales={!isSuperAdmin}
            />
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No branch assigned</Text>
            <Text style={styles.emptySubtitle}>
              Ask the super admin to assign you to a branch before you can view
              sales.
            </Text>
          </View>
        )}
      </ScrollView>

      <RevenueFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        activePreset={period === 'custom' ? 'custom' : period}
        customLabel={customLabel}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        showYearOption={isSuperAdmin}
        onSelectPreset={setPeriod}
        onApplyCustomRange={selectCustomRange}
      />

      <Modal
        visible={branchModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBranchModalVisible(false)}>
        <Pressable
          style={styles.branchModalBackdrop}
          onPress={() => setBranchModalVisible(false)}>
          <Pressable
            style={styles.branchModalSheet}
            onPress={event => event.stopPropagation()}>
            <View style={styles.branchModalHeader}>
              <Text style={styles.branchModalTitle}>Select branch</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={() => setBranchModalVisible(false)}
                hitSlop={8}>
                <Icon name="close" size={22} color="#1A1A1A" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.branchModalList}
              showsVerticalScrollIndicator={false}>
              <Pressable
                accessibilityRole="button"
                style={[
                  styles.branchModalOption,
                  selectedBranchId === 'all' && styles.branchModalOptionActive,
                ]}
                onPress={() => {
                  setSelectedBranchId('all');
                  setBranchModalVisible(false);
                }}>
                <Text
                  style={[
                    styles.branchModalOptionText,
                    selectedBranchId === 'all' &&
                      styles.branchModalOptionTextActive,
                  ]}>
                  All branches
                </Text>
                {selectedBranchId === 'all' ? (
                  <Icon name="check" size={18} color={colors.primary} />
                ) : null}
              </Pressable>

              {branches.map(branch => {
                const active = selectedBranchId === branch.id;
                return (
                  <Pressable
                    key={branch.id}
                    accessibilityRole="button"
                    style={[
                      styles.branchModalOption,
                      active && styles.branchModalOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedBranchId(branch.id);
                      setBranchModalVisible(false);
                    }}>
                    <Text
                      style={[
                        styles.branchModalOptionText,
                        active && styles.branchModalOptionTextActive,
                      ]}>
                      {branch.name}
                    </Text>
                    {active ? (
                      <Icon name="check" size={18} color={colors.primary} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
};

export default AdminRevenueScreen;
