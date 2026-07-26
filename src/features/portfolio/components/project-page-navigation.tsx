import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatMessage } from '../i18n/format-message';
import { localizeHref, type AppLocale } from '../i18n/routing';
import type { PaginationMetadata } from '../model/types';

export interface ProjectPageNavigationCopy {
  previousPage: string;
  nextPage: string;
  pagePosition: string;
}

interface ProjectPageNavigationProps {
  locale: AppLocale;
  copy: ProjectPageNavigationCopy;
  pagination: PaginationMetadata;
}

export function ProjectPageNavigation({ locale, copy, pagination }: ProjectPageNavigationProps) {
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
