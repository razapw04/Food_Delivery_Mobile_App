import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from './src/screens/Splash/SplashScreen';
import OnboardingOneScreen from './src/screens/OnboardingOne/index';


export type RootStackParamList = {
  Splash: undefined;
  OnboardingOne : undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
  

      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="OnboardingOne" component={OnboardingOneScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
