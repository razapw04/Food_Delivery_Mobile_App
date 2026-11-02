import React from 'react';
import {FlatList, Pressable, StatusBar, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme';
import {useLocation, type SavedAddress} from '../../context/LocationContext';
import type {RootStackParamList} from '../../types/navigation';
import {styles} from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SavedAddresses'>;

const AddressRow = ({
  item,
  selected,
  onSelect,
  onEdit,
}: {
  item: SavedAddress;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}) => (
  <View style={styles.row}>
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{selected}}
      accessibilityLabel={`Select ${item.address}`}
      onPress={onSelect}
      style={styles.radio}
      hitSlop={8}>
      <Icon
        name={selected ? 'radiobox-marked' : 'radiobox-blank'}
        size={22}
        color={selected ? colors.primary : '#9CA3AF'}
      />
    </Pressable>
    <Pressable
      accessibilityRole="button"
      onPress={onSelect}
      style={styles.addressPress}>
      <Text style={styles.addressTitle}>{item.address}</Text>
      <Text style={styles.addressDescription}>{item.address}</Text>
    </Pressable>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Edit ${item.address}`}
      onPress={onEdit}
      style={styles.editButton}
      hitSlop={8}>
      <Icon name="pencil" size={14} color="#FFFFFF" />
    </Pressable>
  </View>
);

const EmptyAddresses = () => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyIconWrap}>
      <Icon name="map-marker-outline" size={32} color="#9CA3AF" />
    </View>
    <Text style={styles.emptyTitle}>No saved addresses</Text>
    <Text style={styles.emptySubtitle}>
      Addresses from your delivery orders will appear here.
    </Text>
  </View>
);

const SavedAddressesScreen = () => {
  const navigation = useNavigation<Nav>();
  const {savedAddresses, selectedAddress, deliveryAddress, selectAddress} =
    useLocation();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#202321" />
        </Pressable>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
      </View>

      <FlatList
        data={savedAddresses}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyAddresses />}
        ListFooterComponent={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add new address"
            onPress={() => navigation.navigate('AddAddress')}
            style={styles.addAddressLink}>
            <Text style={styles.addAddressLinkText}>+ Add new address</Text>
          </Pressable>
        }
        renderItem={({item}) => {
          const selected =
            selectedAddress === item.address ||
            deliveryAddress === item.address;

          return (
            <AddressRow
              item={item}
              selected={selected}
              onSelect={() => selectAddress(item.address)}
              onEdit={() => {
                selectAddress(item.address);
                navigation.navigate('AddAddress');
              }}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default SavedAddressesScreen;
