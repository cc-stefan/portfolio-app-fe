import "server-only";
import type { Metadata } from "next";
import { getProjectBySlug } from "./portfolio-api";

export async function getPortfolioProjectMetadata(
  slug: string,
): Promise<Metadata> {
  const projectResult = await getProjectBySlug(slug);

  if (!projectResult.data) {
    return {
      title: "Project unavailable",
      description: "The portfolio backend could not return this project.",
    };
  }

  return {
    title: projectResult.data.title,
    description: projectResult.data.summary,
    openGraph: {
      title: projectResult.data.title,
      description: projectResult.data.summary,
      images: projectResult.data.coverImageUrl
        ? [projectResult.data.coverImageUrl]
        : undefined,
    },
  };
}
