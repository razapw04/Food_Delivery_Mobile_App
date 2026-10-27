import {useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useOrder} from '../../context/OrderContext';
import type {RootStackParamList} from '../../types/navigation';
import {Branch, branches} from './model';

type BranchesNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Branches'
>;

const useController = () => {
  const navigation = useNavigation<BranchesNavigationProp>();
  const {selectedBranch: savedBranch, selectBranch} = useOrder();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const filteredBranches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return branches;
    }

    return branches.filter(
      branch =>
        branch.name.toLowerCase().includes(query) ||
        branch.address.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Home' as never);
  };

  const handleBranchPress = (branch: Branch) => {
    setSelectedBranch(branch);
    setConfirmVisible(true);
  };

  const handleCancelConfirm = () => {
    setConfirmVisible(false);
    setSelectedBranch(null);
  };

  const handleProceed = () => {
    if (selectedBranch) {
      selectBranch(selectedBranch);
    }
    setConfirmVisible(false);
    navigation.navigate('MainTabs', {screen: 'Home'});
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredBranches,
    selectedBranch,
    savedBranch,
    confirmVisible,
    handleBack,
    handleBranchPress,
    handleCancelConfirm,
    handleProceed,
  };
};

export default useController;
