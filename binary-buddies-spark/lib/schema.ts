import type { ApiBlogPost } from '@/types/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://binarybuddies.in';

export interface BlogPostingSchema {
    '@context': string;
    '@type': string;
    headline: string;
    description: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
    author: {
        '@type': string;
        name: string;
    };
    publisher: {
        '@type': string;
        name: string;
        logo: {
            '@type': string;
            url: string;
        };
    };
    mainEntityOfPage: {
        '@type': string;
        '@id': string;
    };
}

export interface OrganizationSchema {
    '@context': string;
    '@type': string;
    name: string;
    url: string;
    logo: string;
    description: string;
    contactPoint?: {
        '@type': string;
        telephone?: string;
        contactType: string;
        email?: string;
    };
    sameAs?: string[];
}

export interface BreadcrumbListSchema {
    '@context': string;
    '@type': string;
    itemListElement: Array<{
        '@type': string;
        position: number;
        name: string;
        item?: string;
    }>;
}

export interface ProductSchema {
    '@context': string;
    '@type': string;
    name: string;
    description: string;
    image?: string;
    brand: {
        '@type': string;
        name: string;
    };
    offers?: {
        '@type': string;
        priceCurrency: string;
        availability: string;
    };
}

export function generateBlogPostingSchema(post: ApiBlogPost): BlogPostingSchema {
    const url = `${SITE_URL}/blog/${post.slug}`;
    const image = post.og_image || post.image || `${SITE_URL}/logo.jpg`;

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: image,
        datePublished: post.date,
        dateModified: post.date,
        author: {
            '@type': 'Person',
            name: post.author.name,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Binary Buddies',
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.jpg`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
    };
}

export function generateOrganizationSchema(): OrganizationSchema {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Binary Buddies',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.jpg`,
        description: 'Expert software development, AI/ML solutions, web and mobile app development.',
        sameAs: [
            // Add social media links here if available
            // 'https://www.linkedin.com/company/binarybuddies',
            // 'https://twitter.com/binarybuddies',
        ],
    };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): BreadcrumbListSchema {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function generateProductSchema(
    name: string,
    description: string,
    image?: string
): ProductSchema {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description,
        image: image || `${SITE_URL}/logo.jpg`,
        brand: {
            '@type': 'Brand',
            name: 'Binary Buddies',
        },
    };
}

export interface ServiceSchema {
    '@context': string;
    '@type': string;
    serviceType: string;
    provider: {
        '@type': string;
        name: string;
        url: string;
    };
    areaServed?: {
        '@type': string;
        name: string;
    };
    description: string;
}

export function generateServiceSchema(
    serviceType: string,
    description: string,
    areaServed: string = 'Worldwide'
): ServiceSchema {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType,
        provider: {
            '@type': 'Organization',
            name: 'Binary Buddies',
            url: SITE_URL,
        },
        areaServed: {
            '@type': 'Country',
            name: areaServed,
        },
        description,
    };
}
