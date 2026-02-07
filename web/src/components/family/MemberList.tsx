import { Trash2 } from 'lucide-react';
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
  owner: 'bg-amber-50 text-amber-700',
  admin: 'bg-sky-50 text-sky-700',
  member: 'bg-stone-100 text-stone-700',
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
      <div className="text-center py-12 text-stone-500">
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
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium">
                {member.user_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-stone-900">
                  {member.user_name}
                  {member.user_id === currentUserId && (
                    <span className="text-stone-400 font-normal ml-1">(you)</span>
                  )}
                </p>
                <p className="text-sm text-stone-500">{member.user_email}</p>
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
                  <Trash2 className="w-4 h-4 text-stone-400 hover:text-rose-500" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
