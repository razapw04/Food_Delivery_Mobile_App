import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import KitchenOrdersScreen from '../screens/kitchen/KitchenOrders';
import KitchenHistoryScreen from '../screens/kitchen/KitchenHistory';
import KitchenSalesScreen from '../screens/kitchen/KitchenSales';
import KitchenInventoryScreen from '../screens/kitchen/KitchenInventory';
import type {KitchenTabParamList} from '../types/navigation';
import LiquidGlassTabBar from './LiquidGlassTabBar';

const Tab = createBottomTabNavigator<KitchenTabParamList>();

const KitchenTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="KitchenOrders"
      tabBar={props => <LiquidGlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
      }}>
      <Tab.Screen
        name="KitchenOrders"
        component={KitchenOrdersScreen}
        options={{tabBarLabel: 'Active queue'}}
      />
      <Tab.Screen
        name="KitchenHistory"
        component={KitchenHistoryScreen}
        options={{tabBarLabel: 'History'}}
      />
      <Tab.Screen
        name="KitchenSales"
        component={KitchenSalesScreen}
        options={{tabBarLabel: 'Most selling'}}
      />
      <Tab.Screen
        name="KitchenInventory"
        component={KitchenInventoryScreen}
        options={{tabBarLabel: 'Inventory'}}
      />
    </Tab.Navigator>
  );
};

export default KitchenTabs;
