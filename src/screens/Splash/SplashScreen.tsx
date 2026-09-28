import React, {useEffect, useRef} from 'react';
import {
  View,
  Image,
  Animated,
  StatusBar,
} from 'react-native';

import styles from './Splash.styles';
import { useNavigation } from '@react-navigation/native';
import type {RootStackParamList} from '../../../App'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type SplashNavigationProp = NativeStackNavigationProp< 
RootStackParamList,
 'Splash' 
 >;
const SplashScreen = () => {
  const Navigation = useNavigation<SplashNavigationProp>();
  // Top image starts outside the screen on the left
  const topAnim = useRef(new Animated.Value(-300)).current;

  // Bottom image starts outside the screen on the right
  const bottomAnim = useRef(new Animated.Value(300)).current;

  // Images start invisible
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo is visible first
      Animated.delay(500),

      Animated.parallel([
        // Top image: LEFT → CENTER
        Animated.timing(topAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),

        // Bottom image: RIGHT → CENTER
        Animated.timing(bottomAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),

        // Fade images in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
  setTimeout(() => {
    Navigation.replace('OnboardingOne');
  }, 1000);
});
  }, [topAnim, bottomAnim, fadeAnim]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Top Image */}
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

      {/* Center Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Image */}
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