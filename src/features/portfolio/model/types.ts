export interface PortfolioHealth {
  service: string;
  status: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string | null;
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
