import type { Metadata } from "next";
import "./globals.css";

const metadataBase = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
})();

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Portfolio Frontend",
    template: "%s | Portfolio Frontend",
  },
  description:
    "Modern Next.js frontend for portfolio-app-be, rendering published projects from the NestJS API.",
  applicationName: "Portfolio Frontend",
  openGraph: {
    title: "Portfolio Frontend",
    description:
      "A modern portfolio UI backed by the portfolio-app-be NestJS API.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Frontend",
    description:
      "A modern portfolio UI backed by the portfolio-app-be NestJS API.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full overflow-x-clip bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
