import { Badge } from "@/components/ui/badge";
import type { ApiResult, PortfolioHealth } from "../model/types";

interface BackendStatusPillProps {
  result: ApiResult<PortfolioHealth>;
  onlineLabel: string;
  offlineLabel: string;
  unavailableLabel: string;
}

export function BackendStatusPill({
  result,
  onlineLabel,
  offlineLabel,
  unavailableLabel,
}: BackendStatusPillProps) {
  const isOnline = result.ok && result.data?.status.toLowerCase() === "ok";
  const label =
    result.status === null
      ? unavailableLabel
      : isOnline
        ? onlineLabel
        : offlineLabel;

  return (
    <Badge
      variant={isOnline ? "success" : "warning"}
      className="hidden lg:inline-flex"
    >
      <span
        className={
          isOnline
            ? "size-2 rounded-full bg-emerald-500"
            : "size-2 rounded-full bg-amber-500"
        }
      />
      {label}
    </Badge>
  );
}
