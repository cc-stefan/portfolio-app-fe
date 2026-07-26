'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { CalendarClock, LoaderCircle, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { PortfolioDictionary } from '@/features/portfolio/i18n/types';
import type { PortfolioAvailability } from '@/features/portfolio/model/types';
import { useAdminAuth } from '../auth/use-admin-auth';

interface AdminAvailabilityCardProps {
  dictionary: PortfolioDictionary;
}

export function AdminAvailabilityCard({ dictionary }: AdminAvailabilityCardProps) {
  const { authFetch, status } = useAdminAuth();
  const copy = dictionary.admin.availability;
  const [availableForCollaboration, setAvailableForCollaboration] = useState(true);
  const [availableFrom, setAvailableFrom] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authFetch('/admin/availability');

      if (!response.ok) {
        if (response.status !== 401 && response.status !== 403) {
          setError(copy.loadError);
        }
        return;
      }

      const availability = (await response.json()) as PortfolioAvailability;
      setAvailableForCollaboration(availability.availableForCollaboration);
      setAvailableFrom(availability.availableFrom ?? '');
    } catch {
      setError(copy.loadError);
    } finally {
      setLoading(false);
    }
  }, [authFetch, copy.loadError]);

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadAvailability();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadAvailability, status]);

  async function saveAvailability(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await authFetch('/admin/availability', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          availableForCollaboration,
          availableFrom: availableForCollaboration || !availableFrom.trim() ? null : availableFrom,
        }),
      });

      if (!response.ok) {
        toast.error(copy.saveError);
        return;
      }

      const availability = (await response.json()) as PortfolioAvailability;
      setAvailableForCollaboration(availability.availableForCollaboration);
      setAvailableFrom(availability.availableFrom ?? '');
      toast.success(copy.saved);
    } catch {
      toast.error(copy.saveError);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card variant="solid" className="page-enter">
        <CardHeader className="gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <Skeleton className="size-11 shrink-0 rounded-xl" />
              <div className="min-w-0 space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64 max-w-full" />
              </div>
            </div>
            <Skeleton className="h-7 w-32 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <div className="flex justify-end lg:col-span-2">
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="solid" className="page-enter">
        <CardHeader>
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" onClick={() => void loadAvailability()}>
            <RefreshCcw className="size-4" />
            {dictionary.admin.retry}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="solid" className="page-enter">
      <CardHeader className="gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
            <CalendarClock className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <CardTitle>{copy.title}</CardTitle>
            <CardDescription className="mt-1">{copy.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form className="grid gap-4 lg:grid-cols-2" onSubmit={saveAvailability}>
          <label className="flex min-h-28 cursor-pointer items-start gap-3 rounded-xl border border-border bg-background/70 p-4">
            <input
              type="checkbox"
              className="mt-1 size-4 shrink-0 rounded border-border text-primary"
              checked={availableForCollaboration}
              onChange={(event) => setAvailableForCollaboration(event.target.checked)}
            />
            <span>
              <span className="block text-sm font-medium text-foreground">
                {dictionary.home.profileSnapshotBadge}
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                {copy.toggleDescription}
              </span>
            </span>
          </label>

          <div className="grid min-h-28 content-start gap-1.5 rounded-xl border border-border bg-background/70 p-4">
            <Label htmlFor="availability-date">{copy.dateLabel}</Label>
            <Input
              id="availability-date"
              type="date"
              value={availableFrom}
              disabled={availableForCollaboration}
              aria-describedby="availability-date-description"
              onChange={(event) => setAvailableFrom(event.target.value)}
            />
            <p
              id="availability-date-description"
              className="text-xs leading-5 text-muted-foreground"
            >
              {copy.dateDescription}
            </p>
          </div>

          <div className="flex justify-end lg:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
              {saving ? copy.savingAction : copy.saveAction}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
