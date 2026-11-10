import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useLocation} from '../../../context/LocationContext';
import type {RootStackParamList} from '../../../types/navigation';

type SavedAddressesNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SavedAddresses'
>;

const useController = () => {
  const navigation = useNavigation<SavedAddressesNavigationProp>();
  const {savedAddresses, selectedAddress, deliveryAddress, selectAddress} =
    useLocation();

  const goBack = () => {
    navigation.goBack();
  };

  const goToAddAddress = () => {
    navigation.navigate('AddAddress');
  };

  const handleSelect = (address: string) => {
    selectAddress(address);
  };

  const handleEdit = (address: string) => {
    selectAddress(address);
    navigation.navigate('AddAddress');
  };

  const isAddressSelected = (address: string) =>
    selectedAddress === address || deliveryAddress === address;

  return {
    savedAddresses,
    goBack,
    goToAddAddress,
    handleSelect,
    handleEdit,
    isAddressSelected,
  };
};

export default useController;
