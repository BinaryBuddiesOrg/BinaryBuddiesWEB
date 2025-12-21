import { MetadataRoute } from 'next';
import { fetchBlogs } from '@/services/api';
import type { ApiBlogPost } from '@/types/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://binarybuddies.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_URL;
    
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services/web-development`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services/ai-ml-development`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services/app-development`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services/software-development`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/products/chatbot`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/careers`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms-of-service`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // Dynamic blog pages
    let blogPages: MetadataRoute.Sitemap = [];
    
    try {
        const blogsResult = await fetchBlogs({ skipError: true });
        // Handle both array and paginated response formats
        let blogs: ApiBlogPost[] = [];
        if (Array.isArray(blogsResult)) {
            blogs = blogsResult;
        } else if (blogsResult && blogsResult.data) {
            blogs = blogsResult.data;
        }
        
        if (blogs.length > 0) {
            blogPages = blogs.map((blog) => ({
                url: `${baseUrl}/blog/${blog.slug}`,
                lastModified: new Date(blog.date),
                changeFrequency: 'weekly' as const,
                priority: blog.featured ? 0.9 : 0.7,
            }));
        }
    } catch (error) {
        console.error('Error fetching blogs for sitemap:', error);
        // Continue with empty blog pages - sitemap will still work
    }

    return [...staticPages, ...blogPages];
}

