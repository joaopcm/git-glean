import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--body-font' });

export const metadata: Metadata = {
  title: 'GitGlean',
  description:
    'Instantly search and extract top documents from public repositories with unparalleled ease and precision.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen antialiased', inter.className)}>
        {children}
      </body>
    </html>
  );
}
