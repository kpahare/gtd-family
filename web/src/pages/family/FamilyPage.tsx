import { useEffect, useState, FormEvent } from 'react';
import { useFamilyStore, useAuthStore } from '../../store';
import { FamilyRole } from '../../types';
import { Header } from '../../components/layout';
import { MemberList, InviteModal } from '../../components/family';
import { Button, Input, Card, CardContent, Modal, Spinner, Select } from '../../components/ui';

export function FamilyPage() {
  const { user } = useAuthStore();
  const {
    families,
    currentFamily,
    members,
    isLoading,
    fetchFamilies,
    createFamily,
    joinFamily,
    fetchMembers,
    generateInvite,
    removeMember,
    setCurrentFamily,
  } = useFamilyStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFamilies();
  }, [fetchFamilies]);

  useEffect(() => {
    if (currentFamily) {
      fetchMembers(currentFamily.id);
    }
  }, [currentFamily, fetchMembers]);

  const currentMember = members.find((m) => m.user_id === user?.id);
  const currentRole: FamilyRole = currentMember?.role || 'member';
  const isAdmin = currentRole === 'owner' || currentRole === 'admin';

  const handleCreateFamily = async (e: FormEvent) => {
    e.preventDefault();
    if (!familyName.trim()) return;

    setIsSubmitting(true);
    setError('');
    try {
      await createFamily(familyName.trim());
      setShowCreateModal(false);
      setFamilyName('');
    } catch {
      setError('Failed to create family');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinFamily = async (e: FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setIsSubmitting(true);
    setError('');
    try {
      await joinFamily(inviteCode.trim());
      setShowJoinModal(false);
      setInviteCode('');
    } catch {
      setError('Invalid invite code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateInvite = async () => {
    if (!currentFamily) return;
    await generateInvite(currentFamily.id);
  };

  const handleRemoveMember = async (userId: string) => {
    if (!currentFamily) return;
    if (confirm('Are you sure you want to remove this member?')) {
      await removeMember(currentFamily.id, userId);
    }
  };

  const familyOptions = families.map((f) => ({ value: f.id, label: f.name }));

  return (
    <div>
      <Header
        title="Family"
        subtitle={currentFamily ? `${members.length} member${members.length !== 1 ? 's' : ''}` : undefined}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowJoinModal(true)}>
              Join Family
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Family
            </Button>
          </div>
        }
      />

      {isLoading && families.length === 0 ? (
        <Spinner className="py-12" />
      ) : families.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Family Yet</h3>
            <p className="text-gray-500 mb-6">Create a family to share projects and collaborate with family members.</p>
            <div className="flex justify-center gap-3">
              <Button variant="secondary" onClick={() => setShowJoinModal(true)}>
                Join with Code
              </Button>
              <Button onClick={() => setShowCreateModal(true)}>
                Create Family
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {families.length > 1 && (
            <div className="max-w-xs">
              <Select
                label="Select Family"
                value={currentFamily?.id || ''}
                onChange={(e) => {
                  const family = families.find((f) => f.id === e.target.value);
                  if (family) setCurrentFamily(family);
                }}
                options={familyOptions}
              />
            </div>
          )}

          {currentFamily && (
            <>
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{currentFamily.name}</h2>
                      <p className="text-sm text-gray-500">Your role: {currentRole}</p>
                    </div>
                    {isAdmin && (
                      <Button onClick={() => setShowInviteModal(true)}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Invite Members
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Members</h3>
                <MemberList
                  members={members}
                  currentUserId={user?.id || ''}
                  currentUserRole={currentRole}
                  isLoading={isLoading}
                  onRemove={isAdmin ? handleRemoveMember : undefined}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Create Family Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Family"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFamily} isLoading={isSubmitting} disabled={!familyName.trim()}>
              Create
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateFamily} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <Input
            label="Family Name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="e.g., The Smith Family"
            autoFocus
          />
        </form>
      </Modal>

      {/* Join Family Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Join Family"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowJoinModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleJoinFamily} isLoading={isSubmitting} disabled={!inviteCode.trim()}>
              Join
            </Button>
          </>
        }
      >
        <form onSubmit={handleJoinFamily} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <Input
            label="Invite Code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter the invite code"
            autoFocus
          />
        </form>
      </Modal>

      {/* Invite Modal */}
      {currentFamily && (
        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          inviteCode={currentFamily.invite_code}
          onGenerateNew={handleGenerateInvite}
        />
      )}
    </div>
  );
}
