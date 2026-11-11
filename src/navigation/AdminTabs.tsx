import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ManagerInventoryAlertModal from '../components/ManagerInventoryAlertModal';
import SuperAdminWelcomeModal from '../components/SuperAdminWelcomeModal';
import {useAuth} from '../context/AuthContext';
import AdminAdminsScreen from '../screens/admin/AdminAdmins';
import AdminBranchesScreen from '../screens/admin/AdminBranches';
import AdminOrdersScreen from '../screens/admin/AdminOrders';
import AdminProductsScreen from '../screens/admin/AdminProducts';
import AdminLiveSalesScreen from '../screens/admin/AdminLiveSales';
import AdminRevenueScreen from '../screens/admin/AdminRevenue';
import type {AdminTabParamList, RootStackParamList} from '../types/navigation';
import LiquidGlassTabBar from './LiquidGlassTabBar';

const Tab = createBottomTabNavigator<AdminTabParamList>();

const AdminTabs = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    isSuperAdmin,
    isManager,
    canViewRevenue,
    pendingSuperAdminWelcome,
    consumeSuperAdminWelcome,
    pendingInventoryLoginAlert,
    consumeInventoryLoginAlert,
    user,
  } = useAuth();
  const showRevenue = isSuperAdmin || canViewRevenue;

  const onReviewInventory = useCallback(() => {
    consumeInventoryLoginAlert();
    navigation.navigate('AdminInventoryRequests');
  }, [consumeInventoryLoginAlert, navigation]);

  const screens = useMemo(() => {
    const list: {
      name: keyof AdminTabParamList;
      component: React.ComponentType;
      label: string;
    }[] = [];

    if (showRevenue) {
      list.push({
        name: 'AdminRevenue',
        component: AdminRevenueScreen,
        label: isSuperAdmin ? 'Revenue' : 'Sales',
      });
      list.push({
        name: 'AdminLiveSales',
        component: AdminLiveSalesScreen,
        label: 'Live Sales',
      });
    }

    if (isSuperAdmin) {
      // Superadmin: Revenue · Live Sales · Branches · Staff · Menu
      list.push(
        {
          name: 'AdminBranches',
          component: AdminBranchesScreen,
          label: 'Branches',
        },
        {
          name: 'AdminAdmins',
          component: AdminAdminsScreen,
          label: 'Staff',
        },
        {
          name: 'AdminProducts',
          component: AdminProductsScreen,
          label: 'Menu',
        },
      );
    } else {
      // Manager: keep Orders for day-to-day ops
      list.push(
        {
          name: 'AdminOrders',
          component: AdminOrdersScreen,
          label: 'Orders',
        },
        {
          name: 'AdminAdmins',
          component: AdminAdminsScreen,
          label: 'Employees',
        },
        {
          name: 'AdminProducts',
          component: AdminProductsScreen,
          label: 'Menu',
        },
      );
    }

    return list;
  }, [isSuperAdmin, showRevenue]);

  const initialRouteName = showRevenue
    ? 'AdminRevenue'
    : isSuperAdmin
      ? 'AdminBranches'
      : 'AdminOrders';

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        initialRouteName={initialRouteName}
        tabBar={props => <LiquidGlassTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
        }}>
        {screens.map(screen => (
          <Tab.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{tabBarLabel: screen.label}}
          />
        ))}
      </Tab.Navigator>

      <SuperAdminWelcomeModal
        visible={isSuperAdmin && pendingSuperAdminWelcome}
        name={user?.name}
        onDone={consumeSuperAdminWelcome}
      />

      <ManagerInventoryAlertModal
        visible={isManager && pendingInventoryLoginAlert != null}
        alert={pendingInventoryLoginAlert}
        onReview={onReviewInventory}
        onDismiss={consumeInventoryLoginAlert}
      />
    </View>
  );
};

export default AdminTabs;
