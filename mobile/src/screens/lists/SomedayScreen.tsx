import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ItemCard } from '../../components';
import { useItemsStore } from '../../store';

export function SomedayScreen() {
  const { items, isLoading, fetchItems, completeItem, deleteItem } = useItemsStore();

  const somedayItems = items.filter((item) => item.type === 'someday');

  useEffect(() => {
    fetchItems('someday');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Someday / Maybe</Text>
        <Text style={styles.count}>{somedayItems.length} items</Text>
      </View>

      <FlatList
        data={somedayItems}
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
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchItems('someday')}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Someday Items</Text>
            <Text style={styles.emptyText}>
              Ideas for the future will appear here
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
  count: {
    fontSize: 14,
    color: '#6b7280',
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
});
