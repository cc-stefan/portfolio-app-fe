"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AppLocale } from "../i18n/routing";
import type { PortfolioDictionary } from "../i18n/types";
import type { PortfolioProject } from "../model/types";
import { ProjectCard } from "./project-card";
import { StateCard } from "./state-card";

interface ProjectGridTabsProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  featuredProjects: PortfolioProject[];
  projects: PortfolioProject[];
  apiOrigin: string;
}

export function ProjectGridTabs({
  locale,
  dictionary,
  featuredProjects,
  projects,
  apiOrigin,
}: ProjectGridTabsProps) {
  return (
    <Tabs defaultValue="featured" className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted-foreground">
          {dictionary.home.showcaseLabel}: {projects.length}
        </p>
        <TabsList>
          <TabsTrigger value="featured">{dictionary.home.featuredTab}</TabsTrigger>
          <TabsTrigger value="all">{dictionary.home.allTab}</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="featured" className="mt-6">
        <ProjectGrid
          projects={featuredProjects}
          locale={locale}
          dictionary={dictionary}
          apiOrigin={apiOrigin}
        />
      </TabsContent>

      <TabsContent value="all" className="mt-6">
        <ProjectGrid
          projects={projects}
          locale={locale}
          dictionary={dictionary}
          apiOrigin={apiOrigin}
        />
      </TabsContent>
    </Tabs>
  );
}

interface ProjectGridProps {
  projects: PortfolioProject[];
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  apiOrigin: string;
}

function ProjectGrid({
  projects,
  locale,
  dictionary,
  apiOrigin,
}: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <StateCard
        eyebrow={dictionary.home.showcaseLabel}
        title={dictionary.home.emptyTitle}
        description={dictionary.home.emptyDescription}
      />
    );
  }

  return (
    <div className="stagger-list grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          locale={locale}
          dictionary={dictionary}
          apiOrigin={apiOrigin}
        />
      ))}
    </div>
  );
}
