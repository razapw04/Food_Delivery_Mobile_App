import { Dimensions, StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '../../theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 20,
  },

  image: {
    width: 240,
    height: 292,
    borderRadius: 8,
  },

  title: {
    marginTop: 28,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    color: '#111111',
  },

  description: {
    marginTop: 12,
    maxWidth: layout.contentMaxWidth,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
    textAlign: 'center',
   
  },

  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 28,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.inactive,
  },

  activeDot: {
    width: 24,
    backgroundColor:colors.primary,
  },

  skipButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  skipText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666666',
  },
});