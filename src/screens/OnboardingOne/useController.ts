import { useState } from 'react';
import { onboardingData } from './model';

const useController = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastScreen = currentIndex === onboardingData.length - 1;

  const handleNext = () => {
    if (!isLastScreen) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      return;
    }

    // TODO: Navigate to Login screen
    console.log('Onboarding completed');
  };

  const handleSkip = () => {
    setCurrentIndex(onboardingData.length - 1);
  };

  return {
    currentIndex,
    currentItem: onboardingData[currentIndex],
    isLastScreen,
    handleNext,
    handleSkip,
  };
};

export default useController;