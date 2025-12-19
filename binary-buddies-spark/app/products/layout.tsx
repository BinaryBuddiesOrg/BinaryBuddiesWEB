import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://binarybuddies.in';

export const metadata: Metadata = {
    title: 'Our Products | Binary Buddies',
    description: 'Explore our innovative products including AI chatbots, automation tools, and software solutions designed to transform your business.',
    keywords: ['products', 'AI chatbot', 'software products', 'automation tools', 'business solutions'],
    alternates: {
        canonical: `${SITE_URL}/products`,
    },
    openGraph: {
        title: 'Our Products | Binary Buddies',
        description: 'Explore our innovative products including AI chatbots, automation tools, and software solutions.',
        url: `${SITE_URL}/products`,
        siteName: 'Binary Buddies',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Our Products | Binary Buddies',
        description: 'Explore our innovative products including AI chatbots, automation tools, and software solutions.',
    },
};

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
