import React, { FC } from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';


import useController from './useController';
import { onboardingData } from './model';
import { styles } from './styles';
import Button from '../../components/button/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

const Onboarding: FC = () => {
  const {
    currentIndex,
    currentItem,
    isLastScreen,
    handleNext,
    handleSkip,
  } = useController();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Image */}
        <Image
          source={currentItem.image}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Heading */}
        <Text style={styles.title}>
          {currentItem.title}
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          {currentItem.description}
        </Text>

        {/* Pagination */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Button */}
        <Button
          title={isLastScreen ? 'Get Started' : 'Continue'}
          onPress={handleNext}
        />

        {/* Skip */}
        {!isLastScreen && (
          <Pressable
            style={styles.skipButton}
            onPress={handleSkip}
            hitSlop={10}
          >
            <Text style={styles.skipText}>
              Skip
            </Text>
          </Pressable>
        )}

      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
