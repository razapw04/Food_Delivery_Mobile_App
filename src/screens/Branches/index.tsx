import React, {useMemo} from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppMap, {type MapMarker} from '../../components/AppMap';
import {BranchListSkeleton} from '../../components/Skeleton';
import {OfflineBanner, StateMessage} from '../../components/StateMessage';
import {
  Branch,
  formatBranchHours,
  isBranchOpenNow,
} from './model';
import {styles} from './styles';
import useController from './useController';

const BranchItem = ({
  branch,
  onPress,
}: {
  branch: Branch;
  onPress: () => void;
}) => {
  const isOpen = isBranchOpenNow(branch.openFrom, branch.openTo);

  return (
    <Pressable style={styles.branchCard} onPress={onPress}>
      <Image
        source={{uri: branch.logo}}
        style={styles.branchLogo}
        resizeMode="cover"
      />

      <View style={styles.branchBody}>
        <Text style={styles.branchName}>{branch.name}</Text>
        <Text style={styles.branchAddress}>{branch.address}</Text>
        <Text style={styles.branchHours}>
          {formatBranchHours(branch.openFrom, branch.openTo)}
        </Text>

        <View style={styles.branchMetaRow}>
          {isOpen ? (
            <Text style={styles.openNow}>Open now</Text>
          ) : (
            <Text style={styles.closedNow}>Closed</Text>
          )}
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.distanceText}>{branch.distanceKm} km away</Text>
        </View>
      </View>

      <Icon name="chevron-right" size={24} color="#6B7280" />
    </Pressable>
  );
};

const ConfirmBranchModal = ({
  visible,
  branch,
  onCancel,
  onProceed,
}: {
  visible: boolean;
  branch: Branch | null;
  onCancel: () => void;
  onProceed: () => void;
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onCancel}>
    <View style={styles.confirmOverlay}>
      <View style={styles.confirmCard}>
        <Text style={styles.confirmTitle}>Confirm branch selection</Text>
        <Text style={styles.confirmLabel}>You have selected</Text>

        {branch ? (
          <View style={styles.selectedBranchBox}>
            <Text style={styles.selectedBranchName}>{branch.name}</Text>
            <Text style={styles.selectedBranchAddress}>{branch.address}</Text>
          </View>
        ) : null}

        <Text style={styles.confirmQuestion}>
          Would you like to continue with this branch?
        </Text>

        <View style={styles.confirmActions}>
          <Pressable style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.proceedButton} onPress={onProceed}>
            <Text style={styles.proceedButtonText}>Proceed</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

const BranchesScreen = () => {
  const {
    searchQuery,
    setSearchQuery,
    filteredBranches,
    selectedBranch,
    confirmVisible,
    isLoading,
    isUsingFallback,
    refreshCatalog,
    handleBack,
    handleBranchPress,
    handleCancelConfirm,
    handleProceed,
  } = useController();

  const mapMarkers = useMemo<MapMarker[]>(
    () =>
      filteredBranches.map(branch => ({
        id: branch.id,
        latitude: branch.latitude,
        longitude: branch.longitude,
        title: branch.name,
        color: selectedBranch?.id === branch.id ? '#C74440' : '#FF7622',
      })),
    [filteredBranches, selectedBranch?.id],
  );

  const mapCenter = useMemo(() => {
    if (selectedBranch) {
      return {
        latitude: selectedBranch.latitude,
        longitude: selectedBranch.longitude,
      };
    }
    if (filteredBranches[0]) {
      return {
        latitude: filteredBranches[0].latitude,
        longitude: filteredBranches[0].longitude,
      };
    }
    return {latitude: 31.5204, longitude: 74.3587};
  }, [filteredBranches, selectedBranch]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleBack}>
          <Icon name="arrow-left" size={22} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>Branches</Text>
      </View>

      {isUsingFallback ? (
        <OfflineBanner
          message="Couldn't load branches from server. Showing saved list."
          onRetry={refreshCatalog}
        />
      ) : null}

      <View style={styles.mapContainer}>
        <AppMap
          style={styles.mapImage}
          center={mapCenter}
          zoom={12}
          markers={mapMarkers}
          onMarkerPress={id => {
            const branch = filteredBranches.find(item => item.id === id);
            if (branch) {
              handleBranchPress(branch);
            }
          }}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={22} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by branch"
            placeholderTextColor="#9A9F9B"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Text style={styles.sectionTitle}>All branches</Text>

        {isLoading ? (
          <BranchListSkeleton />
        ) : (
          <FlatList
            data={filteredBranches}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <StateMessage
                icon="storefront-outline"
                title="No branches found"
                subtitle="Try another search or pull the latest list from the server."
                actionLabel="Retry"
                onAction={refreshCatalog}
              />
            }
            renderItem={({item}) => (
              <BranchItem
                branch={item}
                onPress={() => handleBranchPress(item)}
              />
            )}
          />
        )}
      </View>

      <ConfirmBranchModal
        visible={confirmVisible}
        branch={selectedBranch}
        onCancel={handleCancelConfirm}
        onProceed={handleProceed}
      />
    </SafeAreaView>
  );
};

export default BranchesScreen;
