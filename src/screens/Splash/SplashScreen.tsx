import React, {useEffect, useRef} from 'react';
import {View, Image, Animated, StatusBar} from 'react-native';

import styles from './Splash.styles';
import {useNavigation} from '@react-navigation/native';
import type {RootStackParamList} from '../../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../../context/AuthContext';

type SplashNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashNavigationProp>();
  const {user, isLoading} = useAuth();
  const topAnim = useRef(new Animated.Value(-300)).current;
  const bottomAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasNavigated = useRef(false);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(topAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(bottomAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [topAnim, bottomAnim, fadeAnim]);

  useEffect(() => {
    if (isLoading || hasNavigated.current) {
      return;
    }

    const timer = setTimeout(() => {
      if (hasNavigated.current) {
        return;
      }
      hasNavigated.current = true;
      navigation.replace(user ? 'MainTabs' : 'Login');
    }, 1800);

    return () => clearTimeout(timer);
  }, [isLoading, user, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Animated.Image
        source={require('../../assets/images/SplashTop.png')}
        style={[
          styles.topPattern,
          {
            opacity: fadeAnim,
            transform: [{translateX: topAnim}],
          },
        ]}
        resizeMode="contain"
      />

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Animated.Image
        source={require('../../assets/images/SplashBottom.png')}
        style={[
          styles.bottomPattern,
          {
            opacity: fadeAnim,
            transform: [{translateX: bottomAnim}],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;
