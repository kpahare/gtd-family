import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ItemCard, Button } from '../../components';
import { useItemsStore, useProjectsStore } from '../../store';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
};

export function ProjectDetailScreen({ navigation, route }: Props) {
  const { project } = route.params as { project: any };
  const { items, isLoading, fetchItems, completeItem } = useItemsStore();
  const { updateProject, deleteProject } = useProjectsStore();

  const projectItems = items.filter((item) => item.project_id === project.id);

  useEffect(() => {
    fetchItems();
  }, []);

  const handleComplete = async () => {
    try {
      await updateProject(project.id, { status: 'completed' });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to complete project');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProject(project.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete project');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{project.name}</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{project.horizon}</Text>
            </View>
            <View
              style={[
                styles.badge,
                project.status === 'active' && styles.badgeActive,
                project.status === 'completed' && styles.badgeCompleted,
              ]}
            >
              <Text style={styles.badgeText}>{project.status}</Text>
            </View>
          </View>
        </View>
        {project.description && (
          <Text style={styles.description}>{project.description}</Text>
        )}
        {project.family_id && (
          <View style={styles.sharedBadge}>
            <Ionicons name="people" size={16} color="#6366f1" />
            <Text style={styles.sharedText}>Shared with family</Text>
          </View>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <Text style={styles.sectionCount}>{projectItems.length} items</Text>
      </View>

      <FlatList
        data={projectItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => {}}
            onComplete={() => completeItem(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchItems} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="list-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>No actions in this project</Text>
          </View>
        }
      />

      <View style={styles.actions}>
        {project.status === 'active' && (
          <Button
            title="Mark Complete"
            onPress={handleComplete}
            size="large"
            style={styles.completeButton}
          />
        )}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
          <Text style={styles.deleteText}>Delete Project</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  badgeActive: {
    backgroundColor: '#10b981',
  },
  badgeCompleted: {
    backgroundColor: '#6b7280',
  },
  badgeText: {
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
  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  sharedText: {
    fontSize: 14,
    color: '#6366f1',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  sectionCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  list: {
    paddingHorizontal: 16,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  actions: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  completeButton: {
    marginBottom: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  deleteText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
});
