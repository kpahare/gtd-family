import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Button } from '../../components';
import { useItemsStore, useContextsStore, useProjectsStore } from '../../store';
import { ItemType } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
};

const PROCESS_OPTIONS: { type: ItemType; icon: string; title: string; description: string }[] = [
  {
    type: 'next_action',
    icon: 'flash',
    title: 'Next Action',
    description: 'Something to do as soon as possible',
  },
  {
    type: 'waiting_for',
    icon: 'hourglass',
    title: 'Waiting For',
    description: 'Delegated to someone else',
  },
  {
    type: 'scheduled',
    icon: 'calendar',
    title: 'Scheduled',
    description: 'Do on a specific date',
  },
  {
    type: 'someday',
    icon: 'time',
    title: 'Someday/Maybe',
    description: 'Might want to do later',
  },
  {
    type: 'reference',
    icon: 'document-text',
    title: 'Reference',
    description: 'Information to keep',
  },
];

export function ProcessItemScreen({ navigation, route }: Props) {
  const { item } = route.params as { item: any };
  const [selectedType, setSelectedType] = useState<ItemType | null>(null);
  const [selectedContextId, setSelectedContextId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const { processItem, deleteItem } = useItemsStore();
  const { contexts } = useContextsStore();
  const { projects } = useProjectsStore();

  const handleProcess = async () => {
    if (!selectedType) {
      Alert.alert('Error', 'Please select where to move this item');
      return;
    }

    try {
      await processItem(item.id, selectedType, selectedContextId ?? undefined, selectedProjectId ?? undefined);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to process item');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(item.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.itemPreview}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.notes && <Text style={styles.itemNotes}>{item.notes}</Text>}
      </View>

      <Text style={styles.sectionTitle}>What is it?</Text>
      <View style={styles.options}>
        {PROCESS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={[
              styles.option,
              selectedType === option.type && styles.optionSelected,
            ]}
            onPress={() => setSelectedType(option.type)}
          >
            <Ionicons
              name={option.icon as any}
              size={24}
              color={selectedType === option.type ? '#6366f1' : '#6b7280'}
            />
            <View style={styles.optionContent}>
              <Text
                style={[
                  styles.optionTitle,
                  selectedType === option.type && styles.optionTitleSelected,
                ]}
              >
                {option.title}
              </Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            {selectedType === option.type && (
              <Ionicons name="checkmark-circle" size={24} color="#6366f1" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {selectedType === 'next_action' && contexts.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Context (optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.contextList}>
              {contexts.map((context) => (
                <TouchableOpacity
                  key={context.id}
                  style={[
                    styles.contextChip,
                    { borderColor: context.color },
                    selectedContextId === context.id && {
                      backgroundColor: context.color,
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
                      styles.contextChipText,
                      { color: context.color },
                      selectedContextId === context.id && { color: '#fff' },
                    ]}
                  >
                    {context.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </>
      )}

      {projects.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Project (optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.contextList}>
              {projects.map((project) => (
                <TouchableOpacity
                  key={project.id}
                  style={[
                    styles.contextChip,
                    { borderColor: '#6366f1' },
                    selectedProjectId === project.id && {
                      backgroundColor: '#6366f1',
                    },
                  ]}
                  onPress={() =>
                    setSelectedProjectId(
                      selectedProjectId === project.id ? null : project.id
                    )
                  }
                >
                  <Text
                    style={[
                      styles.contextChipText,
                      { color: '#6366f1' },
                      selectedProjectId === project.id && { color: '#fff' },
                    ]}
                  >
                    {project.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </>
      )}

      <View style={styles.actions}>
        <Button
          title="Process Item"
          onPress={handleProcess}
          disabled={!selectedType}
          size="large"
        />
        <Button
          title="Delete"
          onPress={handleDelete}
          variant="outline"
          size="large"
          style={styles.deleteButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  itemPreview: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  itemNotes: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  options: {
    paddingHorizontal: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: '#6366f1',
  },
  optionContent: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  optionTitleSelected: {
    color: '#6366f1',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  contextList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  contextChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  contextChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    padding: 16,
    marginTop: 24,
    gap: 12,
  },
  deleteButton: {
    borderColor: '#ef4444',
  },
});
