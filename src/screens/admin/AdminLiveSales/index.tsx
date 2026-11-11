import React, {useCallback, useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import AdminMenuButton from '../../../components/AdminMenuButton';
import ChannelRevenueCards, {
  type RevenuePeriod,
} from '../../../components/ChannelRevenueCards';
import {useAuth} from '../../../context/AuthContext';
import {colors} from '../../../theme';
import type {RootStackParamList} from '../../../types/navigation';
import RevenueFilterModal from '../AdminRevenue/RevenueFilterModal';
import {styles} from './styles';
import useController from './useController';

const formatPrice = (value: number) =>
  `Rs. ${value.toLocaleString('en-PK')}`;

const periodLabel = (period: RevenuePeriod, customLabel: string) => {
  if (period === 'custom') {
    return customLabel;
  }
  if (period === 'week') {
    return 'This week';
  }
  if (period === 'month') {
    return 'This month';
  }
  if (period === 'year') {
    return 'This year';
  }
  return 'Today';
};

const AdminLiveSalesScreen = () => {
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
    channelBreakdown,
    liveRangeSales,
    scopeLabel,
  } = useController();

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [branchModalVisible, setBranchModalVisible] = useState(false);

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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <AdminMenuButton />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Live Sales</Text>
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
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            {isSuperAdmin ? (
              <Pressable
                accessibilityRole="button"
                style={styles.filterChip}
                onPress={() => setBranchModalVisible(true)}>
                <Text style={styles.filterChipText} numberOfLines={1}>
                  {scopeLabel}
                </Text>
                <Icon name="chevron-down" size={14} color="#FFFFFF" />
              </Pressable>
            ) : (
              <Text style={styles.summaryScope}>{scopeLabel}</Text>
            )}
            <Pressable
              accessibilityRole="button"
              style={styles.filterChip}
              onPress={() => setFilterModalVisible(true)}>
              <Text style={styles.filterChipText} numberOfLines={1}>
                {periodLabel(period, customLabel)}
              </Text>
              <Icon name="filter-variant" size={14} color="#FFFFFF" />
            </Pressable>
          </View>

          <Text style={styles.summaryLabel}>Live sales total</Text>
          <Text style={styles.summaryValue}>
            {formatPrice(liveRangeSales.income)}
          </Text>
          <Text style={styles.summaryMeta}>
            {liveRangeSales.orderCount} orders ·{' '}
            {periodLabel(period, customLabel)}
          </Text>
        </View>

        <ChannelRevenueCards
          breakdown={channelBreakdown}
          period={period}
          customLabel={customLabel}
          title="Channel breakdown"
        />
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

export default AdminLiveSalesScreen;
