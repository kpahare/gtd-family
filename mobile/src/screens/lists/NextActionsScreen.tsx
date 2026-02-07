import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ItemCard } from '../../components';
import { useItemsStore, useContextsStore } from '../../store';
import { Item, Context } from '../../types';

export function NextActionsScreen() {
  const [selectedContextId, setSelectedContextId] = useState<string | null>(null);
  const { items, isLoading, fetchItems, completeItem } = useItemsStore();
  const { contexts, fetchContexts } = useContextsStore();

  const nextActions = items.filter((item) => item.type === 'next_action');

  useEffect(() => {
    fetchItems('next_action');
    fetchContexts();
  }, []);

  const getContextById = (id: string | null) => {
    if (!id) return null;
    return contexts.find((c) => c.id === id);
  };

  const getGroupedItems = () => {
    const filtered = selectedContextId
      ? nextActions.filter((item) => item.context_id === selectedContextId)
      : nextActions;

    const grouped: { [key: string]: Item[] } = {};

    filtered.forEach((item) => {
      const context = getContextById(item.context_id);
      const key = context?.name || 'No Context';
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    return Object.keys(grouped).map((key) => ({
      title: key,
      data: grouped[key],
      context: contexts.find((c) => c.name === key),
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterChip, !selectedContextId && styles.filterChipActive]}
          onPress={() => setSelectedContextId(null)}
        >
          <Text
            style={[
              styles.filterChipText,
              !selectedContextId && styles.filterChipTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {contexts.map((context) => (
          <TouchableOpacity
            key={context.id}
            style={[
              styles.filterChip,
              selectedContextId === context.id && {
                backgroundColor: context.color,
                borderColor: context.color,
              },
            ]}
            onPress={() =>
              setSelectedContextId(
                selectedContextId === context.id ? null : context.id
              )
            }
          >
            <Text
              style={[
                styles.filterChipText,
                selectedContextId === context.id && styles.filterChipTextActive,
              ]}
            >
              {context.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionList
        sections={getGroupedItems()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const context = getContextById(item.context_id);
          return (
            <ItemCard
              item={item}
              onPress={() => {}}
              onComplete={() => completeItem(item.id)}
              showContext={!!context}
              contextName={context?.name}
              contextColor={context?.color}
            />
          );
        }}
        renderSectionHeader={({ section }) => (
          <View
            style={[
              styles.sectionHeader,
              { borderLeftColor: section.context?.color || '#6b7280' },
            ]}
          >
            <Ionicons
              name="location-outline"
              size={18}
              color={section.context?.color || '#6b7280'}
            />
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionCount}>{section.data.length}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => fetchItems('next_action')}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="flash-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No Next Actions</Text>
            <Text style={styles.emptyText}>
              Process inbox items to create next actions
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 12,
    borderLeftWidth: 3,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
  sectionCount: {
    fontSize: 12,
    color: '#9ca3af',
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
