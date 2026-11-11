import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Image, Modal, StyleSheet, Text, View} from 'react-native';
import {colors, spacing, typography} from '../../theme';

type Props = {
  visible: boolean;
  onDone: () => void;
  name?: string | null;
};

const getGreeting = (date = new Date()) => {
  const hour = date.getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
};

const SuperAdminWelcomeModal = ({visible, onDone}: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;

  const greeting = useMemo(() => getGreeting(), []);

  useEffect(() => {
    if (!visible) {
      opacity.setValue(0);
      scale.setValue(0.88);
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start(({finished}) => {
        if (finished) {
          onDone();
        }
      });
    }, 4600);

    return () => clearTimeout(timer);
  }, [visible, onDone, opacity, scale]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDone}>
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity,
              transform: [{scale}],
            },
          ]}>
          <View style={styles.iconWrap}>
            <Image
              source={require('../../assets/images/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.title}>Welcome Super Admin</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#FFF7F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logo: {
    width: 64,
    height: 64,
  },
  greeting: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: 4,
  },
  title: {
    color: '#1A1A1A',
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
});

export default SuperAdminWelcomeModal;
