"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useAdminAuth } from "@/features/admin/auth/use-admin-auth";
import { localizeHref, type AppLocale } from "../i18n/routing";

interface AdminPanelButtonProps {
  locale: AppLocale;
  label: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}

export function AdminPanelButton({
  locale,
  label,
  variant = "outline",
  size = "sm",
  className,
}: AdminPanelButtonProps) {
  const { status } = useAdminAuth();

  if (status !== "authenticated") {
    return null;
  }

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={localizeHref(locale, "/admin")}>
        <LayoutDashboard className="size-4" />
        {label}
      </Link>
    </Button>
  );
}
