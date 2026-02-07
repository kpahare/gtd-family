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
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../../components';
import { useFamilyStore, useAuthStore } from '../../store';
import { apiClient } from '../../api/client';

export function FamilyScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);

  const { user } = useAuthStore();
  const { families, members, isLoading, fetchFamilies, createFamily, joinFamily, fetchMembers } =
    useFamilyStore();

  useEffect(() => {
    fetchFamilies();
  }, []);

  useEffect(() => {
    if (selectedFamilyId) {
      fetchMembers(selectedFamilyId);
    }
  }, [selectedFamilyId]);

  const handleCreateFamily = async () => {
    if (!newFamilyName.trim()) {
      Alert.alert('Error', 'Please enter a family name');
      return;
    }

    try {
      await createFamily(newFamilyName.trim());
      setShowCreateModal(false);
      setNewFamilyName('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create family');
    }
  };

  const handleJoinFamily = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Please enter an invite code');
      return;
    }

    try {
      await joinFamily(inviteCode.trim());
      setShowJoinModal(false);
      setInviteCode('');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Invalid invite code');
    }
  };

  const handleShareInvite = async (familyId: string) => {
    try {
      const { invite_code } = await apiClient.generateInvite(familyId);
      await Share.share({
        message: `Join my family on GTD App! Use invite code: ${invite_code}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate invite');
    }
  };

  return (
    <View style={styles.container}>
      {families.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="people-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Family Groups</Text>
          <Text style={styles.emptyText}>
            Create a family to share projects and tasks
          </Text>
          <View style={styles.emptyActions}>
            <Button
              title="Create Family"
              onPress={() => setShowCreateModal(true)}
            />
            <Button
              title="Join Family"
              variant="outline"
              onPress={() => setShowJoinModal(true)}
            />
          </View>
        </View>
      ) : (
        <>
          <FlatList
            data={families}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.familyCard,
                  selectedFamilyId === item.id && styles.familyCardSelected,
                ]}
                onPress={() => setSelectedFamilyId(item.id)}
              >
                <View style={styles.familyHeader}>
                  <View style={styles.familyIcon}>
                    <Ionicons name="home" size={24} color="#6366f1" />
                  </View>
                  <View style={styles.familyInfo}>
                    <Text style={styles.familyName}>{item.name}</Text>
                    <Text style={styles.familyMeta}>
                      Created {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => handleShareInvite(item.id)}
                  >
                    <Ionicons name="share-outline" size={20} color="#6366f1" />
                  </TouchableOpacity>
                </View>

                {selectedFamilyId === item.id && members.length > 0 && (
                  <View style={styles.membersList}>
                    <Text style={styles.membersTitle}>Members</Text>
                    {members.map((member) => (
                      <View key={member.id} style={styles.memberItem}>
                        <View style={styles.memberAvatar}>
                          <Text style={styles.memberInitial}>
                            {member.user_name.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.memberInfo}>
                          <Text style={styles.memberName}>
                            {member.user_name}
                            {member.user_id === user?.id && ' (You)'}
                          </Text>
                          <Text style={styles.memberRole}>{member.role}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={fetchFamilies} />
            }
          />

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#6366f1" />
              <Text style={styles.actionButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowJoinModal(true)}
            >
              <Ionicons name="enter-outline" size={24} color="#6366f1" />
              <Text style={styles.actionButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Family</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <Input
              label="Family Name"
              placeholder="Enter family name"
              value={newFamilyName}
              onChangeText={setNewFamilyName}
            />
            <Button
              title="Create Family"
              onPress={handleCreateFamily}
              size="large"
            />
          </View>
        </View>
      </Modal>

      <Modal visible={showJoinModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Join Family</Text>
              <TouchableOpacity onPress={() => setShowJoinModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <Input
              label="Invite Code"
              placeholder="Enter invite code"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="none"
            />
            <Button
              title="Join Family"
              onPress={handleJoinFamily}
              size="large"
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
  familyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  familyCardSelected: {
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  familyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  familyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  familyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  familyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  familyMeta: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  shareButton: {
    padding: 8,
  },
  membersList: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  membersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    marginTop: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  memberInfo: {
    marginLeft: 12,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  memberRole: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
  emptyActions: {
    marginTop: 24,
    gap: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366f1',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
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
});
