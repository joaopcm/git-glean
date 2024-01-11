import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GitGlean",
  description:
    "Harness the Power of GitHub Insights. Instantly search, analyze, and extract top documents from public repositories with unparalleled ease and precision.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-neutral-950 font-sans antialiased",
          inter.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
