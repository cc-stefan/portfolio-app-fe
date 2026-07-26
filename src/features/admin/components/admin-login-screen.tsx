'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocaleSwitcher } from '@/features/portfolio/components/locale-switcher';
import { SiteFooter } from '@/features/portfolio/components/site-footer';
import { ThemeToggle } from '@/features/portfolio/components/theme-toggle';
import { localizeHref, type AppLocale } from '@/features/portfolio/i18n/routing';
import type { PortfolioDictionary } from '@/features/portfolio/i18n/types';
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
  const [passwordVisible, setPasswordVisible] = useState(false);
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
      <div className="container-page flex min-h-[var(--app-viewport-height)] flex-col py-4 sm:py-6">
        <div className="page-enter flex items-center justify-between gap-3">
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

        <main id="main-content" className="flex flex-1 items-center justify-center py-6 sm:py-10">
          <div className="admin-login-stage page-enter grid w-full max-w-4xl lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,1.1fr)]">
            <section className="relative flex flex-col justify-between border-b border-border/80 p-5 sm:p-7 lg:min-h-[28rem] lg:border-b-0 lg:border-r lg:p-9">
              <div>
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-[linear-gradient(145deg,var(--primary),color-mix(in_oklch,var(--primary)_84%,var(--accent)))] text-sm font-bold text-primary-foreground shadow-[var(--primary-shadow)]">
                  {dictionary.header.avatarInitials}
                </span>
                <p className="section-kicker mt-7">{dictionary.admin.loginLabel}</p>
                <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-4xl">
                  {dictionary.admin.loginTitle}
                </h1>
                <p className="mt-4 max-w-md text-pretty text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                  {dictionary.admin.loginDescription}
                </p>
              </div>
              <p className="hero-index mt-7">{dictionary.admin.brand}</p>
            </section>

            <Card variant="ghost" className="justify-center rounded-none border-0 bg-card/52">
              <CardContent className="grid gap-6 p-5 sm:p-7 lg:p-9">
                <div>
                  <p className="hero-index">{dictionary.header.brand}</p>
                  <p className="mt-2 hidden text-sm leading-6 text-muted-foreground lg:block">
                    {dictionary.admin.loginDescription}
                  </p>
                </div>

                {rootError ? (
                  <div className="fade-enter rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={passwordVisible ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder={dictionary.admin.passwordPlaceholder}
                        className="pr-12"
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={getFieldDescribedBy(
                          'admin-password',
                          errors.password?.message
                        )}
                        {...form.register('password')}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ring/45"
                        aria-label={
                          passwordVisible
                            ? dictionary.admin.hidePassword
                            : dictionary.admin.showPassword
                        }
                        aria-pressed={passwordVisible}
                        onClick={() => setPasswordVisible((currentValue) => !currentValue)}
                      >
                        {passwordVisible ? (
                          <EyeOff className="size-4.5" aria-hidden="true" />
                        ) : (
                          <Eye className="size-4.5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </Field>

                  <Button
                    type="submit"
                    size="lg"
                    className="mt-1"
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
        </main>

        <SiteFooter locale={lang} dictionary={dictionary} navItems={[]} />
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
