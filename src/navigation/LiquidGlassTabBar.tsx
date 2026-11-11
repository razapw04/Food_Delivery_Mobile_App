import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LiquidGlassPanel from '../components/LiquidGlassPanel';
import {useResponsive} from '../hooks/useResponsive';
import {colors, moderateScale, typography} from '../theme';

const TAB_ICONS: Record<string, {active: string; inactive: string}> = {
  Home: {active: 'home', inactive: 'home-outline'},
  Explore: {active: 'magnify', inactive: 'magnify'},
  Branches: {active: 'store', inactive: 'store-outline'},
  Orders: {active: 'package-variant', inactive: 'package-variant-closed'},
  CashierOrders: {
    active: 'clipboard-list',
    inactive: 'clipboard-list-outline',
  },
  CashierPOS: {active: 'point-of-sale', inactive: 'point-of-sale'},
  CashierOrderHistory: {active: 'history', inactive: 'history'},
  CashierSales: {active: 'chart-line', inactive: 'chart-line'},
  CashierInventory: {
    active: 'cash-multiple',
    inactive: 'cash-multiple',
  },
  KitchenOrders: {
    active: 'chef-hat',
    inactive: 'chef-hat',
  },
  KitchenHistory: {
    active: 'history',
    inactive: 'history',
  },
  KitchenSales: {
    active: 'fire',
    inactive: 'fire',
  },
  KitchenInventory: {
    active: 'package-variant',
    inactive: 'package-variant-closed',
  },
  AdminOrders: {
    active: 'clipboard-list',
    inactive: 'clipboard-list-outline',
  },
  AdminBranches: {active: 'store', inactive: 'store-outline'},
  AdminProducts: {active: 'food', inactive: 'food-outline'},
  AdminRevenue: {active: 'chart-line', inactive: 'chart-line'},
  AdminLiveSales: {
    active: 'cash-multiple',
    inactive: 'cash-multiple',
  },
  AdminAdmins: {active: 'account-key', inactive: 'account-key-outline'},
};

const LiquidGlassTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const {isTablet, contentMaxWidth} = useResponsive();
  const bottomPad = Math.max(insets.bottom, 6);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, {paddingBottom: bottomPad}]}>
      <LiquidGlassPanel
        style={[
          styles.pill,
          {maxWidth: isTablet ? Math.min(contentMaxWidth, 520) : 420},
        ]}
        glassType="regular">
        <View style={styles.glassBorder} pointerEvents="none" />

        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            const label =
              typeof options.tabBarLabel === 'string'
                ? options.tabBarLabel
                : options.title ?? route.name;
            const isFocused = state.index === index;
            const icons = TAB_ICONS[route.name] ?? {
              active: 'circle',
              inactive: 'circle-outline',
            };

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                style={styles.tabItem}>
                <View
                  style={[
                    styles.iconWrap,
                    isFocused && styles.iconWrapActive,
                  ]}>
                  <Icon
                    name={isFocused ? icons.active : icons.inactive}
                    size={moderateScale(22)}
                    color={isFocused ? colors.primary : '#6B7280'}
                  />
                </View>
                <Text
                  style={[styles.label, isFocused && styles.labelActive]}
                  numberOfLines={1}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </LiquidGlassPanel>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
  },

  pill: {
    width: '100%',
    maxWidth: 420,
    borderRadius: moderateScale(28),
    minHeight: moderateScale(56),
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 8},
    elevation: 12,
  },

  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: moderateScale(28),
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(255,255,255,0.55)',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },

  iconWrap: {
    width: moderateScale(70),
    height: moderateScale(36),
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapActive: {
    backgroundColor: 'rgba(255,118,34,0.12)',
    borderRadius: moderateScale(16),
  },

  label: {
    marginTop: 2,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: '#6B7280',
  },

  labelActive: {
    color: colors.primary,
  },
});

export default LiquidGlassTabBar;
