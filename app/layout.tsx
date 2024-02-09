import type { Metadata } from 'next';

import { ConsoleOutputProvider } from '@/lib/useConsole';
import { TransitionsProvider } from '@/lib/useTransitions';
import { inter } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Terravision UI',
  description: 'Visualize your terraform infrastructure with ease.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConsoleOutputProvider>
          <TransitionsProvider>{children}</TransitionsProvider>
        </ConsoleOutputProvider>
      </body>
    </html>
  );
}
