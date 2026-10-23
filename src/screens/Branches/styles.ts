import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '../../theme';

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

  mapContainer: {
    height: 200,
    backgroundColor: '#E8EEF2',
    overflow: 'hidden',
  },

  mapImage: {
    width: '100%',
    height: '100%',
  },

  mapPinOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },

  searchBar: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: pale,
    marginBottom: spacing.lg,
  },

  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    color: ink,
    fontSize: typography.fontSize.sm,
    paddingVertical: spacing.sm,
  },

  sectionTitle: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
  },

  listContent: {
    paddingBottom: spacing.xxl,
  },

  branchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  branchLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: pale,
  },

  branchBody: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },

  branchName: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },

  branchAddress: {
    color: muted,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
    lineHeight: 16,
  },

  branchHours: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginTop: 6,
  },

  branchMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },

  openNow: {
    color: colors.success,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },

  closedNow: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },

  metaDot: {
    color: muted,
    marginHorizontal: 6,
    fontSize: typography.fontSize.xs,
  },

  distanceText: {
    color: muted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },

  emptyText: {
    color: muted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.xl,
  },

  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },

  confirmCard: {
    width: '100%',
    maxWidth: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.lg,
  },

  confirmTitle: {
    color: ink,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  confirmLabel: {
    color: muted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  selectedBranchBox: {
    backgroundColor: pale,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  selectedBranchName: {
    color: ink,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },

  selectedBranchAddress: {
    color: muted,
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    marginTop: 4,
  },

  confirmQuestion: {
    color: ink,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },

  confirmActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  cancelButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  cancelButtonText: {
    color: ink,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },

  proceedButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },

  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
