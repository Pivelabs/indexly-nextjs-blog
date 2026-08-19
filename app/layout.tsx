import "./globals.css";

import type { Metadata } from "next";
import { Inter as FontSans, Inter as FontDisplay } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/nav/mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { mainMenu, contentMenu } from "@/menu.config";
import { Section, Container } from "@/components/craft";
import { Analytics } from "@vercel/analytics/react";
import { siteConfig } from "@/site.config";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { blogConfig } from "@/lib/blog-config";

const font = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontDisplay = FontDisplay({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: blogConfig.brandName,
  description: blogConfig.metaDescription,
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen font-sans antialiased bg-olive-50 text-olive-700",
          font.variable,
          fontDisplay.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

interface NavProps {
  className?: any;
  children?: React.ReactNode;
  id?: any;
}

const Nav = ({ className, children, id }: NavProps) => {
  return (
    <nav
      className={cn("sticky z-50 top-0 bg-background", "border-b", className)}
      id={id}
    >
      <div
        id="nav-container"
        className="max-w-6xl mx-auto py-4 px-6 sm:px-8 flex justify-between items-center"
      >
        <Link
          className="hover:opacity-75 transition-all flex gap-2 items-center"
          href={blogConfig.websiteUrl}
          target="_blank"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 overflow-hidden">
            <Image
              src={blogConfig.logoUrl || "/favicon.ico"}
              alt={blogConfig.brandName + " logo"}
              width={32}
              height={32}
              className="h-8 w-8 object-contain rounded-full"
              unoptimized
            />
          </span>
          <div className="text-lg font-medium">{blogConfig.brandName}</div>
        </Link>
        {children}
        <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex">
            {Object.entries(mainMenu).map(([key, href]) => (
              <Button key={href} asChild variant="ghost" size="sm">
                <Link href={href}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              </Button>
            ))}
          </div>
          <Button asChild size="sm" className="flex">
            <Link
              href={blogConfig.signupUrl}
              target="_blank"
              className="bg-indigo-600"
            >
              Get Started
            </Link>
          </Button>
          <MobileNav
            brandName={blogConfig.brandName}
            websiteUrl={blogConfig.websiteUrl}
            signupUrl={blogConfig.signupUrl}
          />
        </div>
      </div>
    </nav>
  );
};

const date = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="py-4 text-center items-center justify-center">
      <div className="p-4 border-t mx-auto text-center items-center justify-center">
        <div className="flex flex-row gap-6 not-prose text-center items-center justify-center">
          <div className="sr-only text-lg font-medium">
            {blogConfig.brandName}
          </div>
          <div className="text-muted-foreground">
            &copy; <a href={blogConfig.websiteUrl} target="_blank">
              {blogConfig.brandName} {date}
            </a>. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
