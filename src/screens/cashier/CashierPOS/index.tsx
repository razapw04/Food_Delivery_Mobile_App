import React, {useState} from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
    cartQtyByProductId,
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
    pendingProduct,
    selectedVariation,
    selectedToppingIds,
    pendingVariations,
    selectedVariationOption,
    toppings,
    pickerQuantity,
    pickerTotalPrice,
    addProduct,
    closeProductPicker,
    selectVariation,
    toggleTopping,
    decreasePickerQuantity,
    increasePickerQuantity,
    confirmProductPicker,
    updateQuantity,
    clearCart,
    handlePlaceOrder,
    handleBack,
    continueEditingFromSlip,
    closeSlip,
  } = useController();

  const [cartOpen, setCartOpen] = useState(true);
  const canPlace = cart.length > 0 && !placing;
  const isEditingTab = Boolean(editingOrder);

  const ctaLabel = placing
    ? isEditingTab
      ? 'Saving...'
      : 'Sending...'
    : isEditingTab
      ? 'Save guest order'
      : serviceMode === 'dine_in'
        ? 'Open table tab'
        : 'Charge & send';

  const listHeader = (
    <>
      <View style={styles.ticketCard}>
        {isEditingTab ? (
          <View style={styles.editingBanner}>
            <Text style={styles.editingBannerText}>
              Editing {editingOrder?.customerName || 'guest'} ·{' '}
              {editingOrder?.orderId} · open until bill is paid
            </Text>
          </View>
        ) : (
          <View style={styles.modeRow}>
            <Pressable
              accessibilityRole="button"
              style={[
                styles.modeChip,
                serviceMode === 'dine_in' && styles.modeChipActive,
              ]}
              onPress={() => setServiceMode('dine_in')}>
              <Icon
                name="table-chair"
                size={16}
                color={serviceMode === 'dine_in' ? '#FF7622' : '#6B7280'}
              />
              <Text
                style={[
                  styles.modeChipText,
                  serviceMode === 'dine_in' && styles.modeChipTextActive,
                ]}>
                Dine-in
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={[
                styles.modeChip,
                serviceMode === 'pickup' && styles.modeChipActive,
              ]}
              onPress={() => setServiceMode('pickup')}>
              <Icon
                name="shopping-outline"
                size={16}
                color={serviceMode === 'pickup' ? '#FF7622' : '#6B7280'}
              />
              <Text
                style={[
                  styles.modeChipText,
                  serviceMode === 'pickup' && styles.modeChipTextActive,
                ]}>
                Pickup
              </Text>
            </Pressable>
          </View>
        )}

        <View style={styles.ticketRow}>
          {serviceMode === 'dine_in' || isEditingTab ? (
            <View style={styles.ticketField}>
              <Text style={styles.fieldLabel}>Table</Text>
              <TextInput
                style={styles.input}
                value={tableNo}
                onChangeText={setTableNo}
                placeholder="12 / A3"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
              />
            </View>
          ) : null}
          <View style={styles.ticketField}>
            <Text style={styles.fieldLabel}>Waiter</Text>
            <TextInput
              style={styles.input}
              value={waiterName}
              onChangeText={setWaiterName}
              placeholder="Staff name"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.ticketRow}>
          <View style={styles.ticketField}>
            <Text style={styles.fieldLabel}>Guest</Text>
            <TextInput
              style={styles.input}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Walk-in"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {!isEditingTab ? (
            <View style={styles.ticketField}>
              <Text style={styles.fieldLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={customerPhone}
                onChangeText={setCustomerPhone}
                placeholder="03…"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
          ) : null}
        </View>

        <Text style={styles.fieldLabel}>Payment</Text>
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
      </View>

      <View style={styles.searchWrap}>
        <Icon name="magnify" size={18} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search menu item"
          placeholderTextColor="#9CA3AF"
          autoCorrect={false}
        />
        {search.length > 0 ? (
          <Pressable onPress={() => setSearch('')}>
            <Icon name="close-circle" size={18} color="#9CA3AF" />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        keyboardShouldPersistTaps="handled">
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
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            style={styles.backButton}
            onPress={handleBack}>
            <Icon name="arrow-left" size={22} color="#111827" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {isEditingTab ? 'Edit guest order' : 'Counter POS'}
            </Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {branch?.name ?? 'Unassigned branch'}
              {isEditingTab
                ? ` · ${editingOrder?.customerName || 'Guest'} · Table ${
                    editingOrder?.tableNo ?? '—'
                  }`
                : ' · Live kitchen'}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Toggle cart"
            accessibilityRole="button"
            style={styles.headerCartButton}
            onPress={() => setCartOpen(prev => !prev)}>
            <Icon name="cart-outline" size={20} color="#111827" />
            {itemCount > 0 ? (
              <View style={styles.headerCartBadge}>
                <Text style={styles.headerCartBadgeText}>
                  {itemCount > 99 ? '99+' : itemCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          numColumns={2}
          style={styles.body}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <Text style={styles.emptyProducts}>No matching items.</Text>
          }
          renderItem={({item}) => {
            const qty = cartQtyByProductId[item.id] ?? 0;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Add ${item.name}`}
                style={styles.productCard}
                onPress={() => addProduct(item)}>
                <View style={styles.productImageWrap}>
                  <Image
                    source={{uri: item.image}}
                    style={styles.productImage}
                  />
                  {qty > 0 ? (
                    <View style={styles.qtyBadge}>
                      <Text style={styles.qtyBadgeText}>{qty}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.productBody}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>{item.price}</Text>
                    <View style={styles.addIcon}>
                      <Icon name="plus" size={16} color="#FF7622" />
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />

        <View style={styles.checkoutBar}>
          <Pressable
            accessibilityRole="button"
            style={styles.checkoutToggle}
            onPress={() => setCartOpen(prev => !prev)}>
            <Text style={styles.checkoutMeta}>
              Ticket · {itemCount} item{itemCount === 1 ? '' : 's'}
            </Text>
            <View style={styles.checkoutToggleRight}>
              {cart.length > 0 ? (
                <Pressable onPress={clearCart}>
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              ) : null}
              <Icon
                name={cartOpen ? 'chevron-down' : 'chevron-up'}
                size={20}
                color="#6B7280"
              />
            </View>
          </Pressable>

          {cartOpen && cart.length > 0 ? (
            <ScrollView
              style={styles.cartSheet}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              {cart.map(line => (
                <View key={line.id} style={styles.cartLine}>
                  <View style={styles.cartLineInfo}>
                    <Text style={styles.cartLineName} numberOfLines={1}>
                      {line.name}
                    </Text>
                    <Text style={styles.cartLineMeta} numberOfLines={1}>
                      {line.variation}
                      {line.toppings.length > 0
                        ? ` · ${line.toppings.join(', ')}`
                        : ''}
                    </Text>
                  </View>
                  <View style={styles.qtyControls}>
                    <Pressable
                      accessibilityRole="button"
                      style={styles.qtyButton}
                      onPress={() =>
                        updateQuantity(line.id, line.quantity - 1)
                      }>
                      <Icon name="minus" size={14} color="#111827" />
                    </Pressable>
                    <Text style={styles.qtyValue}>{line.quantity}</Text>
                    <Pressable
                      accessibilityRole="button"
                      style={styles.qtyButton}
                      onPress={() =>
                        updateQuantity(line.id, line.quantity + 1)
                      }>
                      <Icon name="plus" size={14} color="#111827" />
                    </Pressable>
                  </View>
                  <Text style={styles.cartLineTotal}>
                    {formatPrice(line.unitPrice * line.quantity)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : null}

          <View style={styles.checkoutActions}>
            <View style={styles.totalBlock}>
              <Text style={styles.totalLabel}>
                {isEditingTab ? 'Tab total' : 'Total'}
              </Text>
              <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              style={[
                styles.placeButton,
                !canPlace && styles.placeButtonDisabled,
              ]}
              disabled={!canPlace}
              onPress={() => {
                void handlePlaceOrder();
              }}>
              <Icon name="printer-pos" size={18} color="#FFFFFF" />
              <Text style={styles.placeButtonText}>{ctaLabel}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={!!pendingProduct}
        transparent
        animationType="slide"
        onRequestClose={closeProductPicker}>
        <View style={styles.pickerOverlay}>
          <Pressable
            style={styles.pickerBackdrop}
            onPress={closeProductPicker}
          />
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHandle} />
            <View style={styles.pickerHeader}>
              <View style={styles.pickerHeaderText}>
                <Text style={styles.pickerTitle} numberOfLines={1}>
                  {pendingProduct?.name ?? 'Select item'}
                </Text>
                <Text style={styles.pickerSubtitle}>
                  Choose size / variant before adding
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                style={styles.pickerClose}
                onPress={closeProductPicker}>
                <Icon name="close" size={18} color="#111827" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.pickerBody}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View style={styles.variationHeader}>
                <Text style={styles.variationTitle}>Variation</Text>
                <Text style={styles.requiredBadge}>Required</Text>
              </View>
              <View style={styles.variationList}>
                {pendingVariations.map(option => {
                  const selected = selectedVariation === option.key;
                  return (
                    <Pressable
                      key={option.key}
                      accessibilityRole="radio"
                      accessibilityState={{selected}}
                      style={styles.variationRow}
                      onPress={() => selectVariation(option.key)}>
                      <View
                        style={[
                          styles.radioOuter,
                          selected && styles.radioOuterSelected,
                        ]}>
                        {selected ? <View style={styles.radioInner} /> : null}
                      </View>
                      <Text style={styles.variationLabel}>{option.label}</Text>
                      <Text style={styles.variationPrice}>{option.price}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {selectedVariationOption ? (
                <View style={styles.toppingSection}>
                  <View style={styles.variationHeader}>
                    <Text style={styles.variationTitle}>Topping</Text>
                    <Text style={styles.optionalBadge}>Optional</Text>
                  </View>
                  <View style={styles.variationList}>
                    {toppings.map(topping => {
                      const selected = selectedToppingIds.includes(topping.id);
                      return (
                        <Pressable
                          key={topping.id}
                          accessibilityRole="checkbox"
                          accessibilityState={{checked: selected}}
                          style={styles.variationRow}
                          onPress={() => toggleTopping(topping.id)}>
                          <View
                            style={[
                              styles.checkOuter,
                              selected && styles.checkOuterSelected,
                            ]}>
                            {selected ? (
                              <Icon name="check" size={14} color="#FFFFFF" />
                            ) : null}
                          </View>
                          <Text style={styles.variationLabel}>
                            {topping.name}
                          </Text>
                          <Text style={styles.variationPrice}>
                            {formatPrice(topping.price)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ) : null}
            </ScrollView>

            <View style={styles.pickerFooter}>
              <View style={styles.pickerQty}>
                <Pressable
                  accessibilityRole="button"
                  style={styles.qtyButton}
                  onPress={decreasePickerQuantity}>
                  <Icon name="minus" size={14} color="#111827" />
                </Pressable>
                <Text style={styles.qtyValue}>{pickerQuantity}</Text>
                <Pressable
                  accessibilityRole="button"
                  style={styles.qtyButton}
                  onPress={increasePickerQuantity}>
                  <Icon name="plus" size={14} color="#111827" />
                </Pressable>
              </View>
              <Pressable
                accessibilityRole="button"
                style={[
                  styles.pickerAddButton,
                  !selectedVariationOption && styles.placeButtonDisabled,
                ]}
                disabled={!selectedVariationOption}
                onPress={confirmProductPicker}>
                <Text style={styles.placeButtonText}>
                  Add · {formatPrice(pickerTotalPrice)}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <OrderSlipModal
        visible={!!slipOrder}
        order={slipOrder}
        onClose={closeSlip}
        onEditOpenTab={continueEditingFromSlip}
      />
    </SafeAreaView>
  );
};

export default CashierPOSScreen;
