import React, {useCallback} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {InventoryRequest} from '../../../storage/inventoryRequestsStorage';
import {
  getInventoryPriority,
  inventoryPriorityLabel,
  type InventoryItem,
  type InventoryPriority,
} from '../../../storage/inventoryStorage';
import {styles} from './styles';
import useController from './useController';

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

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const statusStyle = (status: InventoryRequest['status']) => {
  if (status === 'approved') {
    return {
      badge: styles.statusApproved,
      text: styles.statusTextApproved,
      label: 'Approved',
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

const KitchenInventoryScreen = () => {
  const {
    branchId,
    branchName,
    tab,
    setTab,
    items,
    requests,
    loading,
    load,
    selectedItem,
    qtyInput,
    setQtyInput,
    noteInput,
    setNoteInput,
    submitting,
    openRequest,
    closeRequest,
    submitRequest,
    confirmUseStock,
    handleLogout,
    pendingCount,
  } = useController();

  const confirmLogout = useCallback(() => {
    Alert.alert('Logout', 'Do you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          void handleLogout();
        },
      },
    ]);
  }, [handleLogout]);

  const renderStock = ({item}: {item: InventoryItem}) => {
    const priority = getInventoryPriority(item.quantity, item.lowStockAt);
    const tone = priorityStyles(priority);
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.qtyText}>
            {item.quantity} {item.unit}
          </Text>
        </View>
        <Text style={styles.meta}>
          {branchName} · low at {item.lowStockAt} {item.unit}
        </Text>
        <View style={[styles.priorityBadge, tone.badge]}>
          <Text style={[styles.priorityBadgeText, tone.text]}>
            {inventoryPriorityLabel(priority)}
          </Text>
        </View>
        <View style={styles.stockActions}>
          <Pressable
            accessibilityRole="button"
            style={styles.useButton}
            onPress={() => confirmUseStock(item)}>
            <Text style={styles.useButtonText}>Use stock</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.requestButton}
            onPress={() => openRequest(item)}>
            <Text style={styles.requestButtonText}>Request more</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderRequest = ({item}: {item: InventoryRequest}) => {
    const status = statusStyle(item.status);
    const priority = getInventoryPriority(
      item.currentQuantity,
      item.lowStockAt ?? 0,
    );
    const tone = priorityStyles(priority);
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.itemName}>{item.itemName}</Text>
          <View style={[styles.statusBadge, status.badge]}>
            <Text style={[styles.statusText, status.text]}>{status.label}</Text>
          </View>
        </View>
        <Text style={styles.meta}>
          Asked {item.requestedQuantity} {item.unit} · stock was{' '}
          {item.currentQuantity} {item.unit}
        </Text>
        <View style={[styles.priorityBadge, tone.badge]}>
          <Text style={[styles.priorityBadgeText, tone.text]}>
            {tone.short} priority at request
          </Text>
        </View>
        <Text style={styles.meta}>{formatWhen(item.createdAt)}</Text>
        {item.note ? <Text style={styles.meta}>Note: {item.note}</Text> : null}
        {item.reviewNote ? (
          <Text style={styles.meta}>Manager: {item.reviewNote}</Text>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Text style={styles.headerTitle}>Inventory</Text>
        <Pressable
          accessibilityLabel="Logout"
          accessibilityRole="button"
          style={styles.logoutButton}
          onPress={confirmLogout}>
          <Icon name="logout" size={22} color="#C74440" />
        </Pressable>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Check branch stock and request items. Requests go to your manager for
          approval.
        </Text>
      </View>

      <View style={styles.segmentRow}>
        <Pressable
          accessibilityRole="button"
          style={[styles.segmentChip, tab === 'stock' && styles.segmentChipActive]}
          onPress={() => setTab('stock')}>
          <Text
            style={[
              styles.segmentChipText,
              tab === 'stock' && styles.segmentChipTextActive,
            ]}>
            Stock
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[
            styles.segmentChip,
            tab === 'requests' && styles.segmentChipActive,
          ]}
          onPress={() => setTab('requests')}>
          <Text
            style={[
              styles.segmentChipText,
              tab === 'requests' && styles.segmentChipTextActive,
            ]}>
            My requests{pendingCount > 0 ? ` (${pendingCount})` : ''}
          </Text>
        </Pressable>
      </View>

      {!branchId ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No branch assigned</Text>
          <Text style={styles.emptySubtitle}>
            Ask super admin to assign this kitchen account to a branch.
          </Text>
        </View>
      ) : tab === 'stock' ? (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={() => {
            void load();
          }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No inventory items</Text>
              <Text style={styles.emptySubtitle}>
                Stock list will appear once the branch inventory is set up.
              </Text>
            </View>
          }
          renderItem={renderStock}
        />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={() => {
            void load();
          }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No requests yet</Text>
              <Text style={styles.emptySubtitle}>
                Requests you send to the manager will show here.
              </Text>
            </View>
          }
          renderItem={renderRequest}
        />
      )}

      <Modal
        visible={selectedItem != null}
        transparent
        animationType="fade"
        onRequestClose={closeRequest}>
        <Pressable style={styles.modalBackdrop} onPress={closeRequest}>
          <Pressable
            style={styles.modalSheet}
            onPress={event => event.stopPropagation()}>
            <Text style={styles.modalTitle}>
              Request {selectedItem?.name ?? 'item'}
            </Text>
            <Text style={styles.modalMeta}>
              Current stock: {selectedItem?.quantity ?? 0}{' '}
              {selectedItem?.unit ?? ''}
            </Text>

            <Text style={styles.inputLabel}>Quantity needed</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={qtyInput}
              onChangeText={setQtyInput}
              placeholder="e.g. 10"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Note (optional)</Text>
            <TextInput
              style={styles.input}
              value={noteInput}
              onChangeText={setNoteInput}
              placeholder="Running low for dinner rush"
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.modalActions}>
              <Pressable
                accessibilityRole="button"
                style={styles.modalCancel}
                onPress={closeRequest}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={styles.modalSubmit}
                disabled={submitting}
                onPress={() => {
                  void submitRequest();
                }}>
                <Text style={styles.modalSubmitText}>
                  {submitting ? 'Sending…' : 'Send to manager'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default KitchenInventoryScreen;
