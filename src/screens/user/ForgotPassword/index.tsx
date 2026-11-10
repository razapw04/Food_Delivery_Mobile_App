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
import Button from '../../../components/button/Button';
import {styles} from './styles';
import useController from './useController';

const ForgotPasswordScreen = () => {
  const {
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    error,
    isSubmitting,
    setEmail,
    setPassword,
    setConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    handleReset,
    goBack,
    goToLogin,
  } = useController();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            style={styles.backButton}
            onPress={goBack}>
            <Icon name="arrow-left" size={22} color="#1A1A1A" />
          </Pressable>

          <Text style={styles.title}>Forgot password</Text>
          <Text style={styles.subtitle}>
            Enter your account email and set a new password. For now this works
            for local demo accounts only.
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#9A9F9B"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>New password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="Min 6 characters"
              placeholderTextColor="#9A9F9B"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              accessibilityLabel={
                showPassword ? 'Hide password' : 'Show password'
              }
              accessibilityRole="button"
              hitSlop={8}
              onPress={toggleShowPassword}
              style={styles.eyeButton}>
              <Icon
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#858B87"
              />
            </Pressable>
          </View>

          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter password"
              placeholderTextColor="#9A9F9B"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              accessibilityLabel={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
              accessibilityRole="button"
              hitSlop={8}
              onPress={toggleShowConfirmPassword}
              style={styles.eyeButton}>
              <Icon
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#858B87"
              />
            </Pressable>
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonWrap}>
            <Button
              title={isSubmitting ? 'Updating...' : 'Reset password'}
              onPress={() => {
                void handleReset();
              }}
              style={styles.fullWidthButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Remembered it? </Text>
            <Pressable onPress={goToLogin} hitSlop={8}>
              <Text style={styles.footerLink}>Log In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
