import Link from "next/link";
import { ArrowUpRight, Code2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PortfolioDictionary } from "../../i18n/types";
import type { PortfolioProject } from "../../model/types";

interface ProjectContentProps {
  dictionary: PortfolioDictionary;
  project: PortfolioProject;
  paragraphs: string[];
}

export function ProjectContent({
  dictionary,
  project,
  paragraphs,
}: ProjectContentProps) {
  return (
    <section id="details" className="anchor-target">
      <div className="section-divider" />
      <div className="grid gap-8 pt-16 xl:grid-cols-[minmax(0,1.05fr)_22rem]">
        <Card variant="solid">
          <CardHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {dictionary.project.overviewTitle}
            </p>
            <CardTitle className="mt-3 text-3xl sm:text-4xl">
              {dictionary.project.summaryTitle}
            </CardTitle>
            <CardDescription className="mt-3 max-w-3xl text-base leading-8">
              {dictionary.project.overviewDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="grid gap-6">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={`${paragraph.slice(0, 24)}-${index}`}
                  className="text-base leading-8 text-foreground/90"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

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
                  <Badge variant="outline">{dictionary.common.noTechnologies}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card variant="solid">
            <CardContent className="p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {dictionary.project.linksTitle}
              </p>
              <div className="mt-5 grid gap-3">
                {project.liveUrl ? (
                  <Button asChild variant="outline" className="justify-between">
                    <Link href={project.liveUrl} target="_blank" rel="noreferrer">
                      <span className="inline-flex items-center gap-2">
                        <Globe className="size-4" />
                        {dictionary.actions.live}
                      </span>
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                ) : null}
                {project.repositoryUrl ? (
                  <Button asChild variant="outline" className="justify-between">
                    <Link
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Code2 className="size-4" />
                        {dictionary.actions.code}
                      </span>
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <section id="delivery" className="anchor-target">
            <div className="section-divider" />
            <div className="pt-5">
              <Card variant="solid">
                <CardContent className="p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {dictionary.project.deliveryTitle}
                  </p>
                  <div className="mt-5 grid gap-3">
                    {dictionary.project.deliveryCards.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-xl border border-border bg-secondary p-4"
                      >
                        <h3 className="text-sm font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
