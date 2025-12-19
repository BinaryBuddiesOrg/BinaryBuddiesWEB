import { Metadata } from 'next';
import { generateStaticPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateStaticPageMetadata(
    'Contact Us - Get in Touch',
    'Get in touch with Binary Buddies for your software development, AI/ML, and automation needs. We\'re here to help transform your business with cutting-edge technology solutions.',
    '/contact',
    ['contact', 'get in touch', 'contact us', 'reach out', 'inquiry']
);

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
