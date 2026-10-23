import {StyleSheet} from 'react-native';
import {spacing, typography} from '../../theme';

const ink = '#1A1A1A';
const muted = '#6B7280';
const pale = '#F5F5F5';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: pale,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: ink,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginRight: 40,
  },

  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  categoryCard: {
    marginBottom: spacing.md,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: pale,
    height: 120,
  },

  categoryImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },

  categoryOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: spacing.md,
  },

  categoryName: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },

  categoryCount: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
});
