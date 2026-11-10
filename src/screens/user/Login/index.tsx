import React from 'react';
import {
  Image,
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
import {colors} from '../../../theme';
import {styles} from './styles';
import useController from './useController';

const LoginScreen = () => {
  const {
    email,
    password,
    rememberMe,
    showPassword,
    error,
    setEmail,
    setPassword,
    toggleRememberMe,
    toggleShowPassword,
    isSubmitting,
    handleLogin,
    goToSignup,
    goToForgotPassword,
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
          <Image
            source={require('../../../assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Log In</Text>
          <Text style={styles.subtitle}>
            Welcome back! Sign in to continue.
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

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
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

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.optionsRow}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{checked: rememberMe}}
              accessibilityLabel="Remember me"
              style={styles.rememberWrap}
              onPress={toggleRememberMe}
              hitSlop={8}>
              <Icon
                name={
                  rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'
                }
                size={20}
                color={rememberMe ? colors.primary : '#9CA3AF'}
              />
              <Text style={styles.rememberText}>Remember me</Text>
            </Pressable>

            <Pressable
              style={styles.forgotWrap}
              hitSlop={8}
              onPress={goToForgotPassword}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>

          <View style={styles.buttonWrap}>
            <Button
              title={isSubmitting ? 'Logging in...' : 'Log In'}
              onPress={handleLogin}
              style={styles.fullWidthButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={goToSignup} hitSlop={8}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
