import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../../types/navigation';
import {onboardingData} from './model';

type Nav = NativeStackNavigationProp<RootStackParamList, 'OnboardingOne'>;

const useController = () => {
  const navigation = useNavigation<Nav>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastScreen = currentIndex === onboardingData.length - 1;

  const handleNext = () => {
    if (!isLastScreen) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
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
