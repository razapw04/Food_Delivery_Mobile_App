import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors, spacing, typography} from '../../theme';

export type ManagerInventoryAlertPayload = {
  count: number;
  summary: string;
};

type Props = {
  visible: boolean;
  alert: ManagerInventoryAlertPayload | null;
  onReview: () => void;
  onDismiss: () => void;
  badgeLabel?: string;
  titleWhenOne?: string;
  reviewLabel?: string;
};

const ManagerInventoryAlertModal = ({
  visible,
  alert,
  onReview,
  onDismiss,
  badgeLabel = 'Inventory',
  titleWhenOne = 'New inventory request',
  reviewLabel = 'Review',
}: Props) => {
  if (!alert) {
    return null;
  }

  const title =
    alert.count === 1
      ? titleWhenOne
      : `${alert.count} inventory requests`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{alert.summary}</Text>
          <View style={styles.actions}>
            <Pressable
              onPress={onDismiss}
              style={({pressed}) => [
                styles.secondaryBtn,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Dismiss">
              <Text style={styles.secondaryLabel}>Later</Text>
            </Pressable>
            <Pressable
              onPress={onReview}
              style={({pressed}) => [
                styles.primaryBtn,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={reviewLabel}>
              <Text style={styles.primaryLabel}>{reviewLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.inactive,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  title: {
    color: '#1A1A1A',
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.normal,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryLabel: {
    color: '#1A1A1A',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  primaryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  pressed: {
    opacity: 0.88,
  },
});

export default ManagerInventoryAlertModal;
