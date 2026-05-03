import Link from "next/link";
import { ArrowUpRight, Code2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProjectDescriptionParagraphs } from "../../lib/portfolio-selectors";
import { formatProjectDate } from "../../lib/portfolio-formatters";
import { localeTags, type AppLocale } from "../../i18n/routing";
import type { PortfolioDictionary } from "../../i18n/types";
import type { PortfolioProject } from "../../model/types";

interface ProjectContentProps {
  locale: AppLocale;
  dictionary: PortfolioDictionary;
  project: PortfolioProject;
}

export function ProjectContent({
  locale,
  dictionary,
  project,
}: ProjectContentProps) {
  const descriptionParagraphs = getProjectDescriptionParagraphs(
    project.description,
  );
  const projectLinks: Array<{
    href: string;
    label: string;
    icon: React.ReactNode;
  }> = [];

  if (project.liveUrl) {
    projectLinks.push({
      href: project.liveUrl,
      label: dictionary.project.liveTitle,
      icon: <Globe className="size-4" />,
    });
  }

  if (project.repositoryUrl) {
    projectLinks.push({
      href: project.repositoryUrl,
      label: dictionary.project.repositoryTitle,
      icon: <Code2 className="size-4" />,
    });
  }
  const localizedProjectDate = formatProjectDate(
    project.projectDate,
    localeTags[locale],
  );

  return (
    <section id="overview" className="anchor-target">
      <div className="section-divider" />
      <div className="grid gap-8 pt-16 xl:grid-cols-[minmax(0,1.05fr)_22rem]">
        <div className="grid gap-6">
          <Card variant="solid">
            <CardHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {dictionary.project.overviewTitle}
              </p>
              <CardTitle className="mt-3 text-3xl sm:text-4xl">
                {dictionary.project.summaryTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <p className="text-base leading-8 text-foreground/90">
                {project.summary}
              </p>
            </CardContent>
          </Card>

          <Card variant="solid">
            <CardHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
              <CardTitle className="text-2xl">
                {dictionary.project.descriptionTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              {descriptionParagraphs.length > 0 ? (
                <div className="grid gap-5">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p
                      key={`${paragraph.slice(0, 24)}-${index}`}
                      className="text-base leading-8 text-foreground/90"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-base leading-8 text-muted-foreground">
                  {dictionary.project.noDescription}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="grid gap-5">
          <Card variant="solid">
            <CardContent className="p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {dictionary.project.stackTitle}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.technologies.length > 0 ? (
                  project.technologies.map((technology) => (
                    <Badge key={technology} variant="outline">
                      {technology}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">
                    {dictionary.common.noTechnologies}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {projectLinks.length > 0 ? (
            <section id="links" className="anchor-target">
              <Card variant="solid">
                <CardContent className="p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {dictionary.project.linksTitle}
                  </p>
                  <div className="mt-5 grid gap-3">
                    {projectLinks.map((link) => (
                      <ProjectLinkButton
                        key={link.label}
                        href={link.href}
                        label={link.label}
                        icon={link.icon}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          ) : null}

          <section id="timeline" className="anchor-target">
            <Card variant="solid">
              <CardContent className="p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {dictionary.project.timelineTitle}
                </p>
                <dl className="mt-5 grid gap-4">
                  <Fact
                    label={dictionary.project.projectDateTitle}
                    value={
                      localizedProjectDate ?? dictionary.project.noProjectDate
                    }
                  />
                </dl>
              </CardContent>
            </Card>
          </section>
        </aside>
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}

function ProjectLinkButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Button asChild variant="outline" className="w-full justify-between">
      <Link href={href} target="_blank" rel="noreferrer">
        <span className="inline-flex items-center gap-2">
          {icon}
          {label}
        </span>
        <ArrowUpRight className="size-4" />
      </Link>
    </Button>
  );
}
