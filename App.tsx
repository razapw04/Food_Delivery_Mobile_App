import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from './src/screens/Splash/SplashScreen';
import LoginScreen from './src/screens/Login';
import SignupScreen from './src/screens/Signup';
import OnboardingOneScreen from './src/screens/OnboardingOne/index';
import LocationAcess from './src/screens/LocationAccess/index';
import HomeScreen from './src/screens/Home';
import SearchScreen from './src/screens/Search';
import BranchesScreen from './src/screens/Branches';
import MenuScreen from './src/screens/Menu';
import type {RootStackParamList} from './src/types/navigation';

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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Branches" component={BranchesScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="OnboardingOne" component={OnboardingOneScreen} />
        <Stack.Screen name="LocationAccess" component={LocationAcess} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
