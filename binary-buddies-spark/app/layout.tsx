import type { Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import CookieConsent from '@/components/CookieConsent';
import { SchemaMarkup } from '@/components/SEO/SchemaMarkup';
import { generateOrganizationSchema } from '@/lib/schema';

const inter = Inter({ subsets: ['latin'] });
const lexend = Lexend({
    subsets: ['latin'],
    variable: '--font-lexend',
});

export const metadata: Metadata = {
    title: 'Binary Buddies - AI & Software Solutions',
    description: 'Expert software development, AI/ML solutions, web and mobile app development.',
    keywords: ['software development', 'AI', 'machine learning', 'web development', 'mobile apps'],
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
};

const organizationSchema = generateOrganizationSchema();

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} ${lexend.variable}`}>
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
