import React, {useEffect, useState} from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../theme';
import {styles} from './styles';

export type FilterPreset = 'today' | 'week' | 'month' | 'year';

type Props = {
  visible: boolean;
  onClose: () => void;
  activePreset: FilterPreset | 'custom';
  customLabel: string;
  customStartDate: Date;
  customEndDate: Date;
  showYearOption?: boolean;
  onSelectPreset: (preset: FilterPreset) => void;
  onApplyCustomRange: (start: Date, end: Date) => void;
};

const PRESETS: {key: FilterPreset; label: string; hint: string}[] = [
  {key: 'today', label: 'Today', hint: 'Sales from midnight until now'},
  {key: 'week', label: 'This week', hint: 'Monday to today'},
  {key: 'month', label: 'This month', hint: 'From the 1st until now'},
  {key: 'year', label: 'This year', hint: 'From January 1 until now'},
];

const formatInputDate = (date: Date) =>
  date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const RevenueFilterModal = ({
  visible,
  onClose,
  activePreset,
  customLabel,
  customStartDate,
  customEndDate,
  showYearOption = false,
  onSelectPreset,
  onApplyCustomRange,
}: Props) => {
  const presets = showYearOption
    ? PRESETS
    : PRESETS.filter(item => item.key !== 'year');
  const [showCustom, setShowCustom] = useState(false);
  const [draftStart, setDraftStart] = useState(customStartDate);
  const [draftEnd, setDraftEnd] = useState(customEndDate);
  const [picking, setPicking] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    if (!visible) {
      setShowCustom(false);
      setPicking(null);
      return;
    }
    setDraftStart(customStartDate);
    setDraftEnd(customEndDate);
    if (activePreset === 'custom') {
      setShowCustom(true);
    }
  }, [activePreset, customEndDate, customStartDate, visible]);

  const resetAndClose = () => {
    setShowCustom(false);
    setPicking(null);
    onClose();
  };

  const onPickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setPicking(null);
      if (event.type !== 'set' || !date) {
        return;
      }
    }
    if (!date || !picking) {
      return;
    }
    if (picking === 'start') {
      setDraftStart(date);
      if (date.getTime() > draftEnd.getTime()) {
        setDraftEnd(date);
      }
    } else {
      setDraftEnd(date);
      if (date.getTime() < draftStart.getTime()) {
        setDraftStart(date);
      }
    }
    if (Platform.OS === 'ios') {
      // keep picker open until user taps another field / apply
    }
  };

  const applyCustom = () => {
    onApplyCustomRange(draftStart, draftEnd);
    resetAndClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={resetAndClose}>
        <Pressable style={styles.branchModalBackdrop} onPress={resetAndClose}>
          <Pressable
            style={styles.branchModalSheet}
            onPress={event => event.stopPropagation()}>
            <View style={styles.branchModalHeader}>
              <View style={styles.filterHeaderLeft}>
                {showCustom ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Back"
                    style={styles.filterHeaderIconBtn}
                    onPress={() => {
                      setShowCustom(false);
                      setPicking(null);
                    }}
                    hitSlop={8}>
                    <Icon name="arrow-left" size={22} color="#1A1A1A" />
                  </Pressable>
                ) : null}
                <Text style={styles.branchModalTitle}>
                  {showCustom ? 'Custom filter' : 'Select period'}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={resetAndClose}
                hitSlop={8}>
                <Icon name="close" size={22} color="#1A1A1A" />
              </Pressable>
            </View>

            {!showCustom ? (
              <ScrollView
                style={styles.branchModalList}
                showsVerticalScrollIndicator={false}>
                <View style={styles.filterIconRow}>
                  <Text style={styles.filterRowHeading}>Filter</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Open custom filter"
                    style={styles.filterIconButton}
                    onPress={() => setShowCustom(true)}>
                    <Icon
                      name="filter-variant"
                      size={16}
                      color={colors.primary}
                    />
                  </Pressable>
                </View>

                {presets.map(item => {
                  const active = activePreset === item.key;
                  return (
                    <Pressable
                      key={item.key}
                      accessibilityRole="button"
                      style={[
                        styles.branchModalOption,
                        active && styles.branchModalOptionActive,
                      ]}
                      onPress={() => {
                        onSelectPreset(item.key);
                        resetAndClose();
                      }}>
                      <View style={styles.filterOptionCopy}>
                        <Text
                          style={[
                            styles.branchModalOptionText,
                            active && styles.branchModalOptionTextActive,
                          ]}>
                          {item.label}
                        </Text>
                        <Text style={styles.filterOptionHint}>{item.hint}</Text>
                      </View>
                      {active ? (
                        <Icon name="check" size={18} color={colors.primary} />
                      ) : null}
                    </Pressable>
                  );
                })}

                {activePreset === 'custom' ? (
                  <View style={styles.periodCustomHint}>
                    <Icon
                      name="filter-check"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.periodCustomHintText}>
                      Custom · {customLabel}
                    </Text>
                  </View>
                ) : null}
              </ScrollView>
            ) : (
              <ScrollView
                style={styles.branchModalList}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <Text style={styles.filterPanelHint}>
                  Select a start date and end date from the calendar.
                </Text>

                <Text style={styles.dateFieldLabel}>Start date</Text>
                <Pressable
                  accessibilityRole="button"
                  style={[
                    styles.dateFieldInput,
                    picking === 'start' && styles.dateFieldInputActive,
                  ]}
                  onPress={() => setPicking('start')}>
                  <Icon
                    name="calendar-start"
                    size={18}
                    color={colors.primary}
                  />
                  <Text style={styles.dateFieldValue}>
                    {formatInputDate(draftStart)}
                  </Text>
                  <Icon name="chevron-down" size={18} color="#9CA3AF" />
                </Pressable>

                <Text style={styles.dateFieldLabel}>End date</Text>
                <Pressable
                  accessibilityRole="button"
                  style={[
                    styles.dateFieldInput,
                    picking === 'end' && styles.dateFieldInputActive,
                  ]}
                  onPress={() => setPicking('end')}>
                  <Icon
                    name="calendar-end"
                    size={18}
                    color={colors.primary}
                  />
                  <Text style={styles.dateFieldValue}>
                    {formatInputDate(draftEnd)}
                  </Text>
                  <Icon name="chevron-down" size={18} color="#9CA3AF" />
                </Pressable>

                {Platform.OS === 'ios' && picking ? (
                  <View style={styles.periodCalendarWrap}>
                    <DateTimePicker
                      value={picking === 'start' ? draftStart : draftEnd}
                      mode="date"
                      display="inline"
                      onChange={onPickerChange}
                      maximumDate={new Date()}
                      style={styles.periodCalendar}
                    />
                  </View>
                ) : null}

                <Pressable
                  accessibilityRole="button"
                  style={styles.periodApplyButton}
                  onPress={applyCustom}>
                  <Icon name="check" size={18} color="#FFFFFF" />
                  <Text style={styles.periodApplyButtonText}>Apply filter</Text>
                </Pressable>
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {Platform.OS === 'android' && visible && picking ? (
        <DateTimePicker
          value={picking === 'start' ? draftStart : draftEnd}
          mode="date"
          display="calendar"
          onChange={onPickerChange}
          maximumDate={new Date()}
        />
      ) : null}
    </>
  );
};

export default RevenueFilterModal;
