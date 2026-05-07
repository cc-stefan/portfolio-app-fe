'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocaleSwitcher } from '@/features/portfolio/components/locale-switcher';
import { SiteFooter } from '@/features/portfolio/components/site-footer';
import { ThemeToggle } from '@/features/portfolio/components/theme-toggle';
import { localizeHref, type AppLocale } from '@/features/portfolio/i18n/routing';
import type { PortfolioDictionary } from '@/features/portfolio/i18n/types';
import { getPortfolioHomeSectionLinks } from '@/features/portfolio/lib/portfolio-navigation';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '../auth/use-admin-auth';
import {
  createAdminLoginFormSchema,
  type AdminLoginFormValues,
} from '../forms/admin-login-form-schema';

interface AdminLoginScreenProps {
  lang: AppLocale;
  dictionary: PortfolioDictionary;
}

export function AdminLoginScreen({ lang, dictionary }: AdminLoginScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearAccessDenied, login, status } = useAdminAuth();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const resolver = useMemo(
    () =>
      zodResolver(
        createAdminLoginFormSchema(dictionary.admin) as never
      ) as Resolver<AdminLoginFormValues>,
    [dictionary.admin]
  );
  const form = useForm<AdminLoginFormValues>({
    resolver,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const nextParam = searchParams.get('next');
  const nextHref =
    nextParam && nextParam.startsWith('/') ? nextParam : localizeHref(lang, '/admin');
  const footerNavItems = getPortfolioHomeSectionLinks(dictionary);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(nextHref);
    }
  }, [nextHref, router, status]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmissionError(null);
    clearAccessDenied();

    const result = await login(values.email, values.password, {
      invalidCredentials: dictionary.admin.unableToSignIn,
      accessDenied: dictionary.admin.accessDeniedDescription,
    });

    if (!result.ok) {
      const message = result.error ?? dictionary.admin.unableToSignIn;
      setSubmissionError(message);
      form.setError('root', { message });
      return;
    }

    router.replace(nextHref);
  });

  const errors = form.formState.errors;
  const rootError = errors.root?.message ?? submissionError;

  return (
    <div className="page-shell">
      <div className="container-page flex min-h-screen flex-col py-4 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Button asChild variant="ghost" size="sm">
              <Link href={localizeHref(lang, '/')}>{dictionary.admin.backToPortfolio}</Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <LocaleSwitcher
              locale={lang}
              localeNames={dictionary.localeNames}
              label={dictionary.header.languageLabel}
            />
            <ThemeToggle label={dictionary.header.themeLabel} />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-10 sm:py-12">
          <Card variant="solid" className="w-full max-w-md">
            <CardContent className="grid gap-6 p-6 sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {dictionary.admin.loginLabel}
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-foreground">
                  {dictionary.admin.loginTitle}
                </h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {dictionary.admin.loginDescription}
                </p>
              </div>

              {rootError ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {rootError}
                </div>
              ) : null}

              <form className="grid gap-4" onSubmit={onSubmit} noValidate>
                <Field
                  label={dictionary.admin.emailLabel}
                  error={errors.email?.message}
                  htmlFor="admin-email"
                  description={dictionary.admin.emailPlaceholder}
                >
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    placeholder={dictionary.admin.emailPlaceholder}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={getFieldDescribedBy('admin-email', errors.email?.message)}
                    {...form.register('email')}
                  />
                </Field>

                <Field
                  label={dictionary.admin.passwordLabel}
                  error={errors.password?.message}
                  htmlFor="admin-password"
                  description={dictionary.admin.passwordPlaceholder}
                >
                  <Input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder={dictionary.admin.passwordPlaceholder}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={getFieldDescribedBy(
                      'admin-password',
                      errors.password?.message
                    )}
                    {...form.register('password')}
                  />
                </Field>

                <Button
                  type="submit"
                  size="lg"
                  disabled={form.formState.isSubmitting || status === 'loading'}
                >
                  {form.formState.isSubmitting
                    ? dictionary.admin.signingIn
                    : dictionary.admin.signIn}
                  <ArrowRight className="size-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <SiteFooter locale={lang} dictionary={dictionary} navItems={footerNavItems} />
      </div>
    </div>
  );
}

function getFieldDescribedBy(htmlFor: string, error?: string) {
  return error ? `${htmlFor}-description ${htmlFor}-error` : `${htmlFor}-description`;
}

interface FieldProps {
  label: string;
  description: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}

function Field({ label, description, error, htmlFor, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5" data-invalid={Boolean(error)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      <p id={`${htmlFor}-description`} className="sr-only">
        {description}
      </p>
      {error ? (
        <p
          id={`${htmlFor}-error`}
          aria-live="polite"
          className={cn('text-xs leading-4 text-destructive')}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
