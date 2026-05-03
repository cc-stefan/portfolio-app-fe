import type {Metadata} from "next";
import localFont from "next/font/local";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {Toaster} from "@/components/ui/sonner";
import {defaultLocale, isAppLocale} from "@/features/portfolio/i18n/routing";
import "./globals.css";

const geistSans = localFont({
  src: "../../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../../node_modules/next/dist/next-devtools/server/font/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

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
    default: "Portfolio",
    template: "%s | Portfolio",
  },
  description:
    "A premium portfolio frontend powered by a live backend API and a production-grade design system.",
  applicationName: "Portfolio",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang?: string }> }>) {
  const {lang} = await params;
  const htmlLang = isAppLocale(lang ?? "") ? lang : defaultLocale;

  return (
    <html
      lang={htmlLang}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors closeButton/>
        </ThemeProvider>
      </body>
    </html>
  );
}
