'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AppLocale } from '../i18n/routing';
import { formatMessage } from '../i18n/format-message';
import type { PortfolioProject } from '../model/types';
import { ProjectCard, type ProjectCardCopy } from './project-card';

export interface ProjectCarouselCopy {
  carouselLabel: string;
  previousProject: string;
  nextProject: string;
  projectPosition: string;
  projectCard: ProjectCardCopy;
}

interface ProjectCarouselProps {
  projects: PortfolioProject[];
  locale: AppLocale;
  copy: ProjectCarouselCopy;
  apiOrigin: string;
  showPriorityBadge: boolean;
}

export function ProjectCarousel({
  projects,
  locale,
  copy,
  apiOrigin,
  showPriorityBadge,
}: ProjectCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [activePage, setActivePage] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
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
      Math.floor((track.clientWidth + gap) / (firstSlide.offsetWidth + gap))
    );
    const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
    const nextIsScrollable = maxScrollLeft > 1;
    const nextPageCount = Math.ceil(projects.length / nextSlidesPerView);
    const nextActivePage =
      nextIsScrollable && nextPageCount > 1
        ? Math.round((track.scrollLeft / maxScrollLeft) * (nextPageCount - 1))
        : 0;

    if (!nextIsScrollable && track.scrollLeft !== 0) {
      track.scrollLeft = 0;
    }

    setIsScrollable((currentValue) =>
      currentValue === nextIsScrollable ? currentValue : nextIsScrollable
    );
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

    const scrollPaddingStart =
      Number.parseFloat(window.getComputedStyle(track).scrollPaddingInlineStart) || 0;

    track.scrollTo({
      left: Math.max(
        0,
        Math.min(
          target.offsetLeft - track.offsetLeft - scrollPaddingStart,
          track.scrollWidth - track.clientWidth
        )
      ),
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
      role={isScrollable ? 'region' : undefined}
      aria-roledescription={isScrollable ? 'carousel' : undefined}
      aria-label={isScrollable ? copy.carouselLabel : undefined}
    >
      <ul
        ref={trackRef}
        className="project-swiper-track"
        tabIndex={isScrollable ? 0 : undefined}
        onScroll={isScrollable ? handleScroll : undefined}
        onKeyDown={isScrollable ? handleKeyDown : undefined}
      >
        {projects.map((project, index) => (
          <li
            key={project.id}
            className="project-swiper-slide"
            role={isScrollable ? 'group' : undefined}
            aria-roledescription={isScrollable ? 'slide' : undefined}
            aria-label={
              isScrollable
                ? formatMessage(copy.projectPosition, {
                    current: index + 1,
                    total: projects.length,
                  })
                : undefined
            }
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

      {isScrollable && pageCount > 1 ? (
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
