import React from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import LiquidGlassPanel from '../../components/LiquidGlassPanel';
import {colors} from '../../theme';
import {styles} from './styles';
import useController from './useController';

const logoSource = require('../../assets/images/Logo.png');

const PlaceOrderScreen = () => {
  const {
    sectionTitle,
    fullAddress,
    paymentMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentAmountLabel,
    productPriceLabel,
    discountLabel,
    deliveryFeeLabel,
    taxLabel,
    taxAmountLabel,
    totalLabel,
    deliveryInstructions,
    setDeliveryInstructions,
    stickyBottomPad,
    modalType,
    modalTranslateY,
    progressWidth,
    confirmSeconds,
    isCashOnDelivery,
    isPlacingOrder,
    handleBack,
    handleEditAddress,
    goToVoucher,
    handlePlaceOrder,
    handleCancelConfirm,
    handleProceedNow,
    handleDismissMinOrder,
  } = useController();

  const progressStyle = {
    width: progressWidth.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
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
        <Text style={styles.headerTitle}>Your Basket</Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        <View style={styles.addressCard}>
          <View style={styles.addressCopy}>
            <Text style={styles.addressText} numberOfLines={2}>
              {fullAddress}
            </Text>
            <Text style={styles.addressDescription} numberOfLines={3}>
              {fullAddress}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Edit address"
            accessibilityRole="button"
            onPress={handleEditAddress}
            style={styles.editButton}
            hitSlop={8}>
            <Text style={styles.editText}>Edit</Text>
            <View style={styles.editUnderline} />
          </Pressable>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Payment Method</Text>
          <View style={styles.paymentCard}>
            {paymentMethods.map((method, index) => {
              const selected = selectedPaymentMethod === method.id;
              const isLast = index === paymentMethods.length - 1;

              return (
                <Pressable
                  key={method.id}
                  accessibilityRole="radio"
                  accessibilityState={{selected}}
                  accessibilityLabel={method.label}
                  onPress={() => setSelectedPaymentMethod(method.id)}
                  style={[
                    styles.paymentOption,
                    isLast ? styles.paymentOptionLast : null,
                  ]}>
                  <Icon
                    name={selected ? 'radiobox-marked' : 'radiobox-blank'}
                    size={22}
                    color={selected ? colors.primary : '#9CA3AF'}
                    style={styles.paymentRadio}
                  />
                  <Text style={styles.paymentLabel}>{method.label}</Text>
                  <Text style={styles.paymentPrice}>{paymentAmountLabel}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Apply vouchers"
          onPress={goToVoucher}
          style={styles.voucherCard}>
          <Text style={styles.voucherText}>Apply Vouchers</Text>
          <Icon name="chevron-right" size={24} color="#1A1A1A" />
        </Pressable>

        <View style={styles.billCard}>
          <Text style={styles.billTitle}>Bill Summary</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Product Price</Text>
            <Text style={styles.billValue}>{productPriceLabel}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Discount</Text>
            <Text style={styles.billValue}>{discountLabel}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>{deliveryFeeLabel}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>{taxLabel}</Text>
            <Text style={styles.billValue}>{taxAmountLabel}</Text>
          </View>
          <View style={styles.billDivider} />
          <View style={styles.billRow}>
            <Text style={styles.billTotalLabel}>Total</Text>
            <Text style={styles.billTotalValue}>{totalLabel}</Text>
          </View>
        </View>

        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>Delivery Instructions</Text>
          <Text style={styles.instructionsDescription}>
            Are there any specific delivery instructions?
          </Text>
          <TextInput
            style={styles.instructionsInput}
            value={deliveryInstructions}
            onChangeText={setDeliveryInstructions}
            placeholder="e.g No Doorbell ring"
            placeholderTextColor="#9A9F9B"
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <LiquidGlassPanel
        glassType="regular"
        style={[styles.stickyBar, {paddingBottom: stickyBottomPad}]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Place Order"
          onPress={handlePlaceOrder}
          style={styles.placeOrderButton}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </Pressable>
      </LiquidGlassPanel>

      <Modal
        visible={modalType != null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={
          modalType === 'confirm' ? handleCancelConfirm : handleDismissMinOrder
        }>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalCard,
              {transform: [{translateY: modalTranslateY}]},
            ]}>
            {modalType === 'minOrder' ? (
              <>
                <Text style={styles.modalMessage}>
                  Sorry order is less than 500
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="OK"
                  onPress={handleDismissMinOrder}
                  style={styles.modalOkButton}>
                  <Text style={styles.modalOkText}>OK</Text>
                </Pressable>
              </>
            ) : null}

            {modalType === 'confirm' ? (
              <>
                <Image
                  accessibilityLabel="App logo"
                  resizeMode="contain"
                  source={logoSource}
                  style={styles.modalLogo}
                />
                <Text style={styles.modalHeading}>Confirm your order</Text>
                <View style={styles.progressTrack}>
                  <Animated.View style={[styles.progressFill, progressStyle]} />
                </View>
                {isCashOnDelivery ? (
                  <Text style={styles.confirmTimerText}>
                    {confirmSeconds} sec
                  </Text>
                ) : null}
                <View style={styles.confirmActions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Cancel"
                    disabled={isPlacingOrder}
                    onPress={handleCancelConfirm}
                    style={[styles.confirmButton, styles.cancelButton]}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Proceed"
                    disabled={isPlacingOrder}
                    onPress={handleProceedNow}
                    style={[styles.confirmButton, styles.proceedButton]}>
                    <Text style={styles.proceedButtonText}>
                      {isPlacingOrder ? 'Placing...' : 'Proceed'}
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : null}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PlaceOrderScreen;
