import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AdminMenuButton from '../../../components/AdminMenuButton';
import {formatBranchHours} from '../../user/Branches/model';
import {styles} from './styles';
import useController from './useController';

const AdminBranchesScreen = () => {
  const {navigation, branches, loading, loadBranches, handleDelete} =
    useController();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <AdminMenuButton />
        <Text style={styles.headerTitle}>Manage Branches</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Add or edit branches for the whole app. Staff accounts and POS are
          assigned to these branches.
        </Text>
      </View>

      <FlatList
        data={branches}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={() => {
          void loadBranches();
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No branches yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first branch to assign managers, cashiers, and kitchen.
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.card}>
            <Image source={{uri: item.logo}} style={styles.logo} />
            <View style={styles.cardBody}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address} numberOfLines={2}>
                {item.address}
              </Text>
              <Text style={styles.hours}>
                {formatBranchHours(item.openFrom, item.openTo)}
              </Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                style={styles.iconButton}
                onPress={() =>
                  navigation.navigate('AdminBranchForm', {branchId: item.id})
                }>
                <Icon name="pencil" size={18} color="#1A1A1A" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={[styles.iconButton, styles.iconButtonDanger]}
                onPress={() => handleDelete(item)}>
                <Icon name="delete-outline" size={18} color="#C74440" />
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable
        accessibilityRole="button"
        style={styles.fab}
        onPress={() => navigation.navigate('AdminBranchForm', {})}>
        <Icon name="plus" size={22} color="#FFFFFF" />
        <Text style={styles.fabText}>Add branch</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default AdminBranchesScreen;
