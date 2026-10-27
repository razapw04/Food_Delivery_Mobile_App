import React from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {
  isLiquidGlassSupported,
  LiquidGlassView,
} from '@callstack/liquid-glass';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** clear = lighter; regular = stronger glass */
  glassType?: 'clear' | 'regular';
  interactive?: boolean;
};

/**
 * Native Apple liquid glass on iOS 26+ (Xcode 26+).
 * On Android / older iOS, falls back to a frosted translucent panel.
 * @see https://github.com/callstack/liquid-glass
 */
const LiquidGlassPanel = ({
  children,
  style,
  glassType = 'regular',
  interactive = false,
}: Props) => {
  return (
    <LiquidGlassView
      effect={glassType}
      interactive={interactive}
      style={[
        styles.base,
        !isLiquidGlassSupported && styles.fallback,
        style,
      ]}>
      {children}
    </LiquidGlassView>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  fallback: {
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
});

export default LiquidGlassPanel;
