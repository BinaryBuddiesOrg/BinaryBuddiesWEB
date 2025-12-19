import { Metadata } from 'next';
import { generateStaticPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateStaticPageMetadata(
    'Portfolio - Our Projects',
    'Explore our portfolio of successful projects. See how Binary Buddies has helped businesses transform with AI, automation, and custom software solutions.',
    '/portfolio',
    ['portfolio', 'projects', 'case studies', 'our work', 'success stories']
);

export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
