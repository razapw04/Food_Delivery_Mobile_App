import React from 'react';
import {Pressable, ScrollView, StatusBar, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import ChannelRevenueCards from '../../../components/ChannelRevenueCards';
import {styles} from './styles';
import useController, {formatPrice} from './useController';

const CashierSalesScreen = () => {
  const {branch, channelBreakdown, handleBack} = useController();

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
        <Text style={styles.headerTitle}>Branch Sales</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Live sales for {branch?.name ?? 'your branch'}: online app orders
            and POS counter orders are shown separately, plus combined total.
            Cancelled/pending orders are excluded.
          </Text>
        </View>

        {branch ? (
          <>
            <Text style={styles.sectionTitle}>{branch.name}</Text>
            <ChannelRevenueCards breakdown={channelBreakdown} />

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Combined today</Text>
                <Text style={styles.incomeValue}>
                  {formatPrice(channelBreakdown.combined.today)}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Orders today</Text>
                <Text style={styles.statValue}>
                  {channelBreakdown.combined.ordersToday}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.card}>
            <Text style={styles.saleTitle}>No branch assigned</Text>
            <Text style={styles.saleMeta}>
              Ask super admin to assign this cashier to a branch.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CashierSalesScreen;
