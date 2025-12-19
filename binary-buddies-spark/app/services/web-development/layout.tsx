import { Metadata } from 'next';
import { generateServiceMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateServiceMetadata(
    'Web Development',
    'Expert web development services including frontend, backend, full-stack, e-commerce, and PWA solutions. Modern technologies and responsive design.',
    ['frontend development', 'backend development', 'full-stack', 'e-commerce', 'PWA', 'React', 'Next.js', 'Node.js']
);

export default function WebDevelopmentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
