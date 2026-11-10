import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import OrderSlipModal from '../../../components/OrderSlipModal';
import type {StoredPaymentMethod} from '../../../storage/orderStorage';
import {styles} from './styles';
import useController, {formatPrice} from './useController';

const PAYMENT_OPTIONS: {id: StoredPaymentMethod; label: string}[] = [
  {id: 'cod', label: 'Cash'},
  {id: 'card', label: 'Card'},
  {id: 'jazzcash', label: 'JazzCash'},
];

const CashierPOSScreen = () => {
  const {
    branch,
    editingOrder,
    categories,
    categoryId,
    setCategoryId,
    search,
    setSearch,
    filteredItems,
    cart,
    itemCount,
    totalAmount,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    tableNo,
    setTableNo,
    waiterName,
    setWaiterName,
    serviceMode,
    setServiceMode,
    paymentMethod,
    setPaymentMethod,
    placing,
    slipOrder,
    addProduct,
    updateQuantity,
    clearCart,
    handlePlaceOrder,
    handleBack,
    closeSlip,
  } = useController();

  const canPlace = cart.length > 0 && !placing;
  const isEditingTab = Boolean(editingOrder);

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
        <Text style={styles.headerTitle}>
          {isEditingTab ? 'Add to tab' : 'POS'}
        </Text>
        <View style={styles.backButton} />
      </View>
      <Text style={styles.branchLabel}>
        {branch?.name ?? 'Unassigned branch'}
        {isEditingTab
          ? ` · Table ${editingOrder?.tableNo ?? '—'} · ${editingOrder?.orderId}`
          : ' · Counter orders (kitchen notified)'}
      </Text>

      <View style={styles.searchWrap}>
        <Icon name="magnify" size={18} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search menu"
          placeholderTextColor="#9CA3AF"
          autoCorrect={false}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}>
        {categories.map(category => {
          const active = category.id === categoryId;
          return (
            <Pressable
              key={category.id}
              accessibilityRole="button"
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setCategoryId(category.id)}>
              <Text
                style={[styles.chipText, active && styles.chipTextActive]}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.body}>
        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.emptyCart}>No products match your search.</Text>
          }
          renderItem={({item}) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Add ${item.name}`}
              style={styles.productCard}
              onPress={() => addProduct(item)}>
              <Image source={{uri: item.image}} style={styles.productImage} />
              <View style={styles.productBody}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.productPrice}>{item.price}</Text>
                <View style={styles.addRow}>
                  <Icon name="plus" size={14} color="#FF7622" />
                  <Text style={styles.addRowText}>Add</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>

      <View style={styles.cartPanel}>
        <View style={styles.cartHeader}>
          <Text style={styles.cartTitle}>
            Cart{itemCount > 0 ? ` (${itemCount})` : ''}
          </Text>
          {cart.length > 0 ? (
            <Pressable accessibilityRole="button" onPress={clearCart}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          ) : null}
        </View>

        {cart.length === 0 ? (
          <Text style={styles.emptyCart}>
            Tap products above to build a walk-in order.
          </Text>
        ) : (
          <ScrollView
            style={styles.cartScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {cart.map(line => (
              <View key={line.id} style={styles.cartLine}>
                <Text style={styles.cartLineName} numberOfLines={1}>
                  {line.name}
                </Text>
                <View style={styles.qtyControls}>
                  <Pressable
                    accessibilityRole="button"
                    style={styles.qtyButton}
                    onPress={() => updateQuantity(line.id, line.quantity - 1)}>
                    <Icon name="minus" size={14} color="#1A1A1A" />
                  </Pressable>
                  <Text style={styles.qtyValue}>{line.quantity}</Text>
                  <Pressable
                    accessibilityRole="button"
                    style={styles.qtyButton}
                    onPress={() => updateQuantity(line.id, line.quantity + 1)}>
                    <Icon name="plus" size={14} color="#1A1A1A" />
                  </Pressable>
                </View>
                <Text style={styles.cartLineTotal}>
                  {formatPrice(line.unitPrice * line.quantity)}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        {!isEditingTab ? (
          <>
            <Text style={styles.fieldLabel}>Service</Text>
            <View style={styles.payRow}>
              <Pressable
                accessibilityRole="button"
                style={[
                  styles.payChip,
                  serviceMode === 'dine_in' && styles.payChipActive,
                ]}
                onPress={() => setServiceMode('dine_in')}>
                <Text
                  style={[
                    styles.payChipText,
                    serviceMode === 'dine_in' && styles.payChipTextActive,
                  ]}>
                  Dine-in
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={[
                  styles.payChip,
                  serviceMode === 'pickup' && styles.payChipActive,
                ]}
                onPress={() => setServiceMode('pickup')}>
                <Text
                  style={[
                    styles.payChipText,
                    serviceMode === 'pickup' && styles.payChipTextActive,
                  ]}>
                  Pickup
                </Text>
              </Pressable>
            </View>

            {serviceMode === 'dine_in' ? (
              <>
                <Text style={styles.fieldLabel}>Table no / ID</Text>
                <TextInput
                  style={styles.input}
                  value={tableNo}
                  onChangeText={setTableNo}
                  placeholder="e.g. 12 or A3"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                />
              </>
            ) : null}

            <Text style={styles.fieldLabel}>Waiter name</Text>
            <TextInput
              style={styles.input}
              value={waiterName}
              onChangeText={setWaiterName}
              placeholder="Waiter taking the order"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.fieldLabel}>Customer name (optional)</Text>
            <TextInput
              style={styles.input}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Walk-in Customer"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.fieldLabel}>Phone (optional)</Text>
            <TextInput
              style={styles.input}
              value={customerPhone}
              onChangeText={setCustomerPhone}
              placeholder="03XXXXXXXXX"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />

            <View style={styles.payRow}>
              {PAYMENT_OPTIONS.map(option => {
                const active = option.id === paymentMethod;
                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="button"
                    style={[styles.payChip, active && styles.payChipActive]}
                    onPress={() => setPaymentMethod(option.id)}>
                    <Text
                      style={[
                        styles.payChipText,
                        active && styles.payChipTextActive,
                      ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : (
          <Text style={styles.emptyCart}>
            Adding to Table {editingOrder?.tableNo ?? '—'} · Waiter{' '}
            {editingOrder?.waiterName ?? '—'}. New items go on the same slip and
            to kitchen.
          </Text>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            {isEditingTab ? 'Add-on total' : 'Total'}
          </Text>
          <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          style={[styles.placeButton, !canPlace && styles.placeButtonDisabled]}
          disabled={!canPlace}
          onPress={() => {
            void handlePlaceOrder();
          }}>
          <Text style={styles.placeButtonText}>
            {placing
              ? isEditingTab
                ? 'Adding...'
                : 'Placing...'
              : isEditingTab
                ? 'Add to open tab'
                : serviceMode === 'dine_in'
                  ? 'Open dine-in tab'
                  : 'Place POS order'}
          </Text>
        </Pressable>
      </View>

      <OrderSlipModal
        visible={!!slipOrder}
        order={slipOrder}
        onClose={closeSlip}
      />
    </SafeAreaView>
  );
};

export default CashierPOSScreen;
