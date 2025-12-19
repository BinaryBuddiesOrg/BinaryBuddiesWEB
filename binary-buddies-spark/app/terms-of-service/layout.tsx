import { Metadata } from 'next';
import { generateStaticPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateStaticPageMetadata(
    'Terms of Service',
    'Binary Buddies Terms of Service. Read our terms and conditions for using our website, products, and services.',
    '/terms-of-service',
    ['terms of service', 'terms and conditions', 'legal', 'user agreement']
);

export default function TermsOfServiceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
