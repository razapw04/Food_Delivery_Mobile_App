import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LiquidGlassPanel from '../components/LiquidGlassPanel';
import {colors} from '../theme';

const TAB_ICONS: Record<string, {active: string; inactive: string}> = {
  Home: {active: 'home', inactive: 'home-outline'},
  Explore: {active: 'magnify', inactive: 'magnify'},
  Branches: {active: 'store', inactive: 'store-outline'},
  Orders: {active: 'package-variant', inactive: 'package-variant-closed'},
};

const LiquidGlassTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 6);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, {paddingBottom: bottomPad}]}>
      <LiquidGlassPanel style={styles.pill} glassType="regular">
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
                    size={22}
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
    paddingHorizontal: 16,
  },

  pill: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 28,
    minHeight: 56,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 8},
    elevation: 12,
  },

  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(255,255,255,0.55)',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },

  iconWrap: {
    width: 70,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapActive: {
    backgroundColor: 'rgba(255,118,34,0.12)',
    borderRadius: 16,
  },

  label: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },

  labelActive: {
    color: colors.primary,
  },
});

export default LiquidGlassTabBar;
