import type { FormEventHandler, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { appLocales, type AppLocale } from '@/features/portfolio/i18n/routing';
import type { PortfolioDictionary } from '@/features/portfolio/i18n/types';
import { cn } from '@/lib/utils';
import { getLocalizedProjectFieldError, localeHasProjectErrors } from '../lib/project-form';
import type {
  ProjectFieldErrors,
  ProjectFormValues,
  ProjectLocalizedFieldName,
} from '../model/types';
import { AdminFormField, AdminToggleField } from './admin-form-field';

type SharedProjectField = Exclude<keyof ProjectFormValues, 'translations'>;

type UpdateProjectField = <K extends SharedProjectField>(
  field: K,
  value: ProjectFormValues[K]
) => void;

type UpdateLocalizedProjectField = (
  locale: AppLocale,
  field: ProjectLocalizedFieldName,
  value: string
) => void;

interface AdminProjectFormProps {
  copy: PortfolioDictionary['admin']['projectEditor'];
  localeNames: PortfolioDictionary['localeNames'];
  formValues: ProjectFormValues;
  fieldErrors: ProjectFieldErrors;
  activeLocale: AppLocale;
  technologyInput: string;
  isEditing: boolean;
  saving: boolean;
  uploading: boolean;
  onActiveLocaleChange: (locale: AppLocale) => void;
  onTechnologyInputChange: (value: string) => void;
  onAddTechnology: () => void;
  onRemoveTechnology: (technology: string) => void;
  onFieldChange: UpdateProjectField;
  onLocalizedFieldChange: UpdateLocalizedProjectField;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function AdminProjectForm({
  copy,
  localeNames,
  formValues,
  fieldErrors,
  activeLocale,
  technologyInput,
  isEditing,
  saving,
  uploading,
  onActiveLocaleChange,
  onTechnologyInputChange,
  onAddTechnology,
  onRemoveTechnology,
  onFieldChange,
  onLocalizedFieldChange,
  onSubmit,
}: AdminProjectFormProps) {
  function handleTechnologyKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      onAddTechnology();
    }
  }

  return (
    <Card variant="solid" className="page-enter">
      <CardContent className="p-5 sm:p-6 lg:p-8">
        <form className="grid gap-8" onSubmit={onSubmit} noValidate>
          <section className="grid gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {copy.coreFieldsLabel}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {copy.coreFieldsDescription}
              </p>
            </div>
            <Tabs
              value={activeLocale}
              onValueChange={(value) => onActiveLocaleChange(value as AppLocale)}
              className="grid gap-4"
            >
              <TabsList className="w-full sm:w-auto">
                {appLocales.map((locale) => (
                  <TabsTrigger
                    key={locale}
                    value={locale}
                    className={cn(
                      localeHasProjectErrors(fieldErrors, locale) &&
                        'text-destructive data-[state=active]:text-destructive'
                    )}
                  >
                    {localeNames[locale]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {appLocales.map((locale) => {
                const titleError = getLocalizedProjectFieldError(fieldErrors, locale, 'title');
                const summaryError = getLocalizedProjectFieldError(fieldErrors, locale, 'summary');
                const descriptionError = getLocalizedProjectFieldError(
                  fieldErrors,
                  locale,
                  'description'
                );

                return (
                  <TabsContent key={locale} value={locale} className="mt-0">
                    <div className="grid gap-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <AdminFormField
                          label={copy.titleFieldLabel}
                          error={titleError}
                          description={copy.titleFieldDescription}
                        >
                          <Input
                            value={formValues.translations[locale].title}
                            onChange={(event) =>
                              onLocalizedFieldChange(locale, 'title', event.target.value)
                            }
                            placeholder={copy.titleFieldPlaceholder}
                            aria-invalid={Boolean(titleError)}
                          />
                        </AdminFormField>
                        <AdminFormField
                          label={copy.slugFieldLabel}
                          error={fieldErrors.slug}
                          description={copy.slugFieldDescription}
                        >
                          <Input
                            value={formValues.slug}
                            onChange={(event) => onFieldChange('slug', event.target.value)}
                            placeholder={copy.slugFieldPlaceholder}
                            aria-invalid={Boolean(fieldErrors.slug)}
                          />
                        </AdminFormField>
                      </div>

                      <AdminFormField
                        label={copy.summaryFieldLabel}
                        error={summaryError}
                        description={copy.summaryFieldDescription}
                      >
                        <Textarea
                          value={formValues.translations[locale].summary}
                          onChange={(event) =>
                            onLocalizedFieldChange(locale, 'summary', event.target.value)
                          }
                          placeholder={copy.summaryFieldPlaceholder}
                          className="min-h-28"
                          aria-invalid={Boolean(summaryError)}
                        />
                      </AdminFormField>

                      <AdminFormField
                        label={copy.descriptionFieldLabel}
                        error={descriptionError}
                        description={copy.descriptionFieldDescription}
                      >
                        <Textarea
                          value={formValues.translations[locale].description}
                          onChange={(event) =>
                            onLocalizedFieldChange(locale, 'description', event.target.value)
                          }
                          placeholder={copy.descriptionFieldPlaceholder}
                          className="min-h-44"
                          aria-invalid={Boolean(descriptionError)}
                        />
                      </AdminFormField>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </section>

          <section className="grid gap-5 border-t border-border pt-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {copy.linksSectionLabel}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {copy.linksSectionDescription}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminFormField
                label={copy.projectDateFieldLabel}
                error={fieldErrors.projectDate}
                description={copy.projectDateFieldDescription}
              >
                <Input
                  type="date"
                  value={formValues.projectDate}
                  onChange={(event) => onFieldChange('projectDate', event.target.value)}
                  aria-invalid={Boolean(fieldErrors.projectDate)}
                />
              </AdminFormField>
              <AdminFormField
                label={copy.liveUrlFieldLabel}
                error={fieldErrors.liveUrl}
                description={copy.liveUrlFieldDescription}
              >
                <Input
                  value={formValues.liveUrl}
                  onChange={(event) => onFieldChange('liveUrl', event.target.value)}
                  placeholder={copy.liveUrlFieldPlaceholder}
                  aria-invalid={Boolean(fieldErrors.liveUrl)}
                />
              </AdminFormField>
            </div>
            <AdminFormField
              label={copy.repositoryUrlFieldLabel}
              error={fieldErrors.repositoryUrl}
              description={copy.repositoryUrlFieldDescription}
            >
              <Input
                value={formValues.repositoryUrl}
                onChange={(event) => onFieldChange('repositoryUrl', event.target.value)}
                placeholder={copy.repositoryUrlFieldPlaceholder}
                aria-invalid={Boolean(fieldErrors.repositoryUrl)}
              />
            </AdminFormField>
          </section>

          <section className="grid gap-5 border-t border-border pt-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {copy.technologiesSectionLabel}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {copy.technologiesSectionDescription}
              </p>
            </div>
            <AdminFormField
              label={copy.technologyListLabel}
              error={fieldErrors.technologies}
              description={copy.technologyListDescription}
            >
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Input
                    value={technologyInput}
                    onChange={(event) => onTechnologyInputChange(event.target.value)}
                    onKeyDown={handleTechnologyKeyDown}
                    placeholder={copy.technologyInputPlaceholder}
                  />
                  <Button type="button" variant="outline" onClick={onAddTechnology}>
                    {copy.addTechnologyAction}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formValues.technologies.length > 0 ? (
                    formValues.technologies.map((technology) => (
                      <button
                        key={technology}
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                        onClick={() => onRemoveTechnology(technology)}
                      >
                        {technology}
                        <X className="size-3.5" />
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">{copy.noTechnologiesAdded}</p>
                  )}
                </div>
              </div>
            </AdminFormField>
          </section>

          <section className="grid gap-5 border-t border-border pt-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {copy.publishingSectionLabel}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {copy.publishingSectionDescription}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminToggleField
                label={copy.publishedFieldLabel}
                description={copy.publishedFieldDescription}
                checked={formValues.published}
                onCheckedChange={(checked) => onFieldChange('published', checked)}
              />
              <AdminToggleField
                label={copy.featuredFieldLabel}
                description={copy.featuredFieldDescription}
                checked={formValues.featured}
                onCheckedChange={(checked) => onFieldChange('featured', checked)}
              />
            </div>
            <AdminFormField
              label={copy.displayOrderFieldLabel}
              error={fieldErrors.displayOrder}
              description={copy.displayOrderFieldDescription}
            >
              <Input
                value={formValues.displayOrder}
                onChange={(event) => onFieldChange('displayOrder', event.target.value)}
                inputMode="numeric"
                placeholder={copy.displayOrderFieldPlaceholder}
                aria-invalid={Boolean(fieldErrors.displayOrder)}
              />
            </AdminFormField>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-8">
            <p className="text-sm leading-6 text-muted-foreground">{copy.payloadHint}</p>
            <Button type="submit" size="lg" disabled={saving || uploading}>
              {saving
                ? isEditing
                  ? copy.savingProjectAction
                  : copy.creatingProjectAction
                : isEditing
                  ? copy.saveChangesAction
                  : copy.createProjectAction}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
