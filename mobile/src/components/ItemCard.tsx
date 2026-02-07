import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Item } from '../types';

interface Props {
  item: Item;
  onPress: () => void;
  onComplete: () => void;
  showContext?: boolean;
  contextName?: string;
  contextColor?: string;
}

export function ItemCard({
  item,
  onPress,
  onComplete,
  showContext = false,
  contextName,
  contextColor,
}: Props) {
  const isCompleted = !!item.completed_at;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <TouchableOpacity
        style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
        onPress={onComplete}
      >
        {isCompleted && (
          <Ionicons name="checkmark" size={16} color="#fff" />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[styles.title, isCompleted && styles.titleCompleted]}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <View style={styles.meta}>
          {showContext && contextName && (
            <View
              style={[styles.contextBadge, { backgroundColor: contextColor }]}
            >
              <Text style={styles.contextText}>{contextName}</Text>
            </View>
          )}

          {item.due_date && (
            <View style={styles.dueDateBadge}>
              <Ionicons name="calendar-outline" size={12} color="#6b7280" />
              <Text style={styles.dueDateText}>
                {new Date(item.due_date).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contextBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  contextText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
