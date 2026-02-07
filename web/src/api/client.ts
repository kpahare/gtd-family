import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  User,
  Item,
  ItemType,
  Project,
  ProjectStatus,
  ProjectHorizon,
  Context,
  Family,
  FamilyMember,
  WeeklyReview,
  ReviewChecklistItem,
  AuthTokens,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401 && this.refreshToken) {
          try {
            await this.refreshAccessToken();
            const config = error.config!;
            config.headers.Authorization = `Bearer ${this.accessToken}`;
            return this.client.request(config);
          } catch {
            await this.logout();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  init() {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  private setTokens(tokens: AuthTokens) {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }

  private async refreshAccessToken() {
    const response = await this.client.post<AuthTokens>('/auth/refresh', null, {
      params: { refresh_token: this.refreshToken },
    });
    this.setTokens(response.data);
  }

  // Auth
  async register(email: string, password: string, name: string): Promise<User> {
    const response = await this.client.post<User>('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<User> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await this.client.post<AuthTokens>('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    this.setTokens(response.data);
    return this.getCurrentUser();
  }

  async logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async googleLogin(credential: string): Promise<User> {
    const response = await this.client.post<AuthTokens>('/auth/google', {
      credential,
    });
    this.setTokens(response.data);
    return this.getCurrentUser();
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    return response.data;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Items
  async getItems(params?: {
    type?: ItemType;
    project_id?: string;
    context_id?: string;
    include_completed?: boolean;
  }): Promise<Item[]> {
    const response = await this.client.get<Item[]>('/items', { params });
    return response.data;
  }

  async createItem(data: {
    title: string;
    notes?: string;
    type?: ItemType;
    project_id?: string;
    context_id?: string;
    assigned_to?: string;
    due_date?: string;
  }): Promise<Item> {
    const response = await this.client.post<Item>('/items', data);
    return response.data;
  }

  async updateItem(id: string, data: Partial<Item>): Promise<Item> {
    const response = await this.client.patch<Item>(`/items/${id}`, data);
    return response.data;
  }

  async deleteItem(id: string): Promise<void> {
    await this.client.delete(`/items/${id}`);
  }

  async completeItem(id: string): Promise<Item> {
    const response = await this.client.post<Item>(`/items/${id}/complete`);
    return response.data;
  }

  async processItem(
    id: string,
    data: {
      type: ItemType;
      project_id?: string;
      context_id?: string;
      assigned_to?: string;
      due_date?: string;
    }
  ): Promise<Item> {
    const response = await this.client.post<Item>(`/items/${id}/process`, data);
    return response.data;
  }

  // Projects
  async getProjects(params?: {
    horizon?: ProjectHorizon;
    status?: ProjectStatus;
    family_id?: string;
  }): Promise<Project[]> {
    const response = await this.client.get<Project[]>('/projects', { params });
    return response.data;
  }

  async createProject(data: {
    name: string;
    description?: string;
    status?: ProjectStatus;
    horizon?: ProjectHorizon;
    family_id?: string;
    parent_id?: string;
  }): Promise<Project> {
    const response = await this.client.post<Project>('/projects', data);
    return response.data;
  }

  async getProject(id: string): Promise<Project> {
    const response = await this.client.get<Project>(`/projects/${id}`);
    return response.data;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await this.client.patch<Project>(`/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.client.delete(`/projects/${id}`);
  }

  // Contexts
  async getContexts(): Promise<Context[]> {
    const response = await this.client.get<Context[]>('/contexts');
    return response.data;
  }

  async createContext(data: { name: string; color?: string }): Promise<Context> {
    const response = await this.client.post<Context>('/contexts', data);
    return response.data;
  }

  async updateContext(id: string, data: Partial<Context>): Promise<Context> {
    const response = await this.client.patch<Context>(`/contexts/${id}`, data);
    return response.data;
  }

  async deleteContext(id: string): Promise<void> {
    await this.client.delete(`/contexts/${id}`);
  }

  // Families
  async getFamilies(): Promise<Family[]> {
    const response = await this.client.get<Family[]>('/families');
    return response.data;
  }

  async createFamily(name: string): Promise<Family> {
    const response = await this.client.post<Family>('/families', { name });
    return response.data;
  }

  async getFamily(id: string): Promise<Family> {
    const response = await this.client.get<Family>(`/families/${id}`);
    return response.data;
  }

  async generateInvite(familyId: string): Promise<{ invite_code: string }> {
    const response = await this.client.post<{ invite_code: string }>(
      `/families/${familyId}/invite`
    );
    return response.data;
  }

  async joinFamily(inviteCode: string): Promise<Family> {
    const response = await this.client.post<Family>('/families/join', {
      invite_code: inviteCode,
    });
    return response.data;
  }

  async getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
    const response = await this.client.get<FamilyMember[]>(
      `/families/${familyId}/members`
    );
    return response.data;
  }

  async removeFamilyMember(familyId: string, userId: string): Promise<void> {
    await this.client.delete(`/families/${familyId}/members/${userId}`);
  }

  async updateMemberRole(familyId: string, userId: string, role: string): Promise<FamilyMember> {
    const response = await this.client.patch<FamilyMember>(
      `/families/${familyId}/members/${userId}`,
      { role }
    );
    return response.data;
  }

  // Weekly Reviews
  async getReviewChecklist(): Promise<ReviewChecklistItem[]> {
    const response = await this.client.get<{ items: ReviewChecklistItem[] }>(
      '/reviews/checklist'
    );
    return response.data.items;
  }

  async createReview(notes?: string): Promise<WeeklyReview> {
    const response = await this.client.post<WeeklyReview>('/reviews', { notes });
    return response.data;
  }

  async getReviews(): Promise<WeeklyReview[]> {
    const response = await this.client.get<WeeklyReview[]>('/reviews');
    return response.data;
  }
}

export const apiClient = new ApiClient();
