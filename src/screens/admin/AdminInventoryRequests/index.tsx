import React from 'react';
import {FlatList, Pressable, StatusBar, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AdminMenuButton from '../../../components/AdminMenuButton';
import type {InventoryRequest} from '../../../storage/inventoryRequestsStorage';
import {
  getInventoryPriority,
  type InventoryPriority,
} from '../../../storage/inventoryStorage';
import {styles} from './styles';
import useController, {formatWhen, type Filter} from './useController';

const priorityStyles = (priority: InventoryPriority) => {
  if (priority === 'low') {
    return {
      badge: styles.priorityLow,
      text: styles.priorityTextLow,
      short: 'Low',
    };
  }
  if (priority === 'medium') {
    return {
      badge: styles.priorityMedium,
      text: styles.priorityTextMedium,
      short: 'Medium',
    };
  }
  return {
    badge: styles.priorityHigh,
    text: styles.priorityTextHigh,
    short: 'High',
  };
};

const statusStyle = (status: InventoryRequest['status']) => {
  if (status === 'arranged') {
    return {
      badge: styles.statusArranged,
      text: styles.statusTextArranged,
      label: 'Arranged',
    };
  }
  if (status === 'approved') {
    return {
      badge: styles.statusApproved,
      text: styles.statusTextApproved,
      label: 'Awaiting cashier',
    };
  }
  if (status === 'rejected') {
    return {
      badge: styles.statusRejected,
      text: styles.statusTextRejected,
      label: 'Rejected',
    };
  }
  return {
    badge: styles.statusPending,
    text: styles.statusTextPending,
    label: 'Pending',
  };
};

const AdminInventoryRequestsScreen = () => {
  const {
    isSuperAdmin,
    filtered,
    loading,
    filter,
    setFilter,
    busyId,
    load,
    handleReview,
    handleBack,
  } = useController();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleBack}>
          <Icon name="arrow-left" size={22} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Inventory requests</Text>
        <AdminMenuButton />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          {isSuperAdmin
            ? 'Full record of kitchen inventory requests across all branches.'
            : 'Approve kitchen requests to send them to cashier for cash arrangement. Stock updates after cashier confirms.'}
        </Text>
      </View>

      <View style={styles.filterRow}>
        {(
          ['pending', 'approved', 'arranged', 'rejected', 'all'] as Filter[]
        ).map(item => {
          const active = filter === item;
          const label =
            item === 'approved'
              ? 'Cashier'
              : item === 'arranged'
                ? 'Arranged'
                : item;
          return (
            <Pressable
              key={item}
              accessibilityRole="button"
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setFilter(item)}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={() => {
          void load();
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No requests</Text>
            <Text style={styles.emptySubtitle}>
              Kitchen inventory requests will appear here.
            </Text>
          </View>
        }
        renderItem={({item}) => {
          const status = statusStyle(item.status);
          const priority = getInventoryPriority(
            item.currentQuantity,
            item.lowStockAt ?? 0,
          );
          const tone = priorityStyles(priority);
          const busy = busyId === item.id;
          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <View style={[styles.statusBadge, status.badge]}>
                  <Text style={[styles.statusText, status.text]}>
                    {status.label}
                  </Text>
                </View>
              </View>
              <Text style={styles.meta}>
                {item.requestedQuantity} {item.unit} · stock was{' '}
                {item.currentQuantity} {item.unit}
              </Text>
              <View style={[styles.priorityBadge, tone.badge]}>
                <Text style={[styles.priorityBadgeText, tone.text]}>
                  {tone.short} priority
                </Text>
              </View>
              <Text style={styles.meta}>
                {item.branchName} · by {item.requestedByName}
              </Text>
              <Text style={styles.meta}>{formatWhen(item.createdAt)}</Text>
              {item.note ? (
                <Text style={styles.meta}>Note: {item.note}</Text>
              ) : null}
              {item.reviewedByName ? (
                <Text style={styles.meta}>
                  Reviewed by {item.reviewedByName}
                  {item.reviewedAt ? ` · ${formatWhen(item.reviewedAt)}` : ''}
                </Text>
              ) : null}
              {item.arrangedByName ? (
                <Text style={styles.meta}>
                  Arranged by {item.arrangedByName}
                  {item.arrangedAt ? ` · ${formatWhen(item.arrangedAt)}` : ''}
                  {item.cashAmount != null
                    ? ` · cash ${item.cashAmount.toFixed(2)}`
                    : ''}
                </Text>
              ) : null}

              {item.status === 'pending' && !isSuperAdmin ? (
                <View style={styles.actionsRow}>
                  <Pressable
                    accessibilityRole="button"
                    style={styles.rejectButton}
                    disabled={busy}
                    onPress={() => handleReview(item, 'rejected')}>
                    <Text style={styles.rejectButtonText}>
                      {busy ? '…' : 'Reject'}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    style={styles.approveButton}
                    disabled={busy}
                    onPress={() => handleReview(item, 'approved')}>
                    <Text style={styles.approveButtonText}>
                      {busy ? '…' : 'Send to cashier'}
                    </Text>
                  </Pressable>
                </View>
              ) : null}

              {item.status === 'pending' && isSuperAdmin ? (
                <Text style={styles.meta}>
                  Waiting for branch manager approval.
                </Text>
              ) : null}
              {item.status === 'approved' ? (
                <Text style={styles.meta}>
                  Waiting for cashier to arrange with cash.
                </Text>
              ) : null}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default AdminInventoryRequestsScreen;
