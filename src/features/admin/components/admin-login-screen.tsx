"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/features/portfolio/components/theme-toggle";
import { localizeHref, type AppLocale } from "@/features/portfolio/i18n/routing";
import { useAdminAuth } from "../auth/use-admin-auth";

interface AdminLoginScreenProps {
  lang: AppLocale;
}

export function AdminLoginScreen({ lang }: AdminLoginScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearAccessDenied, login, status } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const nextParam = searchParams.get("next");
  const nextHref =
    nextParam && nextParam.startsWith("/")
      ? nextParam
      : localizeHref(lang, "/admin");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(nextHref);
    }
  }, [nextHref, router, status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    clearAccessDenied();

    const result = await login(email, password);

    if (!result.ok) {
      setError(result.error ?? "Unable to sign in");
      setSubmitting(false);
      return;
    }

    router.replace(nextHref);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-page flex min-h-screen flex-col py-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Portfolio Admin</p>
            <p className="text-sm text-muted-foreground">
              Sign in with an ADMIN account to manage projects.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={localizeHref(lang, "/")}>Back to portfolio</Link>
            </Button>
            <ThemeToggle label="Theme" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <Card variant="solid" className="w-full max-w-md">
            <CardContent className="grid gap-6 p-6 sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Admin access
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-foreground">
                  Login
                </h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  This area uses Bearer token auth with refresh rotation, matching the backend contract exactly.
                </p>
              </div>

              {error ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-1.5">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@company.com"
                    required
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <Button type="submit" size="lg" disabled={submitting || status === "loading"}>
                  {submitting ? "Signing in..." : "Sign in"}
                  <ArrowRight className="size-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
