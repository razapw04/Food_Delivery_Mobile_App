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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import useController from './useController';

const ProfileScreen = () => {
  const {
    user,
    name,
    phone,
    saving,
    initials,
    canSave,
    setName,
    setPhone,
    handleSave,
    goBack,
  } = useController();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={goBack}
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#202321" />
        </Pressable>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials || 'U'}</Text>
            </View>
            <Text style={styles.emailText}>{user?.email ?? ''}</Text>
          </View>

          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="03XXXXXXXXX"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={user?.email ?? ''}
            editable={false}
          />
          <Text style={styles.hint}>Email cannot be changed in this demo.</Text>

          <Pressable
            accessibilityRole="button"
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            disabled={!canSave}
            onPress={() => {
              void handleSave();
            }}>
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save changes'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
