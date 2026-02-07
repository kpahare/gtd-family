import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../types';

interface Props {
  project: Project;
  onPress: () => void;
  itemCount?: number;
  completedCount?: number;
}

export function ProjectCard({
  project,
  onPress,
  itemCount = 0,
  completedCount = 0,
}: Props) {
  const progress = itemCount > 0 ? (completedCount / itemCount) * 100 : 0;

  const getHorizonIcon = () => {
    switch (project.horizon) {
      case 'project':
        return 'folder-outline';
      case 'area':
        return 'layers-outline';
      case 'goal':
        return 'flag-outline';
      case 'vision':
        return 'eye-outline';
      case 'purpose':
        return 'heart-outline';
      default:
        return 'folder-outline';
    }
  };

  const getStatusColor = () => {
    switch (project.status) {
      case 'active':
        return '#10b981';
      case 'completed':
        return '#6b7280';
      case 'someday':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Ionicons
          name={getHorizonIcon() as any}
          size={24}
          color="#6366f1"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {project.name}
          </Text>
          <Text style={styles.horizon}>
            {project.horizon.charAt(0).toUpperCase() + project.horizon.slice(1)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{project.status}</Text>
        </View>
      </View>

      {project.description && (
        <Text style={styles.description} numberOfLines={2}>
          {project.description}
        </Text>
      )}

      {itemCount > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedCount}/{itemCount} tasks
          </Text>
        </View>
      )}

      {project.family_id && (
        <View style={styles.familyBadge}>
          <Ionicons name="people-outline" size={14} color="#6366f1" />
          <Text style={styles.familyText}>Shared</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  horizon: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  familyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  familyText: {
    fontSize: 12,
    color: '#6366f1',
  },
});
