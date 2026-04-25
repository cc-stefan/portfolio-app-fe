import { Layers3, Sparkles, Workflow, type LucideIcon } from "lucide-react";

export interface HomeSystemNote {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const homeSystemNotes: HomeSystemNote[] = [
  {
    title: "Server-first rendering",
    description:
      "Next 16 fetches the published portfolio entries on the server, so the frontend stays thin and SEO-ready.",
    icon: Sparkles,
  },
  {
    title: "Shared source of truth",
    description:
      "Projects are defined in the NestJS backend. No duplicated frontend content file needs to stay in sync.",
    icon: Layers3,
  },
  {
    title: "Admin-ready foundation",
    description:
      "The public UI is wired now, and the same backend already exposes auth, uploads, and admin project management.",
    icon: Workflow,
  },
];
