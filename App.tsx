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
import ProductDetailScreen from './src/screens/ProductDetail';
import CartScreen from './src/screens/Cart';
import MenuScreen from './src/screens/Menu';
import MainTabs from './src/navigation/MainTabs';
import {AuthProvider} from './src/context/AuthContext';
import {CartProvider} from './src/context/CartContext';
import {LocationProvider} from './src/context/LocationContext';
import {OrderProvider} from './src/context/OrderContext';
import type {RootStackParamList} from './src/types/navigation';
import {colors} from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <OrderProvider>
          <CartProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                  headerShown: false,
                  contentStyle: {backgroundColor: colors.background},
                }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen name="Branches" component={BranchesScreen} />
                <Stack.Screen name="ChooseLocation" component={ChooseLocationScreen} />
                <Stack.Screen name="AddAddress" component={AddAddressScreen} />
                <Stack.Screen name="Menu" component={MenuScreen} />
                <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                <Stack.Screen name="Cart" component={CartScreen} />
                <Stack.Screen name="OnboardingOne" component={OnboardingOneScreen} />
                <Stack.Screen name="LocationAccess" component={LocationAcess} />
              </Stack.Navigator>
            </NavigationContainer>
          </CartProvider>
        </OrderProvider>
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;
