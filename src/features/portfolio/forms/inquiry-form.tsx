"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { PortfolioDictionary } from "../i18n/types";
import {
  inquiryFormSchema,
  type InquiryFormValues,
} from "./inquiry-form-schema";

interface InquiryFormProps {
  copy: PortfolioDictionary["inquiryForm"];
}

const resolver = zodResolver(
  inquiryFormSchema as never,
) as Resolver<InquiryFormValues>;

export function InquiryForm({ copy }: InquiryFormProps) {
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const form = useForm<InquiryFormValues>({
    resolver,
    defaultValues: {
      name: "",
      email: "",
      company: "",
      budget: "",
      scope: "",
      message: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmittedAt(null);

    try {
      const request = fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then(async (response) => {
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as
            | { errors?: Array<{ path?: string[]; message?: string }> }
            | null;

          if (payload?.errors?.length) {
            for (const error of payload.errors) {
              const field = error.path?.[0];

              if (field && field in values) {
                form.setError(field as keyof InquiryFormValues, {
                  message: error.message ?? copy.errorDescription,
                });
              }
            }
          }

          throw new Error(copy.errorDescription);
        }

        return response.json() as Promise<{ receivedAt?: string }>;
      });

      toast.promise(request, {
        loading: copy.submitting,
        success: copy.successTitle,
        error: copy.errorTitle,
      });

      const payload = await request;
      setSubmittedAt(payload.receivedAt ?? new Date().toISOString());
      form.reset();
    } catch {
      return;
    }
  });

  return (
    <form className="grid gap-5" onSubmit={onSubmit} noValidate>
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

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label={copy.nameLabel}
          error={form.formState.errors.name?.message}
          htmlFor="name"
          description={copy.namePlaceholder}
        >
          <Input
            id="name"
            placeholder={copy.namePlaceholder}
            autoComplete="name"
            aria-invalid={Boolean(form.formState.errors.name)}
            aria-describedby="name-description name-error"
            {...form.register("name")}
          />
        </Field>

        <Field
          label={copy.emailLabel}
          error={form.formState.errors.email?.message}
          htmlFor="email"
          description={copy.emailPlaceholder}
        >
          <Input
            id="email"
            type="email"
            placeholder={copy.emailPlaceholder}
            autoComplete="email"
            aria-invalid={Boolean(form.formState.errors.email)}
            aria-describedby="email-description email-error"
            {...form.register("email")}
          />
        </Field>

        <Field
          label={copy.companyLabel}
          error={form.formState.errors.company?.message}
          htmlFor="company"
          description={copy.companyPlaceholder}
        >
          <Input
            id="company"
            placeholder={copy.companyPlaceholder}
            autoComplete="organization"
            aria-invalid={Boolean(form.formState.errors.company)}
            aria-describedby="company-description company-error"
            {...form.register("company")}
          />
        </Field>

        <Field
          label={copy.budgetLabel}
          error={form.formState.errors.budget?.message}
          htmlFor="budget"
          description={copy.budgetPlaceholder}
        >
          <Input
            id="budget"
            placeholder={copy.budgetPlaceholder}
            aria-invalid={Boolean(form.formState.errors.budget)}
            aria-describedby="budget-description budget-error"
            {...form.register("budget")}
          />
        </Field>
      </div>

      <Field
        label={copy.scopeLabel}
        error={form.formState.errors.scope?.message}
        htmlFor="scope"
        description={copy.scopePlaceholder}
      >
        <Input
          id="scope"
          placeholder={copy.scopePlaceholder}
          aria-invalid={Boolean(form.formState.errors.scope)}
          aria-describedby="scope-description scope-error"
          {...form.register("scope")}
        />
      </Field>

      <Field
        label={copy.messageLabel}
        error={form.formState.errors.message?.message}
        htmlFor="message"
        description={copy.messagePlaceholder}
      >
        <Textarea
          id="message"
          placeholder={copy.messagePlaceholder}
          aria-invalid={Boolean(form.formState.errors.message)}
          aria-describedby="message-description message-error"
          {...form.register("message")}
        />
      </Field>

      <div className="flex flex-col gap-4 border-t border-border pt-5 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          {copy.privacyNote}
        </p>
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

interface FieldProps {
  label: string;
  description: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}

function Field({ label, description, error, htmlFor, children }: FieldProps) {
  return (
    <div className="grid gap-2" data-invalid={Boolean(error)}>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={htmlFor}>{label}</Label>
      </div>
      {children}
      <p id={`${htmlFor}-description`} className="sr-only">
        {description}
      </p>
      <p
        id={`${htmlFor}-error`}
        aria-live="polite"
        className={cn(
          "min-h-5 text-sm text-muted-foreground transition-colors",
          error && "text-destructive",
        )}
      >
        {error ?? ""}
      </p>
    </div>
  );
}
