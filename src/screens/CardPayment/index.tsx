import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import useController from './useController';

const CardPaymentScreen = () => {
  const {
    amountLabel,
    cardHolder,
    setCardHolder,
    cardNumber,
    handleCardNumberChange,
    expiry,
    handleExpiryChange,
    cvv,
    handleCvvChange,
    previewNumber,
    previewName,
    previewExpiry,
    touched,
    errors,
    isPaying,
    stickyBottomPad,
    handleBack,
    handlePay,
  } = useController();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={handleBack}
          style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#202321" />
        </Pressable>
        <Text style={styles.headerTitle}>Card Payment</Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount to pay</Text>
          <Text style={styles.amountValue}>{amountLabel}</Text>
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewBrand}>DEBIT / CREDIT</Text>
          <Text style={styles.previewNumber}>{previewNumber}</Text>
          <View style={styles.previewFooter}>
            <View>
              <Text style={styles.previewMetaLabel}>CARD HOLDER</Text>
              <Text style={styles.previewMetaValue} numberOfLines={1}>
                {previewName.toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.previewMetaLabel}>EXPIRES</Text>
              <Text style={styles.previewMetaValue}>{previewExpiry}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Cardholder name</Text>
        <TextInput
          style={[
            styles.input,
            touched && errors.cardHolder ? styles.inputError : null,
          ]}
          value={cardHolder}
          onChangeText={setCardHolder}
          placeholder="Name on card"
          placeholderTextColor="#9A9F9B"
          autoCapitalize="characters"
          autoCorrect={false}
        />
        {touched && errors.cardHolder ? (
          <Text style={styles.errorText}>{errors.cardHolder}</Text>
        ) : null}

        <Text style={styles.label}>Card number</Text>
        <TextInput
          style={[
            styles.input,
            touched && errors.cardNumber ? styles.inputError : null,
          ]}
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          placeholder="ACCT-000003"
          placeholderTextColor="#9A9F9B"
          keyboardType="number-pad"
          maxLength={19}
        />
        {touched && errors.cardNumber ? (
          <Text style={styles.errorText}>{errors.cardNumber}</Text>
        ) : null}

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Expiry</Text>
            <TextInput
              style={[
                styles.input,
                touched && errors.expiry ? styles.inputError : null,
              ]}
              value={expiry}
              onChangeText={handleExpiryChange}
              placeholder="MM/YY"
              placeholderTextColor="#9A9F9B"
              keyboardType="number-pad"
              maxLength={5}
            />
            {touched && errors.expiry ? (
              <Text style={styles.errorText}>{errors.expiry}</Text>
            ) : null}
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={[
                styles.input,
                touched && errors.cvv ? styles.inputError : null,
              ]}
              value={cvv}
              onChangeText={handleCvvChange}
              placeholder="123"
              placeholderTextColor="#9A9F9B"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
            />
            {touched && errors.cvv ? (
              <Text style={styles.errorText}>{errors.cvv}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.secureNote}>
          <Icon name="shield-check-outline" size={16} color="#858B87" />
          <Text style={styles.secureNoteText}>
            Your card details stay on this device (demo payment).
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.stickyBar, {paddingBottom: stickyBottomPad}]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Pay now"
          disabled={isPaying}
          onPress={handlePay}
          style={[styles.payButton, isPaying ? styles.payButtonDisabled : null]}>
          <Text style={styles.payButtonText}>
            {isPaying ? 'Processing...' : `Pay ${amountLabel}`}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default CardPaymentScreen;
