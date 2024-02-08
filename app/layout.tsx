import type { Metadata } from 'next';
import { Fira_Code, Inter } from 'next/font/google';

import { ConsoleOutputProvider } from '@/lib/useConsole';
import { TransitionsProvider } from '@/lib/useTransitions';
import './globals.css';

export const inter = Inter({ subsets: ['latin'] });
export const firaCode = Fira_Code({ subsets: ['latin'] });

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
