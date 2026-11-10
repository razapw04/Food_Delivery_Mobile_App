import React from 'react';
import {
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

type Props = NativeStackScreenProps<RootStackParamList, 'AdminProductForm'>;

const AdminProductFormScreen = ({navigation, route}: Props) => {
  const {
    isEditing,
    name,
    setName,
    description,
    setDescription,
    priceInput,
    setPriceInput,
    categoryId,
    setCategoryId,
    image,
    setImage,
    saving,
    canSave,
    pricePreview,
    menuCategories,
    handleSave,
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
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit product' : 'Add product'}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Product name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Margherita"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Short description"
          placeholderTextColor="#9CA3AF"
          multiline
        />

        <Text style={styles.label}>Price (PKR)</Text>
        <TextInput
          style={styles.input}
          value={priceInput}
          onChangeText={setPriceInput}
          placeholder="e.g. 1299"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
        />
        <Text style={styles.hint}>Preview: {pricePreview}</Text>

        <Text style={styles.label}>Category</Text>
        <View style={styles.chipsRow}>
          {menuCategories.map(category => {
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
        </View>

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          value={image}
          onChangeText={setImage}
          placeholder="https://..."
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Pressable
          accessibilityRole="button"
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          disabled={!canSave}
          onPress={() => {
            void handleSave();
          }}>
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : isEditing ? 'Update product' : 'Add product'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminProductFormScreen;
