import { Metadata } from 'next';
import { generateServiceMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateServiceMetadata(
    'AI & ML Development',
    'Cutting-edge AI and machine learning solutions including chatbots, computer vision, NLP, predictive analytics, and custom AI models.',
    ['machine learning', 'artificial intelligence', 'ML models', 'chatbots', 'NLP', 'computer vision', 'predictive analytics']
);

export default function AIMLDevelopmentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
