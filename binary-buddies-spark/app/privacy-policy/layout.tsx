import { Metadata } from 'next';
import { generateStaticPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateStaticPageMetadata(
    'Privacy Policy',
    'Binary Buddies Privacy Policy. Learn how we collect, use, and protect your personal information when you use our services and website.',
    '/privacy-policy',
    ['privacy policy', 'data protection', 'privacy', 'data security']
);

export default function PrivacyPolicyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

