import type { AppLocale } from '../i18n/routing';

export interface PortfolioHealth {
  service: string;
  status: string;
}

export interface ProjectTranslation {
  locale: AppLocale;
  title: string;
  summary: string;
  description: string | null;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string | null;
  contentLocale: AppLocale;
  availableLocales: AppLocale[];
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

export interface ApiResult<T> {
  ok: boolean;
  status: number | null;
  data: T | null;
  error: string | null;
}
