import { MetricCard } from "../../components/metric-card";
import type { PortfolioDictionary } from "../../i18n/types";
import type {
  ApiResult,
  PortfolioHealth,
  PortfolioProject,
} from "../../model/types";

interface HomeMetricsProps {
  copy: PortfolioDictionary["home"];
  healthResult: ApiResult<PortfolioHealth>;
  projects: PortfolioProject[];
  featuredProjects: PortfolioProject[];
  technologies: string[];
  apiBaseUrl: string;
}

export function HomeMetrics({
  copy,
  healthResult,
  projects,
  featuredProjects,
  technologies,
  apiBaseUrl,
}: HomeMetricsProps) {
  const isOnline = healthResult.ok && healthResult.data?.status.toLowerCase() === "ok";
  const statusLabel =
    healthResult.status === null
      ? copy.statusUnavailable
      : isOnline
        ? copy.statusOnline
        : copy.statusOffline;

  return (
    <section
      aria-label="Portfolio metrics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <MetricCard
        label={copy.metrics.projects}
        value={projects.length.toString().padStart(2, "0")}
        detail={copy.showcaseLabel}
      />
      <MetricCard
        label={copy.metrics.featured}
        value={featuredProjects.length.toString().padStart(2, "0")}
        detail={copy.featuredTab}
        tone="accent"
      />
      <MetricCard
        label={copy.metrics.technologies}
        value={technologies.length.toString().padStart(2, "0")}
        detail={technologies.slice(0, 4).join(", ") || copy.metrics.technologies}
      />
      <MetricCard
        label={copy.metrics.status}
        value={statusLabel}
        detail={apiBaseUrl}
        tone={isOnline ? "success" : "warning"}
      />
    </section>
  );
}
