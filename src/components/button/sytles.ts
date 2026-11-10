import {StyleSheet} from 'react-native';
import {
  colors,
  getContentMaxWidth,
  layout,
  moderateScale,
  typography,
} from '../../theme';

export const styles = StyleSheet.create({
  button: {
    width: layout.buttonWidth,
    maxWidth: Math.min(getContentMaxWidth(), 420),
    height: layout.buttonHeight,
    alignSelf: 'center',
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },

  buttonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
  },
  iconContainer: {
    borderRadius: moderateScale(14),
    backgroundColor: colors.iconBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: moderateScale(26),
    height: moderateScale(26),
    resizeMode: 'contain',
  },
});
