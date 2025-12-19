import { Metadata } from 'next';
import { generateStaticPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateStaticPageMetadata(
    'Careers - Join Our Team',
    'Explore exciting career opportunities at Binary Buddies. Join our team of talented developers, engineers, and innovators working on cutting-edge AI and software solutions.',
    '/careers',
    ['careers', 'jobs', 'hiring', 'employment', 'software jobs', 'AI jobs', 'developer jobs']
);

export default function CareersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
