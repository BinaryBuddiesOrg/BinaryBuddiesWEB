import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://binarybuddies.in';

export const metadata: Metadata = {
    title: 'AI Chatbot - 24/7 Customer Support Solution | Binary Buddies',
    description: 'Integrate a powerful AI chatbot into any website in 2 minutes. Boost conversions, automate support, and delight customers 24/7. Multi-platform integration, custom branding, and analytics dashboard.',
    keywords: ['AI chatbot', 'customer support chatbot', 'website chatbot', 'AI assistant', 'chatbot integration', 'automated support', 'conversational AI'],
    alternates: {
        canonical: `${SITE_URL}/products/chatbot`,
    },
    openGraph: {
        title: 'AI Chatbot - 24/7 Customer Support Solution | Binary Buddies',
        description: 'Integrate a powerful AI chatbot into any website in 2 minutes. Boost conversions and automate support.',
        url: `${SITE_URL}/products/chatbot`,
        siteName: 'Binary Buddies',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AI Chatbot - 24/7 Customer Support Solution | Binary Buddies',
        description: 'Integrate a powerful AI chatbot into any website in 2 minutes. Boost conversions and automate support.',
    },
};

export default function ChatbotLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
