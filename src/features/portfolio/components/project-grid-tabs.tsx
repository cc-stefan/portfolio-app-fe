'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AppLocale } from '../i18n/routing';
import type { PaginationMetadata, PortfolioProject } from '../model/types';
import { ProjectCarousel, type ProjectCarouselCopy } from './project-carousel';
import { ProjectPageNavigation, type ProjectPageNavigationCopy } from './project-page-navigation';
import { StateCard } from './state-card';

export interface ProjectGridTabsCopy extends ProjectCarouselCopy, ProjectPageNavigationCopy {
  countLabel: string;
  featuredTab: string;
  allTab: string;
  emptyEyebrow: string;
  emptyTitle: string;
  emptyDescription: string;
}

interface ProjectGridTabsProps {
  locale: AppLocale;
  copy: ProjectGridTabsCopy;
  projects: PortfolioProject[];
  pagination: PaginationMetadata;
  apiOrigin: string;
}

export function ProjectGridTabs({
  locale,
  copy,
  projects,
  pagination,
  apiOrigin,
}: ProjectGridTabsProps) {
  const featuredProjects = projects.filter((project) => project.featured);
  const hasFeaturedProjects = featuredProjects.length > 0;

  return (
    <Tabs defaultValue="all" className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted-foreground">
          {pagination.totalItems} {copy.countLabel}
        </p>
        <TabsList>
          <TabsTrigger value="all">{copy.allTab}</TabsTrigger>
          {hasFeaturedProjects ? (
            <TabsTrigger value="featured">{copy.featuredTab}</TabsTrigger>
          ) : null}
        </TabsList>
      </div>

      <TabsContent value="all" className="mt-6">
        <ProjectGrid
          projects={projects}
          locale={locale}
          copy={copy}
          apiOrigin={apiOrigin}
          showPriorityBadge
        />
      </TabsContent>

      {hasFeaturedProjects ? (
        <TabsContent value="featured" className="mt-6">
          <ProjectGrid
            projects={featuredProjects}
            locale={locale}
            copy={copy}
            apiOrigin={apiOrigin}
            showPriorityBadge={false}
          />
        </TabsContent>
      ) : null}

      <ProjectPageNavigation locale={locale} copy={copy} pagination={pagination} />
    </Tabs>
  );
}

interface ProjectGridProps {
  projects: PortfolioProject[];
  locale: AppLocale;
  copy: ProjectGridTabsCopy;
  apiOrigin: string;
  showPriorityBadge: boolean;
}

function ProjectGrid({ projects, locale, copy, apiOrigin, showPriorityBadge }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <StateCard
        eyebrow={copy.emptyEyebrow}
        title={copy.emptyTitle}
        description={copy.emptyDescription}
      />
    );
  }

  return (
    <ProjectCarousel
      key={projects.map((project) => project.id).join(':')}
      projects={projects}
      locale={locale}
      copy={copy}
      apiOrigin={apiOrigin}
      showPriorityBadge={showPriorityBadge}
    />
  );
}
