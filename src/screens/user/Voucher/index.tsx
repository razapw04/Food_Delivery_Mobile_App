import React from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCart} from '../../../context/CartContext';
import {
  AVAILABLE_VOUCHERS,
  formatVoucherValue,
  type VoucherOffer,
} from './model';
import {styles} from './styles';
import useController from './useController';

const VoucherScreen = () => {
  const {handleBack} = useController();
  const {
    cartTotal,
    appliedVoucher,
    discountAmount,
    applyVoucher,
    clearVoucher,
  } = useCart();

  const handleApply = (voucher: VoucherOffer) => {
    const result = applyVoucher(voucher);
    if (!result.ok) {
      Alert.alert('Cannot apply', result.error);
      return;
    }
    Alert.alert('Voucher applied', `${voucher.code} will be used at checkout.`);
    handleBack();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={handleBack}
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#202321" />
        </Pressable>
        <Text style={styles.headerTitle}>Vouchers</Text>
      </View>

      <FlatList
        data={AVAILABLE_VOUCHERS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                Choose a voucher to apply at checkout. Discount updates your
                bill automatically.
              </Text>
            </View>
            <Text style={styles.cartMeta}>
              Cart total: Rs. {cartTotal.toLocaleString('en-PK')}
              {appliedVoucher
                ? ` · Applied ${appliedVoucher.code} (−Rs. ${discountAmount.toLocaleString('en-PK')})`
                : ''}
            </Text>
          </View>
        }
        renderItem={({item}) => {
          const active = appliedVoucher?.id === item.id;
          const locked = cartTotal < item.minOrder;
          return (
            <View style={[styles.card, active && styles.cardActive]}>
              <View style={styles.cardTop}>
                <Text style={styles.code}>{item.code}</Text>
                <View style={styles.valueBadge}>
                  <Text style={styles.valueBadgeText}>
                    {formatVoucherValue(item)}
                  </Text>
                </View>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              {locked ? (
                <Text style={styles.lockedHint}>
                  Add Rs.{' '}
                  {(item.minOrder - cartTotal).toLocaleString('en-PK')} more to
                  unlock.
                </Text>
              ) : null}
              <View style={styles.actions}>
                {active ? (
                  <Pressable
                    accessibilityRole="button"
                    style={styles.removeButton}
                    onPress={clearVoucher}>
                    <Text style={styles.actionText}>Remove</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    style={[
                      styles.applyButton,
                      locked && styles.applyButtonDisabled,
                    ]}
                    disabled={locked}
                    onPress={() => handleApply(item)}>
                    <Text style={styles.actionText}>Apply</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default VoucherScreen;
