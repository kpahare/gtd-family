import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectCard, Button, Input } from '../../components';
import { useProjectsStore } from '../../store';
import { ProjectHorizon } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const HORIZONS: { key: ProjectHorizon | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'project', label: 'Projects' },
  { key: 'area', label: 'Areas' },
  { key: 'goal', label: 'Goals' },
  { key: 'vision', label: 'Vision' },
  { key: 'purpose', label: 'Purpose' },
];

export function ProjectsScreen({ navigation }: Props) {
  const [selectedHorizon, setSelectedHorizon] = useState<ProjectHorizon | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectHorizon, setNewProjectHorizon] = useState<ProjectHorizon>('project');

  const { projects, isLoading, fetchProjects, addProject } = useProjectsStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects =
    selectedHorizon === 'all'
      ? projects
      : projects.filter((p) => p.horizon === selectedHorizon);

  const handleAddProject = async () => {
    if (!newProjectName.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    try {
      await addProject(newProjectName.trim(), newProjectHorizon);
      setShowAddModal(false);
      setNewProjectName('');
      setNewProjectHorizon('project');
    } catch (error) {
      Alert.alert('Error', 'Failed to create project');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={HORIZONS}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedHorizon === item.key && styles.filterChipActive,
              ]}
              onPress={() => setSelectedHorizon(item.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedHorizon === item.key && styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => navigation.navigate('ProjectDetail', { project: item })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchProjects} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="folder-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Projects</Text>
            <Text style={styles.emptyText}>
              Create a project to organize your actions
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Project</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Input
              label="Project Name"
              placeholder="Enter project name"
              value={newProjectName}
              onChangeText={setNewProjectName}
            />

            <Text style={styles.inputLabel}>Horizon</Text>
            <View style={styles.horizonOptions}>
              {HORIZONS.filter((h) => h.key !== 'all').map((horizon) => (
                <TouchableOpacity
                  key={horizon.key}
                  style={[
                    styles.horizonOption,
                    newProjectHorizon === horizon.key && styles.horizonOptionActive,
                  ]}
                  onPress={() => setNewProjectHorizon(horizon.key as ProjectHorizon)}
                >
                  <Text
                    style={[
                      styles.horizonOptionText,
                      newProjectHorizon === horizon.key &&
                        styles.horizonOptionTextActive,
                    ]}
                  >
                    {horizon.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Create Project"
              onPress={handleAddProject}
              size="large"
              style={styles.createButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterList: {
    padding: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  list: {
    padding: 16,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  horizonOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  horizonOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  horizonOptionActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  horizonOptionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  horizonOptionTextActive: {
    color: '#fff',
  },
  createButton: {
    marginTop: 8,
  },
});
