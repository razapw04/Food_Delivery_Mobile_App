import {StyleSheet} from 'react-native';
import {colors, moderateScale, wp} from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: moderateScale(120),
    height: moderateScale(55),
  },

  topPattern: {
    position: 'absolute',
    top: -moderateScale(40),
    left: 0,
    width: wp(50),
    height: wp(50),
  },

  bottomPattern: {
    position: 'absolute',
    bottom: 0,
    right: -moderateScale(10),
    width: wp(60),
    height: wp(60),
  },
});

export default styles;
