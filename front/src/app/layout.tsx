// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthContext';

export const metadata: Metadata = {
    title: 'IT-Jobs Search',
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="ru" suppressHydrationWarning>
        <body className="min-h-screen"
              suppressHydrationWarning>
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}
