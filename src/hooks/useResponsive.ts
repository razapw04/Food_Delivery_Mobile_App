import {useEffect, useMemo, useState} from 'react';
import {Dimensions, type ScaledSize} from 'react-native';
import {
  getCardWidth,
  getContentMaxWidth,
  getDeviceType,
  getScreenHorizontalPadding,
  hp,
  isTablet,
  moderateScale,
  scale,
  verticalScale,
  wp,
  type DeviceType,
} from '../theme/responsive';

type WindowSize = Pick<ScaledSize, 'width' | 'height'>;

export type ResponsiveValue = {
  width: number;
  height: number;
  deviceType: DeviceType;
  isTablet: boolean;
  isLandscape: boolean;
  contentMaxWidth: number;
  screenPadding: number;
  cardWidth: number;
  scale: typeof scale;
  verticalScale: typeof verticalScale;
  moderateScale: typeof moderateScale;
  wp: typeof wp;
  hp: typeof hp;
};

export const useResponsive = (): ResponsiveValue => {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    const {width, height} = Dimensions.get('window');
    return {width, height};
  });

  useEffect(() => {
    const onChange = ({window}: {window: ScaledSize}) => {
      setWindowSize({width: window.width, height: window.height});
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription.remove();
  }, []);

  return useMemo(() => {
    const deviceType = getDeviceType();
    return {
      width: windowSize.width,
      height: windowSize.height,
      deviceType,
      isTablet: isTablet(),
      isLandscape: windowSize.width > windowSize.height,
      contentMaxWidth: getContentMaxWidth(),
      screenPadding: getScreenHorizontalPadding(),
      cardWidth: getCardWidth(),
      scale,
      verticalScale,
      moderateScale,
      wp,
      hp,
    };
  }, [windowSize.width, windowSize.height]);
};
