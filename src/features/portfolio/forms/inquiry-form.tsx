'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { CheckCircle2, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { AppLocale } from '../i18n/routing';
import type { PortfolioDictionary } from '../i18n/types';
import { createInquiryFormSchema, type InquiryFormValues } from './inquiry-form-schema';

interface InquiryFormProps {
  locale: AppLocale;
  copy: PortfolioDictionary['inquiryForm'];
}

interface InquiryErrorResponse {
  errors?: Array<{ path?: string[]; message?: string }>;
  message?: string;
}

interface InquirySuccessResponse {
  receivedAt?: string;
}

export function InquiryForm({ locale, copy }: InquiryFormProps) {
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const resolver = useMemo(
    () => zodResolver(createInquiryFormSchema(copy) as never) as Resolver<InquiryFormValues>,
    [copy]
  );
  const form = useForm<InquiryFormValues>({
    resolver,
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmittedAt(null);
    setSubmissionError(null);

    const response = await fetch('/api/inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-locale': locale,
      },
      body: JSON.stringify(values),
    });

    const payload = (await response.json().catch(() => null)) as
      | InquiryErrorResponse
      | InquirySuccessResponse
      | null;

    if (!response.ok) {
      const errorPayload = payload as InquiryErrorResponse | null;

      if (errorPayload?.errors?.length) {
        for (const error of errorPayload.errors) {
          const field = error.path?.[0];

          if (field && field in values) {
            form.setError(field as keyof InquiryFormValues, {
              message: error.message ?? copy.errorDescription,
            });
          }
        }
      }

      const message = errorPayload?.message ?? copy.errorDescription;
      setSubmissionError(message);
      toast.error(message);
      return;
    }

    toast.success(copy.successTitle);
    const successPayload = payload as InquirySuccessResponse | null;
    setSubmittedAt(successPayload?.receivedAt ?? new Date().toISOString());
    form.reset();
  });
  const errors = form.formState.errors;

  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      {submittedAt ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-200">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-semibold">{copy.successTitle}</p>
              <p className="mt-1 leading-6">{copy.successDescription}</p>
            </div>
          </div>
        </div>
      ) : null}

      {submissionError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <p className="font-semibold">{copy.errorTitle}</p>
          <p className="mt-1 leading-6">{submissionError}</p>
        </div>
      ) : null}

      <div className="grid gap-3">
        <div className="grid gap-3 md:grid-cols-2 md:gap-x-4 md:gap-y-0">
          <Field
            label={copy.nameLabel}
            error={errors.name?.message}
            htmlFor="name"
            description={copy.namePlaceholder}
          >
            <Input
              id="name"
              placeholder={copy.namePlaceholder}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={getFieldDescribedBy('name', errors.name?.message)}
              {...form.register('name')}
            />
          </Field>

          <Field
            label={copy.emailLabel}
            error={errors.email?.message}
            htmlFor="email"
            description={copy.emailPlaceholder}
          >
            <Input
              id="email"
              type="email"
              placeholder={copy.emailPlaceholder}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={getFieldDescribedBy('email', errors.email?.message)}
              {...form.register('email')}
            />
          </Field>
        </div>
      </div>

      <Field
        label={copy.messageLabel}
        error={errors.message?.message}
        htmlFor="message"
        description={copy.messagePlaceholder}
      >
        <Textarea
          id="message"
          placeholder={copy.messagePlaceholder}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={getFieldDescribedBy('message', errors.message?.message)}
          {...form.register('message')}
        />
      </Field>

      <div className="flex flex-col gap-3 border-t border-border pt-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">{copy.privacyNote}</p>
        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              {copy.submitting}
            </>
          ) : (
            copy.submit
          )}
        </Button>
      </div>
    </form>
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
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={htmlFor}>{label}</Label>
      </div>
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
