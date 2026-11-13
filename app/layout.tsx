import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { Toast } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'BoostForge',
  description: 'GCash payment verification and credit-based social media boosting.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toast />
      </body>
    </html>
  );
}
