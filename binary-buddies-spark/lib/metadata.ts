/**
 * Metadata Helper Functions
 * Reusable functions for generating SEO metadata across pages
 */

import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://binarybuddies.in';
const SITE_NAME = 'Binary Buddies';

export interface PageMetadata {
    title: string;
    description: string;
    keywords?: string[];
    path: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    publishedTime?: string;
    authors?: string[];
}

/**
 * Generate complete metadata object for a page
 */
export function generatePageMetadata({
    title,
    description,
    keywords,
    path,
    image,
    type = 'website',
    publishedTime,
    authors,
}: PageMetadata): Metadata {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;
    const ogImage = image || `${SITE_URL}/logo.jpg`;

    return {
        title: fullTitle,
        description: description.substring(0, 160), // Limit to 160 chars for SEO
        keywords: keywords,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: fullTitle,
            description: description.substring(0, 200),
            url,
            siteName: SITE_NAME,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type: type === 'article' ? 'article' : 'website',
            ...(publishedTime && { publishedTime }),
            ...(authors && authors.length > 0 && { authors }),
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description: description.substring(0, 200),
            images: [ogImage],
        },
    };
}

/**
 * Generate service page metadata
 */
export function generateServiceMetadata(
    serviceName: string,
    description: string,
    keywords: string[] = []
): Metadata {
    return generatePageMetadata({
        title: `${serviceName} Services`,
        description,
        keywords: [
            serviceName.toLowerCase(),
            'software development',
            'technology solutions',
            'custom software',
            ...keywords,
        ],
        path: `/services/${serviceName.toLowerCase().replace(/\s+/g, '-')}`,
    });
}

/**
 * Generate product page metadata
 */
export function generateProductMetadata(
    productName: string,
    description: string,
    keywords: string[] = []
): Metadata {
    return generatePageMetadata({
        title: productName,
        description,
        keywords: [
            productName.toLowerCase(),
            'software product',
            'technology solution',
            ...keywords,
        ],
        path: `/products/${productName.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'product',
    });
}

/**
 * Generate static page metadata
 */
export function generateStaticPageMetadata(
    pageName: string,
    description: string,
    path: string,
    keywords: string[] = []
): Metadata {
    return generatePageMetadata({
        title: pageName,
        description,
        keywords,
        path,
    });
}
