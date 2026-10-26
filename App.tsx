import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from './src/screens/Splash/SplashScreen';
import LoginScreen from './src/screens/Login';
import SignupScreen from './src/screens/Signup';
import OnboardingOneScreen from './src/screens/OnboardingOne/index';
import LocationAcess from './src/screens/LocationAccess/index';
import BranchesScreen from './src/screens/Branches';
import ChooseLocationScreen from './src/screens/ChooseLocation';
import AddAddressScreen from './src/screens/AddAddress';
import MainTabs from './src/navigation/MainTabs';
import {AuthProvider} from './src/context/AuthContext';
import {LocationProvider} from './src/context/LocationContext';
import {OrderProvider} from './src/context/OrderContext';
import type {RootStackParamList} from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <OrderProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Splash"
              screenOptions={{
                headerShown: false,
                contentStyle: {backgroundColor: '#FFFFFF'},
              }}>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="Branches" component={BranchesScreen} />
              <Stack.Screen name="ChooseLocation" component={ChooseLocationScreen} />
              <Stack.Screen name="AddAddress" component={AddAddressScreen} />
              <Stack.Screen name="OnboardingOne" component={OnboardingOneScreen} />
              <Stack.Screen name="LocationAccess" component={LocationAcess} />
            </Stack.Navigator>
          </NavigationContainer>
        </OrderProvider>
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;
