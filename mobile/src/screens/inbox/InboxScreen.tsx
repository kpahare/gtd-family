import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ItemCard } from '../../components';
import { useItemsStore, useContextsStore } from '../../store';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function InboxScreen({ navigation }: Props) {
  const [newItem, setNewItem] = useState('');
  const { items, isLoading, fetchItems, addItem, completeItem } = useItemsStore();
  const { contexts, fetchContexts } = useContextsStore();

  const inboxItems = items.filter((item) => item.type === 'inbox');

  useEffect(() => {
    fetchItems('inbox');
    fetchContexts();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    try {
      await addItem(newItem.trim());
      setNewItem('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeItem(id);
    } catch (error) {
      Alert.alert('Error', 'Failed to complete item');
    }
  };

  const getContextById = (id: string | null) => {
    if (!id) return null;
    return contexts.find((c) => c.id === id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Capture what's on your mind..."
          value={newItem}
          onChangeText={setNewItem}
          onSubmitEditing={handleAddItem}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, !newItem.trim() && styles.addButtonDisabled]}
          onPress={handleAddItem}
          disabled={!newItem.trim()}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
        <Text style={styles.count}>{inboxItems.length} items</Text>
      </View>

      <FlatList
        data={inboxItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const context = getContextById(item.context_id);
          return (
            <ItemCard
              item={item}
              onPress={() => navigation.navigate('ProcessItem', { item })}
              onComplete={() => handleComplete(item.id)}
              showContext={!!context}
              contextName={context?.name}
              contextColor={context?.color}
            />
          );
        }}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchItems('inbox')}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle" size={64} color="#10b981" />
            <Text style={styles.emptyTitle}>Inbox Zero!</Text>
            <Text style={styles.emptyText}>
              Capture new items using the input above
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 12,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  count: {
    fontSize: 14,
    color: '#6b7280',
  },
  list: {
    padding: 16,
    paddingTop: 0,
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
    textAlign: 'center',
  },
});
