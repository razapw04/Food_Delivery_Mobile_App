import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing, typography} from '../../theme';

type StateMessageProps = {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const StateMessage = ({
  icon = 'inbox-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
}: StateMessageProps) => (
  <View style={styles.wrap}>
    <View style={styles.iconWrap}>
      <Icon name={icon} size={32} color="#9CA3AF" />
    </View>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    {actionLabel && onAction ? (
      <Pressable
        accessibilityRole="button"
        onPress={onAction}
        style={styles.button}>
        <Text style={styles.buttonText}>{actionLabel}</Text>
      </Pressable>
    ) : null}
  </View>
);

type OfflineBannerProps = {
  message?: string;
  onRetry?: () => void;
};

export const OfflineBanner = ({
  message = "Couldn't reach server. Showing saved data.",
  onRetry,
}: OfflineBannerProps) => (
  <View style={styles.banner}>
    <Icon name="wifi-off" size={16} color="#92400E" />
    <Text style={styles.bannerText}>{message}</Text>
    {onRetry ? (
      <Pressable accessibilityRole="button" onPress={onRetry}>
        <Text style={styles.bannerAction}>Retry</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: '#1A1A1A',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
    color: '#6B7280',
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bannerText: {
    flex: 1,
    color: '#92400E',
    fontSize: typography.fontSize.sm,
  },
  bannerAction: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
