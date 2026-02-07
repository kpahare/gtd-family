import { FamilyMember, FamilyRole } from '../../types';
import { Card, CardContent, Button, Spinner } from '../ui';

interface MemberListProps {
  members: FamilyMember[];
  currentUserId: string;
  currentUserRole: FamilyRole;
  isLoading?: boolean;
  onRemove?: (userId: string) => void;
}

const roleLabels: Record<FamilyRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
};

const roleBadgeColors: Record<FamilyRole, string> = {
  owner: 'bg-purple-100 text-purple-800',
  admin: 'bg-blue-100 text-blue-800',
  member: 'bg-gray-100 text-gray-800',
};

export function MemberList({
  members,
  currentUserId,
  currentUserRole,
  isLoading,
  onRemove,
}: MemberListProps) {
  if (isLoading) {
    return <Spinner className="py-12" />;
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No members</p>
      </div>
    );
  }

  const canRemove = (member: FamilyMember) => {
    if (member.user_id === currentUserId) return false;
    if (member.role === 'owner') return false;
    if (currentUserRole === 'owner') return true;
    if (currentUserRole === 'admin' && member.role === 'member') return true;
    return false;
  };

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <Card key={member.id}>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {member.user_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {member.user_name}
                  {member.user_id === currentUserId && (
                    <span className="text-gray-400 font-normal ml-1">(you)</span>
                  )}
                </p>
                <p className="text-sm text-gray-500">{member.user_email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-xs font-medium ${roleBadgeColors[member.role]}`}>
                {roleLabels[member.role]}
              </span>
              {canRemove(member) && onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(member.user_id)}
                >
                  <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
