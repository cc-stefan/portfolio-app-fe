import type { Metadata } from "next";
import { PortfolioHomeScreen } from "@/features/portfolio/screens/home-screen";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Server-rendered portfolio frontend that reads published project data from portfolio-app-be.",
};

export default async function Home() {
  return <PortfolioHomeScreen />;
}
