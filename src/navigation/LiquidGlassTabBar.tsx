import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {BlurView} from '@react-native-community/blur';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../theme';

const TAB_ICONS: Record<string, {active: string; inactive: string}> = {
  Home: {active: 'home', inactive: 'home-outline'},
  Search: {active: 'magnify', inactive: 'magnify'},
  Menu: {active: 'food', inactive: 'food-outline'},
  Orders: {active: 'package-variant', inactive: 'package-variant-closed'},
};

const LiquidGlassTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, {paddingBottom: bottomPad}]}>
      <View style={styles.pill}>
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={28}
            reducedTransparencyFallbackColor="rgba(255,255,255,0.85)"
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidGlass]} />
        )}

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
      </View>
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
    overflow: 'hidden',
    minHeight: 64,
    justifyContent: 'center',
    // Soft floating glass shadow
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 8},
    elevation: 12,
  },

  androidGlass: {
    backgroundColor: 'rgba(255,255,255,0.82)',
  },

  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(255,255,255,0.65)',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },

  iconWrap: {
    width: 70,
    height: 42,
    // borderRadius: 16,
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
