import {useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../types/navigation';
import {Branch, branches} from './model';

type BranchesNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Branches'
>;

const useController = () => {
  const navigation = useNavigation<BranchesNavigationProp>();
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
    navigation.goBack();
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
    setConfirmVisible(false);
    navigation.navigate('Home');
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredBranches,
    selectedBranch,
    confirmVisible,
    handleBack,
    handleBranchPress,
    handleCancelConfirm,
    handleProceed,
  };
};

export default useController;
