import React, {useMemo} from 'react';
import {Pressable, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type {
  BranchTopSelling,
  TopSellingProduct,
} from '../../utils/revenueFromOrders';
import {styles} from './styles';

type Props = {
  title?: string;
  meta?: string;
  products: TopSellingProduct[];
  emptyText?: string;
  /** Optional per-branch breakdown under the overall list. */
  byBranch?: Array<BranchTopSelling & {branchName: string}>;
  /** Makes meta act as a filter control (e.g. All branches). */
  onMetaPress?: () => void;
  /** Optional "See all" / open dedicated screen. */
  onSeeAllPress?: () => void;
  seeAllLabel?: string;
};

const ProductRows = ({products}: {products: TopSellingProduct[]}) => {
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
                index === 0 ? styles.rankBadgeTop : null,
              ]}>
              <Text
                style={[
                  styles.rankText,
                  index === 0 ? styles.rankTextTop : null,
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
                {width: `${Math.round((item.units / maxUnits) * 100)}%`},
              ]}
            />
          </View>
        </View>
      ))}
    </>
  );
};

const TopSellingProducts = ({
  title = 'Top selling products',
  meta = 'By units sold',
  products,
  emptyText = 'No sales yet for this period.',
  byBranch,
  onMetaPress,
  onSeeAllPress,
  seeAllLabel = 'See all',
}: Props) => {
  const showBranchBreakdown = Boolean(byBranch && byBranch.length > 0);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.headerActions}>
          {onMetaPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Filter top selling: ${meta}`}
              style={styles.metaChip}
              onPress={onMetaPress}
              hitSlop={6}>
              <Text style={styles.metaChipText} numberOfLines={1}>
                {meta}
              </Text>
              <Icon name="chevron-right" size={14} color="#6B7280" />
            </Pressable>
          ) : (
            <Text style={styles.meta}>{meta}</Text>
          )}
          {onSeeAllPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={seeAllLabel}
              style={styles.seeAllButton}
              onPress={onSeeAllPress}
              hitSlop={6}>
              <Text style={styles.seeAllText}>{seeAllLabel}</Text>
              <Icon name="chevron-right" size={16} color="#FF7622" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.card}>
        {products.length > 0 ? (
          <ProductRows products={products} />
        ) : (
          <Text style={styles.emptyText}>{emptyText}</Text>
        )}

        {showBranchBreakdown
          ? byBranch!.map((branch, index) => (
              <View
                key={branch.branchId}
                style={[
                  styles.branchBlock,
                  index === 0 && products.length === 0
                    ? styles.branchBlockFirst
                    : null,
                ]}>
                <Text style={styles.branchLabel}>{branch.branchName}</Text>
                {branch.products.map((item, productIndex) => (
                  <View key={item.id} style={styles.compactRow}>
                    <Text style={styles.compactRank}>{productIndex + 1}.</Text>
                    <Text style={styles.compactName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.compactUnits}>{item.units}</Text>
                  </View>
                ))}
              </View>
            ))
          : null}
      </View>
    </View>
  );
};

export default TopSellingProducts;
