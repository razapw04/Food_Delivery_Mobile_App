import React from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AdminMenuButton from '../../../components/AdminMenuButton';
import {styles} from './styles';
import useController, {
  formatWhen,
  type Filter,
} from './useController';

const AdminPriceApprovalsScreen = () => {
  const {
    filtered,
    loading,
    filter,
    setFilter,
    busyId,
    finalPrices,
    setFinalPrice,
    load,
    handleReject,
    handleApprove,
    handleBack,
    formatAdminPrice,
    parseAdminPrice,
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
        <Text style={styles.headerTitle}>Price approvals</Text>
        <AdminMenuButton />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Manager price is only a suggestion. Set your own final price before
          approving.
        </Text>
      </View>

      <View style={styles.filterRow}>
        {(['pending', 'approved', 'rejected', 'all'] as Filter[]).map(item => {
          const active = filter === item;
          return (
            <Pressable
              key={item}
              accessibilityRole="button"
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setFilter(item)}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {item[0].toUpperCase() + item.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        refreshing={loading}
        onRefresh={() => {
          void load();
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No requests</Text>
            <Text style={styles.emptySubtitle}>
              Price change requests from branch managers will appear here.
            </Text>
          </View>
        }
        renderItem={({item}) => {
          const finalInput = finalPrices[item.id] ?? '';
          const previewAmount = parseAdminPrice(finalInput);
          return (
            <View style={styles.card}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.meta}>
                By {item.requestedByName} ({item.requestedByEmail})
              </Text>
              <Text style={styles.meta}>{formatWhen(item.createdAt)}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.oldPrice}>{item.currentPrice}</Text>
                <Icon name="arrow-right" size={16} color="#6B7280" />
                <View>
                  <Text style={styles.suggestLabel}>Suggested</Text>
                  <Text style={styles.newPrice}>{item.requestedPrice}</Text>
                </View>
              </View>

              {item.status === 'approved' && item.approvedPrice ? (
                <Text style={styles.finalPriceText}>
                  Final: {item.approvedPrice}
                </Text>
              ) : null}

              <View
                style={[
                  styles.statusBadge,
                  item.status === 'pending' && styles.statusPending,
                  item.status === 'approved' && styles.statusApproved,
                  item.status === 'rejected' && styles.statusRejected,
                ]}>
                <Text style={styles.statusText}>
                  {item.status.toUpperCase()}
                </Text>
              </View>

              {item.status === 'pending' ? (
                <>
                  <Text style={styles.finalLabel}>Your final price (PKR)</Text>
                  <TextInput
                    style={styles.finalInput}
                    value={finalInput}
                    onChangeText={text => setFinalPrice(item.id, text)}
                    placeholder="e.g. 1499"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    editable={busyId !== item.id}
                  />
                  <Text style={styles.finalHint}>
                    Will apply:{' '}
                    {formatAdminPrice(previewAmount > 0 ? previewAmount : 0)}
                  </Text>
                  <View style={styles.actions}>
                    <Pressable
                      accessibilityRole="button"
                      style={[
                        styles.approveButton,
                        busyId === item.id && {opacity: 0.6},
                      ]}
                      disabled={busyId === item.id}
                      onPress={() => handleApprove(item)}>
                      <Text style={styles.actionText}>Set & approve</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      style={[
                        styles.rejectButton,
                        busyId === item.id && {opacity: 0.6},
                      ]}
                      disabled={busyId === item.id}
                      onPress={() => handleReject(item)}>
                      <Text style={styles.actionText}>Reject</Text>
                    </Pressable>
                  </View>
                </>
              ) : null}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default AdminPriceApprovalsScreen;
