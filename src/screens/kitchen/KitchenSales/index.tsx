import React, {useCallback} from 'react';
import {Alert, Pressable, ScrollView, StatusBar, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import BranchProductSalesLists from '../../../components/BranchProductSalesLists';
import {useAuth} from '../../../context/AuthContext';
import type {RootStackParamList} from '../../../types/navigation';
import {styles} from './styles';
import useController from './useController';

const KitchenSalesScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {logout} = useAuth();
  const {productSales, branchId} = useController();

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Do you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              await logout();
            } catch {
              // ignore
            } finally {
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            }
          })();
        },
      },
    ]);
  }, [logout, navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Text style={styles.headerTitle}>Most selling</Text>
        <Pressable
          accessibilityLabel="Logout"
          accessibilityRole="button"
          style={styles.logoutButton}
          onPress={handleLogout}>
          <Icon name="logout" size={22} color="#C74440" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {branchId ? (
          <>
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                Most, hot, and least selling products for your kitchen branch.
              </Text>
            </View>
            <BranchProductSalesLists
              most={productSales.most}
              hot={productSales.hot}
              least={productSales.least}
              meta="Your branch"
              emptyText="No countable sales yet for this branch."
            />
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No branch assigned</Text>
            <Text style={styles.emptySubtitle}>
              Ask super admin to assign this kitchen account to a branch.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default KitchenSalesScreen;
