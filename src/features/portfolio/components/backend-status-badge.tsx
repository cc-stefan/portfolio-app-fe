import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiResult, PortfolioHealth } from "../model/types";

interface BackendStatusBadgeProps {
  result: ApiResult<PortfolioHealth>;
  className?: string;
  compact?: boolean;
}

export function BackendStatusBadge({
  result,
  className,
  compact = false,
}: BackendStatusBadgeProps) {
  const isOnline = result.ok && result.data?.status === "ok";
  const Icon = isOnline ? Wifi : WifiOff;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] backdrop-blur-sm",
        isOnline
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950"
          : "border-amber-600/25 bg-amber-200/55 text-amber-950",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-full border",
          isOnline
            ? "border-emerald-500/25 bg-emerald-500/15"
            : "border-amber-600/20 bg-amber-500/10",
        )}
      >
        <Icon className="size-3.5" />
      </span>
      <span>{isOnline ? "API online" : "API offline"}</span>
      {!compact ? (
        <span
          className={cn(
            "hidden text-[10px] tracking-[0.18em] md:inline",
            isOnline ? "text-emerald-950/70" : "text-amber-950/75",
          )}
        >
          {isOnline
            ? result.data?.service ?? "portfolio-api"
            : "backend unavailable"}
        </span>
      ) : null}
    </div>
  );
}
