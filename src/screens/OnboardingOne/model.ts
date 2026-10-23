import { ImageSourcePropType } from 'react-native';

export interface OnboardingItem {
  image: ImageSourcePropType;
  title: string;
  description: string;
}

export const onboardingData: OnboardingItem[] = [
  {
    image: require('../../assets/images/Onboarding.png'),
    title: 'All your favourites',
    description:
      'Explore a wide variety of delicious meals and discover your favorite food from nearby restaurants.',
  },
  {
    image: require('../../assets/images/Onboarding.png'),
    title: 'All your favourites',
    description:
      'Order your favorite meals easily and enjoy a smooth and hassle-free ordering experience.',
  },
  {
    image: require('../../assets/images/Onboarding.png'),
    title: 'Order from choosen chef',
    description:
      'Get your food delivered quickly and conveniently right to your doorstep.',
  },
  {
    image: require('../../assets/images/Onboarding.png'),
    title: 'Free Delivery Offers',
    description:
      'Sit back, relax and enjoy delicious food delivered fresh to your doorstep.',
  },
];