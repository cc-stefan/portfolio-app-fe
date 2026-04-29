"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckBig,
  Info,
  LoaderCircle,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";

export function Toaster(props: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      icons={{
        success: <CircleCheckBig className="size-4" />,
        info: <Info className="size-4" />,
        warning: <TriangleAlert className="size-4" />,
        error: <OctagonAlert className="size-4" />,
        loading: <LoaderCircle className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-border bg-popover text-popover-foreground shadow-[var(--surface-shadow-lg)]",
          title: "text-sm font-semibold",
          description: "text-sm text-muted-foreground",
          actionButton:
            "rounded-lg bg-primary px-4 text-primary-foreground hover:brightness-105",
          cancelButton:
            "rounded-lg border border-border bg-secondary px-4 text-foreground",
          closeButton:
            "border-border bg-background text-muted-foreground hover:text-foreground",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--popover)",
          "--success-text": "var(--popover-foreground)",
          "--success-border": "var(--border)",
          "--error-bg": "var(--popover)",
          "--error-text": "var(--popover-foreground)",
          "--error-border": "var(--border)",
          "--warning-bg": "var(--popover)",
          "--warning-text": "var(--popover-foreground)",
          "--warning-border": "var(--border)",
          "--info-bg": "var(--popover)",
          "--info-text": "var(--popover-foreground)",
          "--info-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
