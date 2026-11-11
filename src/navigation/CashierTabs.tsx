import React, {useCallback} from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ManagerInventoryAlertModal from '../components/ManagerInventoryAlertModal';
import {useAuth} from '../context/AuthContext';
import CashierInventoryScreen from '../screens/cashier/CashierInventory';
import CashierOrdersScreen from '../screens/cashier/CashierOrders';
import CashierOrderHistoryScreen from '../screens/cashier/CashierOrderHistory';
import CashierPOSScreen from '../screens/cashier/CashierPOS';
import CashierSalesScreen from '../screens/cashier/CashierSales';
import type {CashierTabParamList, RootStackParamList} from '../types/navigation';
import LiquidGlassTabBar from './LiquidGlassTabBar';

const Tab = createBottomTabNavigator<CashierTabParamList>();

const CashierTabs = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    isCashier,
    pendingCashierInventoryAlert,
    consumeCashierInventoryAlert,
  } = useAuth();

  const onReviewInventory = useCallback(() => {
    consumeCashierInventoryAlert();
    navigation.navigate('CashierTabs', {screen: 'CashierInventory'});
  }, [consumeCashierInventoryAlert, navigation]);

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        tabBar={props => <LiquidGlassTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
        }}>
        <Tab.Screen
          name="CashierOrders"
          component={CashierOrdersScreen}
          options={{tabBarLabel: 'Orders'}}
        />
        <Tab.Screen
          name="CashierPOS"
          component={CashierPOSScreen}
          options={{tabBarLabel: 'POS'}}
        />
        <Tab.Screen
          name="CashierOrderHistory"
          component={CashierOrderHistoryScreen}
          options={{tabBarLabel: 'History'}}
        />
        <Tab.Screen
          name="CashierSales"
          component={CashierSalesScreen}
          options={{tabBarLabel: 'Sales'}}
        />
        <Tab.Screen
          name="CashierInventory"
          component={CashierInventoryScreen}
          options={{tabBarLabel: 'Inventory'}}
        />
      </Tab.Navigator>

      <ManagerInventoryAlertModal
        visible={isCashier && pendingCashierInventoryAlert != null}
        alert={pendingCashierInventoryAlert}
        badgeLabel="Cash arrange"
        titleWhenOne="Arrange inventory with cash"
        reviewLabel="Open"
        onReview={onReviewInventory}
        onDismiss={consumeCashierInventoryAlert}
      />
    </View>
  );
};

export default CashierTabs;
