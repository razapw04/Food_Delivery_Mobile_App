import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import useController, {formatWhen} from './useController';

const FeedbackScreen = () => {
  const {
    rating,
    comment,
    items,
    saving,
    canSubmit,
    setRating,
    setComment,
    handleSubmit,
    goBack,
  } = useController();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={goBack}
          style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#202321" />
        </Pressable>
        <Text style={styles.headerTitle}>Ratings & Feedback</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <View>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Rate your experience</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map(value => (
                    <Pressable
                      key={value}
                      accessibilityRole="button"
                      accessibilityLabel={`${value} star`}
                      style={styles.starButton}
                      onPress={() => setRating(value)}>
                      <Icon
                        name={value <= rating ? 'star' : 'star-outline'}
                        size={32}
                        color="#FF7622"
                      />
                    </Pressable>
                  ))}
                </View>
                <TextInput
                  style={styles.input}
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Tell us what you liked or what we can improve..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                />
                <Pressable
                  accessibilityRole="button"
                  style={[
                    styles.submitButton,
                    !canSubmit && styles.submitButtonDisabled,
                  ]}
                  disabled={!canSubmit}
                  onPress={() => {
                    void handleSubmit();
                  }}>
                  <Text style={styles.submitButtonText}>
                    {saving ? 'Submitting...' : 'Submit feedback'}
                  </Text>
                </Pressable>
              </View>
              {items.length > 0 ? (
                <Text style={styles.historyTitle}>Your previous feedback</Text>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                No feedback yet. Share your first rating above.
              </Text>
            </View>
          }
          renderItem={({item}) => (
            <View style={styles.feedbackItem}>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(value => (
                  <Icon
                    key={value}
                    name={value <= item.rating ? 'star' : 'star-outline'}
                    size={16}
                    color="#FF7622"
                  />
                ))}
              </View>
              <Text style={styles.feedbackMeta}>
                {formatWhen(item.createdAt)}
              </Text>
              <Text style={styles.feedbackComment}>{item.comment}</Text>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FeedbackScreen;
