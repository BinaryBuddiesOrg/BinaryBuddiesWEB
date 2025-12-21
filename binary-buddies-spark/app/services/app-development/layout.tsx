import { Metadata } from 'next';
import { generateServiceMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateServiceMetadata(
    'Mobile App Development',
    'Professional mobile app development for iOS and Android. Native and cross-platform apps using React Native, Flutter, Swift, and Kotlin.',
    ['iOS development', 'Android development', 'React Native', 'Flutter', 'native apps', 'cross-platform']
);

export default function AppDevelopmentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

