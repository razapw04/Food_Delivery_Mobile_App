import React, {useMemo, useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {RevenuePeriod} from '../../../components/ChannelRevenueCards';
import {colors} from '../../../theme';
import type {TopSellingProduct} from '../../../utils/revenueFromOrders';
import RevenueFilterModal from '../AdminRevenue/RevenueFilterModal';
import {styles} from './styles';
import useController from './useController';

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

const ProductRows = ({
  products,
  accent = colors.primary,
}: {
  products: TopSellingProduct[];
  accent?: string;
}) => {
  const maxUnits = useMemo(
    () => Math.max(...products.map(item => item.units), 1),
    [products],
  );

  return (
    <>
      {products.map((item, index) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.rowHeader}>
            <View
              style={[
                styles.rankBadge,
                index === 0 ? {backgroundColor: `${accent}22`} : null,
              ]}>
              <Text
                style={[
                  styles.rankText,
                  index === 0 ? {color: accent} : null,
                ]}>
                {index + 1}
              </Text>
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.units}>{item.units} sold</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.round((item.units / maxUnits) * 100)}%`,
                  backgroundColor: accent,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </>
  );
};

const SectionCard = ({
  title,
  meta,
  icon,
  iconColor,
  iconBg,
  products,
  accent,
  emptyText,
}: {
  title: string;
  meta: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  products: TopSellingProduct[];
  accent: string;
  emptyText: string;
}) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionTitleRow}>
      <View style={[styles.sectionIconWrap, {backgroundColor: iconBg}]}>
        <Icon name={icon} size={16} color={iconColor} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <Text style={styles.sectionMeta}>{meta}</Text>
    {products.length > 0 ? (
      <ProductRows products={products} accent={accent} />
    ) : (
      <Text style={styles.emptyText}>{emptyText}</Text>
    )}
  </View>
);

const AdminTopSellingScreen = () => {
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
    scopeLabel,
    products,
    leastProducts,
    hotProducts,
    productsByBranch,
    productsByCategory,
    viewMode,
    setViewMode,
    handleBack,
  } = useController();

  const [branchModalVisible, setBranchModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const showBranchSections =
    isSuperAdmin &&
    viewMode === 'overall' &&
    selectedBranchId === 'all' &&
    productsByBranch.length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
          onPress={handleBack}>
          <Icon name="arrow-left" size={22} color="#1A1A1A" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Product sales</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.toolbar}>
          {isSuperAdmin ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Filter by branch"
              style={styles.filterChip}
              onPress={() => setBranchModalVisible(true)}>
              <Icon name="storefront-outline" size={14} color="#1A1A1A" />
              <Text style={styles.filterChipText} numberOfLines={1}>
                {scopeLabel}
              </Text>
              <Icon name="chevron-down" size={16} color="#6B7280" />
            </Pressable>
          ) : (
            <View style={styles.filterChip}>
              <Icon name="storefront-outline" size={14} color="#1A1A1A" />
              <Text style={styles.filterChipText} numberOfLines={1}>
                {scopeLabel}
              </Text>
            </View>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Filter period"
            style={styles.periodChip}
            onPress={() => setFilterModalVisible(true)}>
            <Text style={styles.periodChipText} numberOfLines={1}>
              {periodChipLabel(period, customLabel)}
            </Text>
            <Icon name="filter-variant" size={14} color="#FFFFFF" />
          </Pressable>
        </View>

        {isSuperAdmin ? (
          <View style={styles.modeRow}>
            <Pressable
              accessibilityRole="button"
              style={[
                styles.modeChip,
                viewMode === 'overall' && styles.modeChipActive,
              ]}
              onPress={() => setViewMode('overall')}>
              <Text
                style={[
                  styles.modeChipText,
                  viewMode === 'overall' && styles.modeChipTextActive,
                ]}>
                Overall products
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={[
                styles.modeChip,
                viewMode === 'category' && styles.modeChipActive,
              ]}
              onPress={() => setViewMode('category')}>
              <Text
                style={[
                  styles.modeChipText,
                  viewMode === 'category' && styles.modeChipTextActive,
                ]}>
                By category
              </Text>
            </Pressable>
          </View>
        ) : null}

        {viewMode === 'overall' || !isSuperAdmin ? (
          <>
            <SectionCard
              title="Most selling"
              meta={`${scopeLabel} · all items · highest units`}
              icon="trending-up"
              iconColor="#16A34A"
              iconBg="#DCFCE7"
              products={products}
              accent="#16A34A"
              emptyText="No most-selling items yet."
            />

            <SectionCard
              title="Hot selling"
              meta={`${scopeLabel} · all items · last 24h movers`}
              icon="fire"
              iconColor="#EA580C"
              iconBg="#FFEDD5"
              products={hotProducts}
              accent="#EA580C"
              emptyText="No hot sellers in this range."
            />

            <SectionCard
              title="Least selling"
              meta={`${scopeLabel} · all items · lowest units`}
              icon="trending-down"
              iconColor="#DC2626"
              iconBg="#FEE2E2"
              products={leastProducts}
              accent="#DC2626"
              emptyText="No least-selling items yet."
            />

            {showBranchSections
              ? productsByBranch.map(branch => (
                  <View key={branch.branchId} style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                      <View
                        style={[
                          styles.sectionIconWrap,
                          {backgroundColor: '#FFF4EC'},
                        ]}>
                        <Icon
                          name="storefront-outline"
                          size={16}
                          color={colors.primary}
                        />
                      </View>
                      <Text style={styles.sectionTitle}>
                        {branch.branchName}
                      </Text>
                    </View>
                    <Text style={styles.sectionMeta}>Branch most selling</Text>
                    {branch.products.length > 0 ? (
                      <ProductRows products={branch.products} />
                    ) : (
                      <Text style={styles.emptyText}>
                        No sales for this branch.
                      </Text>
                    )}
                  </View>
                ))
              : null}
          </>
        ) : productsByCategory.length > 0 ? (
          productsByCategory.map(category => (
            <SectionCard
              key={category.categoryId}
              title={category.categoryName}
              meta={`Best selling · ${category.products.length} items`}
              icon="food"
              iconColor={colors.primary}
              iconBg="#FFF4EC"
              products={category.products}
              accent={colors.primary}
              emptyText={`No sales in ${category.categoryName} yet.`}
            />
          ))
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.emptyText}>
              No category sales in this range yet.
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
              <Text style={styles.branchModalTitle}>Filter branch</Text>
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

export default AdminTopSellingScreen;
