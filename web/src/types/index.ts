export type ItemType =
  | 'inbox'
  | 'next_action'
  | 'waiting_for'
  | 'scheduled'
  | 'someday'
  | 'reference';

export type ProjectStatus = 'active' | 'completed' | 'someday';

export type ProjectHorizon = 'project' | 'area' | 'goal' | 'vision' | 'purpose';

export type FamilyRole = 'owner' | 'admin' | 'member';

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  notes: string | null;
  type: ItemType;
  context_id: string | null;
  assigned_to: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  family_id: string | null;
  name: string;
  description: string | null;
  status: ProjectStatus;
  horizon: ProjectHorizon;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Context {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

export interface Family {
  id: string;
  name: string;
  created_by: string;
  invite_code: string;
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  role: FamilyRole;
  joined_at: string;
}

export interface WeeklyReview {
  id: string;
  user_id: string;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface ReviewChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
