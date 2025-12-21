import { Metadata } from 'next';
import { generateServiceMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateServiceMetadata(
    'Software Development',
    'Custom software development solutions including enterprise applications, cloud solutions, microservices, and scalable software architecture.',
    ['enterprise software', 'cloud solutions', 'microservices', 'software architecture', 'custom software']
);

export default function SoftwareDevelopmentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

