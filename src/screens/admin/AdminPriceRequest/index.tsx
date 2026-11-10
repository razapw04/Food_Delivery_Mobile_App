import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {RootStackParamList} from '../../../types/navigation';
import {styles} from './styles';
import useController from './useController';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminPriceRequest'>;

const AdminPriceRequestScreen = ({navigation, route}: Props) => {
  const {
    product,
    priceInput,
    setPriceInput,
    saving,
    canSubmit,
    pricePreview,
    handleSubmit,
    handleBack,
  } = useController(navigation, route);

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
        <Text style={styles.headerTitle}>Suggest price change</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              You can only suggest a price. Super admin will set the final price
              when reviewing this request.
            </Text>
          </View>

          {product ? (
            <>
              <View style={styles.card}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.meta}>{product.description}</Text>
                <Text style={styles.currentPrice}>
                  Current: {product.price}
                </Text>
              </View>

              <Text style={styles.label}>Suggested price (PKR)</Text>
              <TextInput
                style={styles.input}
                value={priceInput}
                onChangeText={setPriceInput}
                placeholder="e.g. 1499"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
              />
              <Text style={styles.hint}>
                Preview: {pricePreview}. Super admin may approve a different
                amount.
              </Text>

              <Pressable
                accessibilityRole="button"
                style={[
                  styles.saveButton,
                  !canSubmit && styles.saveButtonDisabled,
                ]}
                disabled={!canSubmit}
                onPress={() => {
                  void handleSubmit();
                }}>
                <Text style={styles.saveButtonText}>
                  {saving ? 'Sending...' : 'Send suggestion'}
                </Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.card}>
              <Text style={styles.productName}>Product not found</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminPriceRequestScreen;
