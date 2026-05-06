import "server-only";
import type { Metadata } from "next";
import type { PortfolioDictionary } from "../i18n/types";
import type { AppLocale } from "../i18n/routing";
import { getPortfolioApiOrigin, getProjectBySlug } from "./portfolio-api";
import { resolvePortfolioAssetUrl } from "../lib/resolve-portfolio-asset-url";

export async function getPortfolioProjectMetadata(
  slug: string,
  locale: AppLocale,
  dictionary: PortfolioDictionary,
): Promise<Metadata> {
  const projectResult = await getProjectBySlug(slug, locale);

  if (!projectResult.data) {
    return {
      title: dictionary.meta.projectUnavailableTitle,
      description: dictionary.meta.projectUnavailableDescription,
    };
  }

  const imageUrl = resolvePortfolioAssetUrl(
    projectResult.data.imageUrl,
    getPortfolioApiOrigin(),
  );

  return {
    title: projectResult.data.title,
    description: projectResult.data.summary,
    openGraph: {
      title: projectResult.data.title,
      description: projectResult.data.summary,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}
