import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import CookieConsent from '@/components/CookieConsent';
import { SchemaMarkup } from '@/components/SEO/SchemaMarkup';
import { generateOrganizationSchema } from '@/lib/schema';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Binary Buddies - AI & Software Solutions',
    description: 'Expert software development, AI/ML solutions, web and mobile app development.',
    keywords: ['software development', 'AI', 'machine learning', 'web development', 'mobile apps'],
};

const organizationSchema = generateOrganizationSchema();

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <SchemaMarkup schema={organizationSchema} />
                <Providers>
                    <Navbar />
                    {children}
                    <CookieConsent />
                    <Toaster />
                    <Sonner />
                </Providers>
            </body>
        </html>
    );
}
