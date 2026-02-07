import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components';
import { useReviewStore } from '../../store';
import { ReviewChecklistItem } from '../../types';

export function WeeklyReviewScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  const [showReviewMode, setShowReviewMode] = useState(true);

  const { checklist, reviews, isLoading, fetchChecklist, fetchReviews, completeReview } =
    useReviewStore();

  useEffect(() => {
    fetchChecklist();
    fetchReviews();
  }, []);

  const toggleStep = (id: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedSteps(newCompleted);
  };

  const handleComplete = async () => {
    if (completedSteps.size < checklist.length) {
      Alert.alert(
        'Incomplete Review',
        'You haven\'t completed all checklist items. Complete anyway?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Complete', onPress: finishReview },
        ]
      );
    } else {
      finishReview();
    }
  };

  const finishReview = async () => {
    try {
      await completeReview(notes);
      Alert.alert('Success', 'Weekly review completed!');
      setCompletedSteps(new Set());
      setNotes('');
      setCurrentStep(0);
    } catch (error) {
      Alert.alert('Error', 'Failed to save review');
    }
  };

  const progress = checklist.length > 0
    ? (completedSteps.size / checklist.length) * 100
    : 0;

  if (!showReviewMode) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Past Reviews</Text>
          <TouchableOpacity onPress={() => setShowReviewMode(true)}>
            <Text style={styles.switchLink}>Start Review</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.reviewsList}>
          {reviews.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No Reviews Yet</Text>
              <Text style={styles.emptyText}>
                Complete your first weekly review
              </Text>
            </View>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                  <Text style={styles.reviewDate}>
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
                {review.notes && (
                  <Text style={styles.reviewNotes}>{review.notes}</Text>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Review</Text>
        <TouchableOpacity onPress={() => setShowReviewMode(false)}>
          <Text style={styles.switchLink}>Past Reviews</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completedSteps.size} of {checklist.length} complete
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.checklistContainer}>
        {checklist.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.checklistItem,
              completedSteps.has(item.id) && styles.checklistItemCompleted,
            ]}
            onPress={() => toggleStep(item.id)}
          >
            <View
              style={[
                styles.checkbox,
                completedSteps.has(item.id) && styles.checkboxCompleted,
              ]}
            >
              {completedSteps.has(item.id) && (
                <Ionicons name="checkmark" size={18} color="#fff" />
              )}
            </View>
            <View style={styles.checklistContent}>
              <Text
                style={[
                  styles.checklistTitle,
                  completedSteps.has(item.id) && styles.checklistTitleCompleted,
                ]}
              >
                {index + 1}. {item.title}
              </Text>
              <Text style={styles.checklistDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Review Notes (optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any thoughts or observations from this week..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Button
          title="Complete Review"
          onPress={handleComplete}
          size="large"
          style={styles.completeButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  switchLink: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  checklistContainer: {
    padding: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checklistItemCompleted: {
    backgroundColor: '#f0fdf4',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checklistContent: {
    flex: 1,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  checklistTitleCompleted: {
    color: '#10b981',
  },
  checklistDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  notesSection: {
    marginTop: 16,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  completeButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  reviewsList: {
    padding: 16,
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginLeft: 8,
  },
  reviewNotes: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
    lineHeight: 20,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
});
