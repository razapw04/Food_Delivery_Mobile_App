import {StyleSheet} from 'react-native';
import {colors} from '../../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },

  imageContainer: {
    paddingTop: 176,
    paddingBottom: 40,
  },

  image: {
    height: 250,
    width: 250,
    borderRadius: 200,
    resizeMode: 'cover',
  },

  text: {
    color: 'black',
    marginTop:20
  },
});