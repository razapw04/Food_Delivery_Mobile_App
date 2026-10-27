import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import SearchScreen from '../screens/Search';
import BranchesScreen from '../screens/Branches';
import OrderHistoryScreen from '../screens/OrderHistory';
import type {MainTabParamList} from '../types/navigation';
import LiquidGlassTabBar from './LiquidGlassTabBar';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <LiquidGlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarLabel: 'Home'}}
      />
      <Tab.Screen
        name="Explore"
        component={SearchScreen}
        options={{tabBarLabel: 'Explore'}}
      />
      <Tab.Screen
        name="Branches"
        component={BranchesScreen}
        options={{tabBarLabel: 'Branches'}}
      />
      <Tab.Screen
        name="Orders"
        component={OrderHistoryScreen}
        options={{tabBarLabel: 'Orders'}}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
