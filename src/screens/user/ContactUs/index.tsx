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
import useController, {SUPPORT_EMAIL, SUPPORT_PHONE} from './useController';

const ContactUsScreen = () => {
  const {
    message,
    sending,
    canSend,
    setMessage,
    handleSend,
    callSupport,
    emailSupport,
    whatsappSupport,
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
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Need help with an order or account? Reach our support team
              anytime.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Reach us directly</Text>

            <Pressable
              accessibilityRole="button"
              style={styles.contactRow}
              onPress={callSupport}>
              <View style={styles.contactIcon}>
                <Icon name="phone" size={20} color="#FF7622" />
              </View>
              <View>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{SUPPORT_PHONE}</Text>
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              style={styles.contactRow}
              onPress={emailSupport}>
              <View style={styles.contactIcon}>
                <Icon name="email-outline" size={20} color="#FF7622" />
              </View>
              <View>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{SUPPORT_EMAIL}</Text>
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              style={styles.contactRow}
              onPress={whatsappSupport}>
              <View style={styles.contactIcon}>
                <Icon name="whatsapp" size={20} color="#FF7622" />
              </View>
              <View>
                <Text style={styles.contactLabel}>WhatsApp</Text>
                <Text style={styles.contactValue}>Chat with support</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Send a message</Text>
            <Text style={styles.label}>Your message</Text>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your issue or question..."
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <Pressable
              accessibilityRole="button"
              style={[
                styles.submitButton,
                !canSend && styles.submitButtonDisabled,
              ]}
              disabled={!canSend}
              onPress={() => {
                void handleSend();
              }}>
              <Text style={styles.submitButtonText}>
                {sending ? 'Opening email...' : 'Send via email'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactUsScreen;
