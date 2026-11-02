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
import PlaceOrderScreen from './src/screens/PlaceOrder';
import VoucherScreen from './src/screens/Voucher';
import FavoritesScreen from './src/screens/Favorites';
import SavedAddressesScreen from './src/screens/SavedAddresses';
import NotificationsScreen from './src/screens/Notifications';
import MenuScreen from './src/screens/Menu';
import MainTabs from './src/navigation/MainTabs';
import {AuthProvider} from './src/context/AuthContext';
import {CartProvider} from './src/context/CartContext';
import {FavoritesProvider} from './src/context/FavoritesContext';
import {LocationProvider} from './src/context/LocationContext';
import {NotificationsProvider} from './src/context/NotificationsContext';
import {OrderProvider} from './src/context/OrderContext';
import PushNotificationsBootstrap from './src/components/PushNotificationsBootstrap';
import type {RootStackParamList} from './src/types/navigation';
import {colors} from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <OrderProvider>
          <CartProvider>
            <FavoritesProvider>
              <NotificationsProvider>
                <PushNotificationsBootstrap />
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
                    <Stack.Screen name="PlaceOrder" component={PlaceOrderScreen} />
                    <Stack.Screen name="Voucher" component={VoucherScreen} />
                    <Stack.Screen name="Favorites" component={FavoritesScreen} />
                    <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
                    <Stack.Screen name="Notifications" component={NotificationsScreen} />
                    <Stack.Screen name="OnboardingOne" component={OnboardingOneScreen} />
                    <Stack.Screen name="LocationAccess" component={LocationAcess} />
                  </Stack.Navigator>
                </NavigationContainer>
              </NotificationsProvider>
            </FavoritesProvider>
          </CartProvider>
        </OrderProvider>
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;
