import { ArrowLeft } from "lucide-react";
import { ActionLink } from "../../components/action-link";

interface ProjectUnavailableStateProps {
  errorMessage?: string | null;
}

export function ProjectUnavailableState({
  errorMessage,
}: ProjectUnavailableStateProps) {
  return (
    <section className="mx-auto flex max-w-3xl flex-1 flex-col justify-center py-20">
      <p className="text-xs font-medium uppercase tracking-[0.32em] text-foreground/45">
        Project unavailable
      </p>
      <h1 className="mt-5 text-balance text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl">
        This case study could not be loaded from the backend.
      </h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">
        {errorMessage ??
          "The project endpoint did not return data for this request."}
      </p>
      <div className="mt-8 rounded-[2rem] border border-amber-600/20 bg-amber-100/60 p-6 text-sm leading-7 text-amber-950/85">
        Start <code>portfolio-app-be</code> on port <code>3001</code> or update{" "}
        <code>PORTFOLIO_API_BASE_URL</code> in the frontend.
      </div>
      <div className="mt-8">
        <ActionLink
          href="/"
          icon={<ArrowLeft className="size-4" />}
          iconPosition="start"
        >
          Back home
        </ActionLink>
      </div>
    </section>
  );
}
