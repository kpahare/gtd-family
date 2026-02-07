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

export function WaitingForScreen() {
  const { items, isLoading, fetchItems, completeItem } = useItemsStore();

  const waitingItems = items.filter((item) => item.type === 'waiting_for');

  useEffect(() => {
    fetchItems('waiting_for');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Waiting For</Text>
        <Text style={styles.count}>{waitingItems.length} items</Text>
      </View>

      <FlatList
        data={waitingItems}
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
            onRefresh={() => fetchItems('waiting_for')}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="hourglass-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Nothing Waiting</Text>
            <Text style={styles.emptyText}>
              Items delegated to others will appear here
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
