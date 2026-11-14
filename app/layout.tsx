import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'BoostForge — Make your next big moment happen',
  description: 'A simple creator growth toolkit. Top up with GCash, choose your boost, and keep creating while BoostForge handles the rest.',
};

export const viewport: Viewport = {
  themeColor: '#fcfdfb',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
