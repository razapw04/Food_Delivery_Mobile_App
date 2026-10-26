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
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/button/Button';
import {styles} from './styles';
import useController from './useController';

const SignupScreen = () => {
  const {
    name,
    email,
    phone,
    password,
    confirmPassword,
    fieldErrors,
    formError,
    setName,
    setEmail,
    setPhone,
    setPassword,
    setConfirmPassword,
    isSubmitting,
    handleSignup,
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
          <Image
            source={require('../../assets/images/Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>
            Create an account to get started.
          </Text>

          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={[styles.input, !!fieldErrors.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#9A9F9B"
            autoCapitalize="words"
          />
          {!!fieldErrors.name && (
            <Text style={styles.fieldErrorText}>{fieldErrors.name}</Text>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, !!fieldErrors.email && styles.inputError]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#9A9F9B"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {!!fieldErrors.email && (
            <Text style={styles.fieldErrorText}>{fieldErrors.email}</Text>
          )}

          <Text style={styles.label}>Mobile number</Text>
          <TextInput
            style={[styles.input, !!fieldErrors.phone && styles.inputError]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your mobile number"
            placeholderTextColor="#9A9F9B"
            keyboardType="phone-pad"
          />
          {!!fieldErrors.phone && (
            <Text style={styles.fieldErrorText}>{fieldErrors.phone}</Text>
          )}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, !!fieldErrors.password && styles.inputError]}
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            placeholderTextColor="#9A9F9B"
            secureTextEntry
          />
          {!!fieldErrors.password && (
            <Text style={styles.fieldErrorText}>{fieldErrors.password}</Text>
          )}

          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            style={[
              styles.input,
              !!fieldErrors.confirmPassword && styles.inputError,
            ]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            placeholderTextColor="#9A9F9B"
            secureTextEntry
          />
          {!!fieldErrors.confirmPassword && (
            <Text style={styles.fieldErrorText}>
              {fieldErrors.confirmPassword}
            </Text>
          )}

          {!!formError && <Text style={styles.errorText}>{formError}</Text>}

          <View style={styles.buttonWrap}>
            <Button
              title={isSubmitting ? 'Creating account...' : 'Sign Up'}
              onPress={handleSignup}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={goToLogin} hitSlop={8}>
              <Text style={styles.footerLink}>Log In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
