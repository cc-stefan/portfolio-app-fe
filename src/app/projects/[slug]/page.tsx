import type { Metadata } from "next";
import { getPortfolioProjectMetadata } from "@/features/portfolio/server/portfolio-metadata";
import { PortfolioProjectScreen } from "@/features/portfolio/screens/project-screen";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  return getPortfolioProjectMetadata(slug);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  return <PortfolioProjectScreen slug={slug} />;
}
