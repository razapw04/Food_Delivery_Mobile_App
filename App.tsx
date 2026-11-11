import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {QueryClientProvider} from '@tanstack/react-query';

import SplashScreen from './src/screens/user/Splash/SplashScreen';
import LoginScreen from './src/screens/user/Login';
import SignupScreen from './src/screens/user/Signup';
import ForgotPasswordScreen from './src/screens/user/ForgotPassword';
import OnboardingOneScreen from './src/screens/user/OnboardingOne/index';
import LocationAcess from './src/screens/user/LocationAccess/index';
import BranchesScreen from './src/screens/user/Branches';
import ChooseLocationScreen from './src/screens/user/ChooseLocation';
import AddAddressScreen from './src/screens/user/AddAddress';
import ProductDetailScreen from './src/screens/user/ProductDetail';
import CartScreen from './src/screens/user/Cart';
import PlaceOrderScreen from './src/screens/user/PlaceOrder';
import CardPaymentScreen from './src/screens/user/CardPayment';
import VoucherScreen from './src/screens/user/Voucher';
import FavoritesScreen from './src/screens/user/Favorites';
import SavedAddressesScreen from './src/screens/user/SavedAddresses';
import NotificationsScreen from './src/screens/user/Notifications';
import ProfileScreen from './src/screens/user/Profile';
import FeedbackScreen from './src/screens/user/Feedback';
import ContactUsScreen from './src/screens/user/ContactUs';
import AdminProductFormScreen from './src/screens/admin/AdminProductForm';
import AdminAdminFormScreen from './src/screens/admin/AdminAdminForm';
import AdminOrdersScreen from './src/screens/admin/AdminOrders';
import AdminBranchFormScreen from './src/screens/admin/AdminBranchForm';
import AdminBranchMapPickScreen from './src/screens/admin/AdminBranchMapPick';
import AdminPriceApprovalsScreen from './src/screens/admin/AdminPriceApprovals';
import AdminPriceRequestScreen from './src/screens/admin/AdminPriceRequest';
import AdminTopSellingScreen from './src/screens/admin/AdminTopSelling';
import AdminInventoryRequestsScreen from './src/screens/admin/AdminInventoryRequests';
import MenuScreen from './src/screens/user/Menu';
import MainTabs from './src/navigation/MainTabs';
import AdminTabs from './src/navigation/AdminTabs';
import CashierTabs from './src/navigation/CashierTabs';
import KitchenTabs from './src/navigation/KitchenTabs';
import {navigationRef} from './src/navigation/navigationRef';
import {AuthProvider} from './src/context/AuthContext';
import {CartProvider} from './src/context/CartContext';
import {CatalogProvider} from './src/context/CatalogContext';
import {FavoritesProvider} from './src/context/FavoritesContext';
import {LocationProvider} from './src/context/LocationContext';
import {NotificationsProvider} from './src/context/NotificationsContext';
import {OrderProvider} from './src/context/OrderContext';
import PushNotificationsBootstrap from './src/components/PushNotificationsBootstrap';
import {queryClient} from './src/lib/queryClient';
import type {RootStackParamList} from './src/types/navigation';
import {colors} from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CatalogProvider>
          <LocationProvider>
            <OrderProvider>
              <CartProvider>
                <FavoritesProvider>
                  <NotificationsProvider>
                    <PushNotificationsBootstrap />
                    <NavigationContainer ref={navigationRef}>
                      <Stack.Navigator
                        initialRouteName="Splash"
                        screenOptions={{
                          headerShown: false,
                          contentStyle: {backgroundColor: colors.background},
                        }}>
                        <Stack.Screen name="Splash" component={SplashScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                        <Stack.Screen
                          name="ForgotPassword"
                          component={ForgotPasswordScreen}
                        />
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                        <Stack.Screen name="Branches" component={BranchesScreen} />
                        <Stack.Screen
                          name="ChooseLocation"
                          component={ChooseLocationScreen}
                        />
                        <Stack.Screen name="AddAddress" component={AddAddressScreen} />
                        <Stack.Screen name="Menu" component={MenuScreen} />
                        <Stack.Screen
                          name="ProductDetail"
                          component={ProductDetailScreen}
                        />
                        <Stack.Screen name="Cart" component={CartScreen} />
                        <Stack.Screen
                          name="PlaceOrder"
                          component={PlaceOrderScreen}
                        />
                        <Stack.Screen
                          name="CardPayment"
                          component={CardPaymentScreen}
                        />
                        <Stack.Screen name="Voucher" component={VoucherScreen} />
                        <Stack.Screen
                          name="Favorites"
                          component={FavoritesScreen}
                        />
                        <Stack.Screen
                          name="SavedAddresses"
                          component={SavedAddressesScreen}
                        />
                        <Stack.Screen
                          name="Notifications"
                          component={NotificationsScreen}
                        />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen
                          name="Feedback"
                          component={FeedbackScreen}
                        />
                        <Stack.Screen
                          name="ContactUs"
                          component={ContactUsScreen}
                        />
                        <Stack.Screen name="AdminTabs" component={AdminTabs} />
                        <Stack.Screen
                          name="AdminProductForm"
                          component={AdminProductFormScreen}
                        />
                        <Stack.Screen
                          name="AdminAdminForm"
                          component={AdminAdminFormScreen}
                        />
                        <Stack.Screen
                          name="AdminOrders"
                          component={AdminOrdersScreen}
                        />
                        <Stack.Screen
                          name="AdminBranchForm"
                          component={AdminBranchFormScreen}
                        />
                        <Stack.Screen
                          name="AdminBranchMapPick"
                          component={AdminBranchMapPickScreen}
                        />
                        <Stack.Screen
                          name="AdminPriceApprovals"
                          component={AdminPriceApprovalsScreen}
                        />
                        <Stack.Screen
                          name="AdminPriceRequest"
                          component={AdminPriceRequestScreen}
                        />
                        <Stack.Screen
                          name="AdminTopSelling"
                          component={AdminTopSellingScreen}
                        />
                        <Stack.Screen
                          name="AdminInventoryRequests"
                          component={AdminInventoryRequestsScreen}
                        />
                        <Stack.Screen
                          name="CashierTabs"
                          component={CashierTabs}
                        />
                        <Stack.Screen
                          name="KitchenTabs"
                          component={KitchenTabs}
                        />
                        <Stack.Screen
                          name="OnboardingOne"
                          component={OnboardingOneScreen}
                        />
                        <Stack.Screen
                          name="LocationAccess"
                          component={LocationAcess}
                        />
                      </Stack.Navigator>
                    </NavigationContainer>
                  </NotificationsProvider>
                </FavoritesProvider>
              </CartProvider>
            </OrderProvider>
          </LocationProvider>
        </CatalogProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
