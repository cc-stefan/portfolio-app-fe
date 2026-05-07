import type { AppLocale } from '@/features/portfolio/i18n/routing';
import type { ProjectTranslation } from '@/features/portfolio/model/types';

export type UserRole = 'USER' | 'ADMIN';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProject {
  id: string;
  slug: string;
  translations: ProjectTranslation[];
  imageUrl: string | null;
  liveUrl: string | null;
  repositoryUrl: string | null;
  projectDate: string | null;
  technologies: string[];
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

export type InquiryStatus = 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'ARCHIVED';

export interface AdminInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: InquiryStatus;
  isRead: boolean;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryMutationPayload {
  status?: InquiryStatus;
  isRead?: boolean;
  adminNotes?: string;
}

export interface AdminDashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  featuredProjects: number;
  projectsWithImages: number;
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
}

export interface AdminDashboardResponse {
  generatedAt: string;
  stats: AdminDashboardStats;
  recentProjects: Array<
    Pick<
      AdminProject,
      | 'id'
      | 'slug'
      | 'translations'
      | 'published'
      | 'featured'
      | 'imageUrl'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
}

export interface ProjectTranslationFormValues {
  title: string;
  summary: string;
  description: string;
}

export interface ProjectFormValues {
  translations: Record<AppLocale, ProjectTranslationFormValues>;
  slug: string;
  liveUrl: string;
  repositoryUrl: string;
  projectDate: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
  displayOrder: string;
}

export interface ProjectTranslationPayload {
  locale: AppLocale;
  title: string;
  summary: string;
  description?: string | null;
}

export interface ProjectMutationPayload {
  translations: ProjectTranslationPayload[];
  slug?: string;
  liveUrl?: string | null;
  repositoryUrl?: string | null;
  projectDate?: string | null;
  technologies?: string[];
  featured?: boolean;
  published?: boolean;
  displayOrder?: number;
}

export type ProjectLocalizedFieldName = keyof ProjectTranslationFormValues;

export type ProjectFieldName =
  | `translations.${AppLocale}.${ProjectLocalizedFieldName}`
  | 'slug'
  | 'liveUrl'
  | 'repositoryUrl'
  | 'projectDate'
  | 'technologies'
  | 'displayOrder';

export type ProjectFieldErrors = Partial<Record<ProjectFieldName, string>>;
