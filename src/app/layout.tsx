import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="md:container md:mx-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
