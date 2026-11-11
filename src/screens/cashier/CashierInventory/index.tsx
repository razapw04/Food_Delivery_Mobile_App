import React from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AdminMenuButton from '../../../components/AdminMenuButton';
import type {InventoryRequest} from '../../../storage/inventoryRequestsStorage';
import {styles} from './styles';
import useController, {formatWhen, type Filter} from './useController';

const statusStyle = (status: InventoryRequest['status']) => {
  if (status === 'arranged') {
    return {
      badge: styles.statusArranged,
      text: styles.statusTextArranged,
      label: 'Arranged',
    };
  }
  return {
    badge: styles.statusAwaiting,
    text: styles.statusTextAwaiting,
    label: 'Awaiting cash',
  };
};

const CashierInventoryScreen = () => {
  const {
    filtered,
    loading,
    filter,
    setFilter,
    busyId,
    cashDrafts,
    setCashDraft,
    load,
    handleArrange,
  } = useController();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Text style={styles.headerTitle}>Inventory cash</Text>
        <AdminMenuButton />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Manager-approved stock requests appear here. Arrange each item with
          cash, then confirm — stock updates after you confirm.
        </Text>
      </View>

      <View style={styles.filterRow}>
        {(['approved', 'arranged', 'all'] as Filter[]).map(item => {
          const active = filter === item;
          const label =
            item === 'approved'
              ? 'Awaiting'
              : item === 'arranged'
                ? 'Arranged'
                : 'All';
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
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No requests</Text>
            <Text style={styles.emptySubtitle}>
              Approved inventory requests from your manager will show here.
            </Text>
          </View>
        }
        renderItem={({item}) => {
          const status = statusStyle(item.status);
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
                Arrange {item.requestedQuantity} {item.unit} · was{' '}
                {item.currentQuantity} {item.unit} in stock
              </Text>
              <Text style={styles.meta}>
                {item.branchName} · kitchen: {item.requestedByName}
              </Text>
              {item.reviewedByName ? (
                <Text style={styles.meta}>
                  Approved by {item.reviewedByName}
                  {item.reviewedAt ? ` · ${formatWhen(item.reviewedAt)}` : ''}
                </Text>
              ) : null}
              {item.note ? (
                <Text style={styles.meta}>Note: {item.note}</Text>
              ) : null}

              {item.status === 'arranged' ? (
                <>
                  <Text style={styles.meta}>
                    Arranged by {item.arrangedByName}
                    {item.arrangedAt ? ` · ${formatWhen(item.arrangedAt)}` : ''}
                  </Text>
                  {item.cashAmount != null ? (
                    <Text style={styles.meta}>
                      Cash paid: {item.cashAmount.toFixed(2)}
                    </Text>
                  ) : null}
                </>
              ) : null}

              {item.status === 'approved' ? (
                <>
                  <View style={styles.cashRow}>
                    <Text style={styles.cashLabel}>
                      Cash amount (optional)
                    </Text>
                    <TextInput
                      style={styles.cashInput}
                      value={cashDrafts[item.id] ?? ''}
                      onChangeText={text => setCashDraft(item.id, text)}
                      keyboardType="decimal-pad"
                      placeholder="e.g. 2500"
                      placeholderTextColor="#9CA3AF"
                      editable={!busy}
                    />
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    style={styles.arrangeButton}
                    disabled={busy}
                    onPress={() => handleArrange(item)}>
                    <Text style={styles.arrangeButtonText}>
                      {busy ? '…' : 'Arranged with cash'}
                    </Text>
                  </Pressable>
                </>
              ) : null}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default CashierInventoryScreen;
