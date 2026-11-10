import React from 'react';
import {StyleSheet, View, type StyleProp, type ViewStyle} from 'react-native';
import {useResponsive} from '../../hooks/useResponsive';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Stretch to full width on phones; center + max-width on tablets. */
  padded?: boolean;
};

/**
 * Centers content on tablets / large screens so layouts don't stretch edge-to-edge.
 */
const ResponsiveContainer = ({children, style, padded = true}: Props) => {
  const {contentMaxWidth, screenPadding, isTablet} = useResponsive();

  return (
    <View style={[styles.outer, style]}>
      <View
        style={[
          styles.inner,
          {
            maxWidth: contentMaxWidth,
            width: '100%',
            paddingHorizontal: padded ? screenPadding : 0,
            alignSelf: isTablet ? 'center' : 'stretch',
          },
        ]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: '100%',
  },
  inner: {
    width: '100%',
  },
});

export default ResponsiveContainer;
