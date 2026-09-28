import {Dimensions, StyleSheet} from 'react-native';
import { colors } from '../../theme';

const {width} = Dimensions.get('window');

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
    width: 120,
    height: 55,
  },

  topPattern: {
    position: 'absolute',
    top: -40,
    left: 0,
    width: width * 0.5,
    height: width * 0.5,
  },

  bottomPattern: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    width: width * 0.6,
    height: width * 0.6,
  },
});

export default styles;
