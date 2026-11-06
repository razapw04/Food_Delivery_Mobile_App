import React, {useCallback, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../../context/AuthContext';
import {useCatalog} from '../../context/CatalogContext';
import {
  listPriceChangeRequests,
  reviewPriceChangeRequest,
  type PriceChangeRequest,
  type PriceChangeStatus,
} from '../../storage/priceChangeRequestsStorage';
import type {RootStackParamList} from '../../types/navigation';
import {styles} from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AdminPriceApprovals'>;
type Filter = 'pending' | 'all' | PriceChangeStatus;

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const AdminPriceApprovalsScreen = () => {
  const navigation = useNavigation<Nav>();
  const {isSuperAdmin} = useAuth();
  const {menuItems} = useCatalog();
  const [requests, setRequests] = useState<PriceChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('pending');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRequests(await listPriceChangeRequests());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!isSuperAdmin) {
        navigation.replace('AdminOrders');
        return;
      }
      void load();
    }, [isSuperAdmin, load, navigation]),
  );

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return requests;
    }
    return requests.filter(item => item.status === filter);
  }, [filter, requests]);

  const handleReview = (
    request: PriceChangeRequest,
    decision: 'approved' | 'rejected',
  ) => {
    Alert.alert(
      decision === 'approved' ? 'Approve price change?' : 'Reject request?',
      `${request.productName}: ${request.currentPrice} → ${request.requestedPrice}`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: decision === 'approved' ? 'Approve' : 'Reject',
          style: decision === 'approved' ? 'default' : 'destructive',
          onPress: () => {
            void (async () => {
              setBusyId(request.id);
              try {
                const result = await reviewPriceChangeRequest({
                  requestId: request.id,
                  decision,
                  seedProducts: menuItems,
                });
                if (!result.ok) {
                  Alert.alert('Action failed', result.error);
                  return;
                }
                await load();
              } finally {
                setBusyId(null);
              }
            })();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Price approvals</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Approve to apply the new product price. Reject to keep the current
          price.
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
        refreshing={loading}
        onRefresh={() => {
          void load();
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No requests</Text>
            <Text style={styles.emptySubtitle}>
              Price change requests from branch admins will appear here.
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.meta}>
              By {item.requestedByName} ({item.requestedByEmail})
            </Text>
            <Text style={styles.meta}>{formatWhen(item.createdAt)}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.oldPrice}>{item.currentPrice}</Text>
              <Icon name="arrow-right" size={16} color="#6B7280" />
              <Text style={styles.newPrice}>{item.requestedPrice}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                item.status === 'pending' && styles.statusPending,
                item.status === 'approved' && styles.statusApproved,
                item.status === 'rejected' && styles.statusRejected,
              ]}>
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>

            {item.status === 'pending' ? (
              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  style={[
                    styles.approveButton,
                    busyId === item.id && {opacity: 0.6},
                  ]}
                  disabled={busyId === item.id}
                  onPress={() => handleReview(item, 'approved')}>
                  <Text style={styles.actionText}>Approve</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  style={[
                    styles.rejectButton,
                    busyId === item.id && {opacity: 0.6},
                  ]}
                  disabled={busyId === item.id}
                  onPress={() => handleReview(item, 'rejected')}>
                  <Text style={styles.actionText}>Reject</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default AdminPriceApprovalsScreen;
