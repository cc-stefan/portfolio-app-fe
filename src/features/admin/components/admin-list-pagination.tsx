'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginationMetadata } from '@/features/portfolio/model/types';

interface AdminListPaginationProps {
  pagination: PaginationMetadata;
  previousLabel: string;
  nextLabel: string;
  statusLabel: string;
  disabled?: boolean;
  onPageChange: (page: number) => void;
}

export function AdminListPagination({
  pagination,
  previousLabel,
  nextLabel,
  statusLabel,
  disabled = false,
  onPageChange,
}: AdminListPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="page-enter flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-card/72 p-4 sm:flex-row"
      aria-label={formatStatus(statusLabel, pagination)}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        <ChevronLeft />
        {previousLabel}
      </Button>
      <p className="text-sm font-medium text-muted-foreground" aria-live="polite">
        {formatStatus(statusLabel, pagination)}
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || pagination.page >= pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        {nextLabel}
        <ChevronRight />
      </Button>
    </nav>
  );
}

function formatStatus(template: string, pagination: PaginationMetadata) {
  return template
    .replace('{page}', pagination.page.toString())
    .replace('{totalPages}', pagination.totalPages.toString());
}
