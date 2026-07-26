'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AppLocale } from '../i18n/routing';
import { localizeHref } from '../i18n/routing';
import type { PaginationMetadata, PortfolioProject } from '../model/types';
import { ProjectCard, type ProjectCardCopy } from './project-card';
import { StateCard } from './state-card';
import { cn } from '@/lib/utils';

export interface ProjectGridTabsCopy {
  countLabel: string;
  featuredTab: string;
  allTab: string;
  carouselLabel: string;
  previousProject: string;
  nextProject: string;
  projectPosition: string;
  previousPage: string;
  nextPage: string;
  pagePosition: string;
  emptyEyebrow: string;
  emptyTitle: string;
  emptyDescription: string;
  projectCard: ProjectCardCopy;
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

function ProjectCarousel({
  projects,
  locale,
  copy,
  apiOrigin,
  showPriorityBadge,
}: ProjectGridProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [activePage, setActivePage] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const pageCount = Math.ceil(projects.length / slidesPerView);

  const updateCarouselState = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const slides = Array.from(track.children) as HTMLElement[];
    const firstSlide = slides[0];

    if (!firstSlide || track.clientWidth === 0 || firstSlide.offsetWidth === 0) {
      return;
    }

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const nextSlidesPerView = Math.max(
      1,
      Math.round((track.clientWidth + gap) / (firstSlide.offsetWidth + gap))
    );
    const nextPageCount = Math.ceil(projects.length / nextSlidesPerView);
    const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
    const nextActivePage =
      maxScrollLeft > 0 && nextPageCount > 1
        ? Math.round((track.scrollLeft / maxScrollLeft) * (nextPageCount - 1))
        : 0;

    setSlidesPerView((currentValue) =>
      currentValue === nextSlidesPerView ? currentValue : nextSlidesPerView
    );
    setActivePage((currentValue) =>
      currentValue === nextActivePage ? currentValue : nextActivePage
    );
  }, [projects.length]);

  useEffect(() => {
    const track = trackRef.current;
    const resizeObserver =
      track && 'ResizeObserver' in window ? new ResizeObserver(updateCarouselState) : null;
    const initialFrame = window.requestAnimationFrame(updateCarouselState);

    if (track) {
      resizeObserver?.observe(track);
    }

    return () => {
      window.cancelAnimationFrame(initialFrame);
      resizeObserver?.disconnect();

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateCarouselState]);

  function handleScroll() {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = window.requestAnimationFrame(updateCarouselState);
  }

  function scrollToPage(index: number) {
    const track = trackRef.current;
    const targetPage = Math.max(0, Math.min(index, pageCount - 1));
    const targetIndex = Math.min(targetPage * slidesPerView, projects.length - 1);
    const target = track?.children.item(targetIndex) as HTMLElement | null;

    if (!track || !target) {
      return;
    }

    track.scrollTo({
      left: Math.min(target.offsetLeft - track.offsetLeft, track.scrollWidth - track.clientWidth),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
    setActivePage(targetPage);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollToPage(activePage - 1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollToPage(activePage + 1);
    }
  }

  return (
    <div
      className="project-swiper"
      role="region"
      aria-roledescription="carousel"
      aria-label={copy.carouselLabel}
    >
      <ul
        ref={trackRef}
        className="project-swiper-track"
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
      >
        {projects.map((project, index) => (
          <li
            key={project.id}
            className="project-swiper-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={formatMessage(copy.projectPosition, {
              current: index + 1,
              total: projects.length,
            })}
          >
            <ProjectCard
              project={project}
              locale={locale}
              copy={copy.projectCard}
              apiOrigin={apiOrigin}
              showPriorityBadge={showPriorityBadge}
            />
          </li>
        ))}
      </ul>

      {pageCount > 1 ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={copy.previousProject}
              disabled={activePage === 0}
              onClick={() => scrollToPage(activePage - 1)}
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={copy.nextProject}
              disabled={activePage === pageCount - 1}
              onClick={() => scrollToPage(activePage + 1)}
            >
              <ChevronRight />
            </Button>
          </div>

          <div
            className="flex flex-wrap items-center justify-end gap-2"
            aria-label={copy.carouselLabel}
          >
            {Array.from({ length: pageCount }).map((_, index) => {
              const firstProjectIndex = Math.min(index * slidesPerView, projects.length - 1);
              const project = projects[firstProjectIndex];

              return (
                <button
                  key={project?.id ?? index}
                  type="button"
                  className={cn(
                    'size-2.5 rounded-full border transition-[width,background-color,border-color] duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45',
                    activePage === index
                      ? 'w-7 border-primary bg-primary'
                      : 'border-border bg-secondary hover:border-primary/60'
                  )}
                  aria-label={formatMessage(copy.projectPosition, {
                    current: firstProjectIndex + 1,
                    total: projects.length,
                  })}
                  aria-current={activePage === index ? 'true' : undefined}
                  onClick={() => scrollToPage(index)}
                />
              );
            })}
          </div>

          <p className="sr-only" aria-live="polite">
            {formatMessage(copy.projectPosition, {
              current: Math.min(activePage * slidesPerView + 1, projects.length),
              total: projects.length,
            })}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ProjectPageNavigation({
  locale,
  copy,
  pagination,
}: {
  locale: AppLocale;
  copy: ProjectGridTabsCopy;
  pagination: PaginationMetadata;
}) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const previousPage = Math.max(1, pagination.page - 1);
  const nextPage = Math.min(pagination.totalPages, pagination.page + 1);
  const paginationStatus = formatMessage(copy.pagePosition, {
    page: pagination.page,
    totalPages: pagination.totalPages,
  });

  return (
    <nav
      className="mt-7 flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card/62 p-4 sm:flex-row"
      aria-label={paginationStatus}
    >
      {pagination.page <= 1 ? (
        <Button type="button" variant="outline" size="sm" disabled>
          <ChevronLeft />
          {copy.previousPage}
        </Button>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link href={getProjectsPageHref(locale, previousPage)}>
            <ChevronLeft />
            {copy.previousPage}
          </Link>
        </Button>
      )}
      <p className="text-sm font-medium text-muted-foreground">{paginationStatus}</p>
      {pagination.page >= pagination.totalPages ? (
        <Button type="button" variant="outline" size="sm" disabled>
          {copy.nextPage}
          <ChevronRight />
        </Button>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link href={getProjectsPageHref(locale, nextPage)}>
            {copy.nextPage}
            <ChevronRight />
          </Link>
        </Button>
      )}
    </nav>
  );
}

function getProjectsPageHref(locale: AppLocale, page: number) {
  return localizeHref(locale, page <= 1 ? '/#projects' : `/?projectsPage=${page}#projects`);
}

function formatMessage(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replace(`{${key}}`, String(value)),
    template
  );
}
