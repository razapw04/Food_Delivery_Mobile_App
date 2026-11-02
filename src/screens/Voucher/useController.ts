import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../types/navigation';

type VoucherNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Voucher'
>;

const useController = () => {
  const navigation = useNavigation<VoucherNavigationProp>();

  const handleBack = () => {
    navigation.goBack();
  };

  return {
    handleBack,
  };
};

export default useController;
