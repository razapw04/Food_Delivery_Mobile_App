import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {RootStackParamList} from '../../../types/navigation';
import {styles} from './styles';
import useController from './useController';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminBranchForm'>;

const FieldError = ({message}: {message?: string}) =>
  message ? <Text style={styles.errorText}>{message}</Text> : null;

const SectionHeader = ({
  icon,
  title,
  meta,
}: {
  icon: string;
  title: string;
  meta: string;
}) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionIconWrap}>
      <Icon name={icon} size={18} color="#FF7622" />
    </View>
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionMeta}>{meta}</Text>
    </View>
  </View>
);

const AdminBranchFormScreen = ({route}: Props) => {
  const {
    isEditing,
    name,
    setName,
    address,
    setAddress,
    openFrom,
    openTo,
    locationLabel,
    locationConfirmed,
    mapCenter,
    logo,
    hasCustomLogo,
    handlePickImage,
    handleClearImage,
    openMapPicker,
    openTimePicker,
    closeTimePicker,
    onDraftTimeChange,
    confirmTimePicker,
    onAndroidTimePicked,
    activeTimeField,
    draftTime,
    errors,
    saving,
    canSave,
    handleSave,
    handleBack,
  } = useController(route);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
          onPress={handleBack}>
          <Icon name="arrow-left" size={22} color="#1A1A1A" />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit branch' : 'Add branch'}
        </Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>
              {isEditing ? 'Update branch details' : 'Create a new branch'}
            </Text>
            <Text style={styles.introText}>
              Add name, hours, photo, and confirm the map location so staff and
              customers can use this branch.
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <SectionHeader
              icon="storefront-outline"
              title="Basic info"
              meta="Name and address"
            />
            <Text style={styles.label}>Branch name</Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={name}
              onChangeText={setName}
              placeholder="Gulberg Branch"
              placeholderTextColor="#9CA3AF"
            />
            <FieldError message={errors.name} />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, errors.address ? styles.inputError : null]}
              value={address}
              onChangeText={setAddress}
              placeholder="Street, area, city"
              placeholderTextColor="#9CA3AF"
            />
            <FieldError message={errors.address} />
          </View>

          <View style={styles.sectionCard}>
            <SectionHeader
              icon="clock-outline"
              title="Opening hours"
              meta="Tap to pick time"
            />
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Open from</Text>
                <Pressable
                  accessibilityRole="button"
                  style={[
                    styles.pickerField,
                    errors.openFrom ? styles.inputError : null,
                  ]}
                  onPress={() => openTimePicker('openFrom')}>
                  <View style={styles.pickerFieldLeft}>
                    <Icon name="clock-outline" size={18} color="#6B7280" />
                    <Text style={styles.pickerFieldText}>{openFrom}</Text>
                  </View>
                  <Icon name="chevron-down" size={18} color="#9CA3AF" />
                </Pressable>
                <FieldError message={errors.openFrom} />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Open to</Text>
                <Pressable
                  accessibilityRole="button"
                  style={[
                    styles.pickerField,
                    errors.openTo ? styles.inputError : null,
                  ]}
                  onPress={() => openTimePicker('openTo')}>
                  <View style={styles.pickerFieldLeft}>
                    <Icon name="clock-outline" size={18} color="#6B7280" />
                    <Text style={styles.pickerFieldText}>{openTo}</Text>
                  </View>
                  <Icon name="chevron-down" size={18} color="#9CA3AF" />
                </Pressable>
                <FieldError message={errors.openTo} />
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <SectionHeader
              icon="image-outline"
              title="Branch photo"
              meta="Camera or gallery"
            />
            <View style={styles.imageCard}>
              <Image source={{uri: logo}} style={styles.previewImage} />
              <View style={styles.imageActions}>
                <Pressable
                  accessibilityRole="button"
                  style={styles.imageButton}
                  onPress={handlePickImage}>
                  <Icon name="camera-plus-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.imageButtonText}>Upload photo</Text>
                </Pressable>
                {hasCustomLogo ? (
                  <Pressable
                    accessibilityRole="button"
                    style={styles.imageClearButton}
                    onPress={handleClearImage}>
                    <Icon name="close" size={16} color="#6B7280" />
                    <Text style={styles.imageClearText}>Reset to default</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <SectionHeader
              icon="map-marker-radius-outline"
              title="Map location"
              meta="Search and confirm pin"
            />
            <Pressable
              accessibilityRole="button"
              style={[
                styles.locationCard,
                locationConfirmed ? styles.locationCardReady : null,
                errors.location ? styles.inputError : null,
              ]}
              onPress={openMapPicker}>
              <View style={styles.locationIconWrap}>
                <Icon
                  name={locationConfirmed ? 'check-circle' : 'map-marker-radius'}
                  size={22}
                  color={locationConfirmed ? '#16A34A' : '#FF7622'}
                />
              </View>
              <View style={styles.locationTextWrap}>
                <Text style={styles.locationTitle}>
                  {locationConfirmed ? 'Location confirmed' : 'Open map picker'}
                </Text>
                <Text style={styles.locationSubtitle} numberOfLines={2}>
                  {locationLabel ||
                    `${mapCenter.latitude.toFixed(4)}, ${mapCenter.longitude.toFixed(4)}`}
                </Text>
                {locationConfirmed ? (
                  <Text style={styles.locationReadyText}>Ready to save</Text>
                ) : null}
              </View>
              <Icon name="chevron-right" size={22} color="#9CA3AF" />
            </Pressable>
            <FieldError message={errors.location} />
          </View>

          <Pressable
            accessibilityRole="button"
            style={[
              styles.saveButton,
              (!canSave || saving) && styles.saveButtonDisabled,
            ]}
            disabled={saving}
            onPress={() => {
              void handleSave();
            }}>
            <Icon name="check" size={18} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {saving
                ? 'Saving...'
                : isEditing
                  ? 'Update branch'
                  : 'Add branch'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {Platform.OS === 'android' && activeTimeField ? (
        <DateTimePicker
          value={draftTime}
          mode="time"
          is24Hour
          display="default"
          onChange={(_event, date) => onAndroidTimePicked(date)}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          visible={Boolean(activeTimeField)}
          transparent
          animationType="slide"
          onRequestClose={closeTimePicker}>
          <Pressable style={styles.timeModalBackdrop} onPress={closeTimePicker}>
            <Pressable
              style={styles.timeModalSheet}
              onPress={event => event.stopPropagation()}>
              <View style={styles.timeModalHeader}>
                <Text style={styles.timeModalTitle}>
                  {activeTimeField === 'openTo' ? 'Open to' : 'Open from'}
                </Text>
                <Pressable onPress={confirmTimePicker}>
                  <Text style={styles.timeModalDone}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={draftTime}
                mode="time"
                is24Hour
                display="spinner"
                onChange={(_event, date) => onDraftTimeChange(date)}
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
};

export default AdminBranchFormScreen;
