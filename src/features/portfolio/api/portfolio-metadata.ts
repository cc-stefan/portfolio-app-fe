import "server-only";
import type { Metadata } from "next";
import type { PortfolioDictionary } from "../i18n/types";
import { getPortfolioApiOrigin, getProjectBySlug } from "./portfolio-api";
import { resolvePortfolioAssetUrl } from "../lib/resolve-portfolio-asset-url";

export async function getPortfolioProjectMetadata(
  slug: string,
  dictionary: PortfolioDictionary,
): Promise<Metadata> {
  const projectResult = await getProjectBySlug(slug);

  if (!projectResult.data) {
    return {
      title: dictionary.meta.projectUnavailableTitle,
      description: dictionary.meta.projectUnavailableDescription,
    };
  }

  const coverImageUrl = resolvePortfolioAssetUrl(
    projectResult.data.coverImageUrl,
    getPortfolioApiOrigin(),
  );

  return {
    title: projectResult.data.title,
    description: projectResult.data.summary,
    openGraph: {
      title: projectResult.data.title,
      description: projectResult.data.summary,
      images: coverImageUrl ? [coverImageUrl] : undefined,
    },
  };
}
