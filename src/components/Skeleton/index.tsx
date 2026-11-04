import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View, type ViewStyle} from 'react-native';
import {colors, spacing} from '../../theme';

type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export const Skeleton = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.bone,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const MenuSkeleton = () => (
  <View style={styles.menuWrap}>
    <View style={styles.categoryRow}>
      {Array.from({length: 5}).map((_, index) => (
        <View key={`cat-${index}`} style={styles.categoryItem}>
          <Skeleton width={56} height={56} borderRadius={28} />
          <Skeleton width={48} height={10} style={styles.mt8} />
        </View>
      ))}
    </View>

    {Array.from({length: 6}).map((_, index) => (
      <View key={`item-${index}`} style={styles.menuCard}>
        <Skeleton width={72} height={72} borderRadius={12} />
        <View style={styles.menuCardBody}>
          <Skeleton width="70%" height={14} />
          <Skeleton width="90%" height={10} style={styles.mt8} />
          <Skeleton width="40%" height={12} style={styles.mt8} />
        </View>
      </View>
    ))}
  </View>
);

export const BranchListSkeleton = () => (
  <View style={styles.branchWrap}>
    {Array.from({length: 4}).map((_, index) => (
      <View key={`branch-${index}`} style={styles.branchCard}>
        <Skeleton width={52} height={52} borderRadius={26} />
        <View style={styles.branchBody}>
          <Skeleton width="55%" height={14} />
          <Skeleton width="85%" height={10} style={styles.mt8} />
          <Skeleton width="45%" height={10} style={styles.mt8} />
        </View>
      </View>
    ))}
  </View>
);

export const OrderListSkeleton = () => (
  <View style={styles.orderWrap}>
    {Array.from({length: 4}).map((_, index) => (
      <View key={`order-${index}`} style={styles.orderCard}>
        <View style={styles.orderTop}>
          <Skeleton width="35%" height={14} />
          <Skeleton width={72} height={22} borderRadius={999} />
        </View>
        <View style={styles.orderBody}>
          <Skeleton width={64} height={64} borderRadius={12} />
          <View style={styles.orderInfo}>
            <Skeleton width="70%" height={14} />
            <Skeleton width="90%" height={10} style={styles.mt8} />
            <Skeleton width="40%" height={12} style={styles.mt8} />
          </View>
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  bone: {
    backgroundColor: '#E8ECF0',
  },
  mt8: {
    marginTop: spacing.sm,
  },
  menuWrap: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  categoryItem: {
    alignItems: 'center',
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  menuCardBody: {
    flex: 1,
  },
  branchWrap: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  branchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  branchBody: {
    flex: 1,
  },
  orderWrap: {
    flex: 1,
    padding: spacing.lg,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderBody: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
});
