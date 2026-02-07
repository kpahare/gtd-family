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
import { Button, Input } from '../../components';
import { useContextsStore, useItemsStore } from '../../store';

const COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#ec4899',
];

export function ContextsScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContextName, setNewContextName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[8]);

  const { contexts, isLoading, fetchContexts, addContext, deleteContext } =
    useContextsStore();
  const { items, fetchItems } = useItemsStore();

  useEffect(() => {
    fetchContexts();
    fetchItems();
  }, []);

  const getItemCount = (contextId: string) => {
    return items.filter(
      (item) => item.context_id === contextId && !item.completed_at
    ).length;
  };

  const handleAddContext = async () => {
    if (!newContextName.trim()) {
      Alert.alert('Error', 'Please enter a context name');
      return;
    }

    try {
      await addContext(newContextName.trim(), selectedColor);
      setShowAddModal(false);
      setNewContextName('');
      setSelectedColor(COLORS[8]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create context');
    }
  };

  const handleDeleteContext = (id: string, name: string) => {
    Alert.alert('Delete Context', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteContext(id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={contexts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.contextCard}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <View style={styles.contextContent}>
              <Text style={styles.contextName}>{item.name}</Text>
              <Text style={styles.contextCount}>
                {getItemCount(item.id)} items
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteContext(item.id, item.name)}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchContexts} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="location-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Contexts</Text>
            <Text style={styles.emptyText}>
              Add contexts like @home, @work, @phone
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
              <Text style={styles.modalTitle}>New Context</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Input
              label="Context Name"
              placeholder="e.g., @home, @work, @phone"
              value={newContextName}
              onChangeText={setNewContextName}
            />

            <Text style={styles.colorLabel}>Color</Text>
            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Create Context"
              onPress={handleAddContext}
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
  list: {
    padding: 16,
  },
  contextCard: {
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
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  contextContent: {
    flex: 1,
    marginLeft: 12,
  },
  contextName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  contextCount: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
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
  colorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  createButton: {
    marginTop: 8,
  },
});
