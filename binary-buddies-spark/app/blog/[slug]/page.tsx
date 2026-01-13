import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Eye } from "lucide-react";
import { Footer } from "@/components/Footer";
import { BlogShareButton } from "@/components/BlogShareButton";
import { SchemaMarkup } from "@/components/SEO/SchemaMarkup";
import { RelatedArticles } from "@/components/SEO/RelatedArticles";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";
import { BlogViewTracker } from "@/components/BlogViewTracker";
import { BlogImage } from "@/components/BlogImage";
import { BlogContentWithScripts } from "@/components/BlogContentWithScripts";
import { LikeButton } from "@/components/LikeButton";
import { CommentSection } from "@/components/comments";
import { fetchBlogBySlug, fetchBlogs, fetchBlog, ApiRequestError } from "@/services/api";
import { generateBlogPostingSchema, generateBreadcrumbSchema } from "@/lib/schema";
import type { ApiBlogPost } from "@/types/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://binarybuddies.in';

// Force dynamic rendering for blog posts (since we fetch from API)
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour (ISR)

// Generate static params for featured blogs (ISR)
export async function generateStaticParams() {
    try {
        const featuredPosts = await fetchBlogs({ featured: true, skipError: true });
        if (!featuredPosts) {
            return [];
        }

        // Handle both array and paginated response formats
        const posts = Array.isArray(featuredPosts)
            ? featuredPosts
            : featuredPosts.data || [];

        if (posts.length === 0) {
            return [];
        }

        return posts.slice(0, 10).map((post) => ({
            slug: post.slug,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    try {
        const resolvedParams = await params;
        const slug = resolvedParams?.slug;

        // Validate slug - ensure it's a valid string
        if (!slug || typeof slug !== 'string' || slug.trim() === '' || slug === 'false' || slug === 'true') {
            console.error('Invalid slug in generateMetadata:', slug, 'params:', resolvedParams);
            return {
                title: 'Blog Post Not Found',
                robots: { index: false, follow: false },
            };
        }

        const post = await fetchBlogBySlug(slug);

        if (!post) {
            return {
                title: 'Blog Post Not Found',
                robots: { index: false, follow: false },
            };
        }

        const title = post.seo_title || post.title;
        const description = post.seo_description || post.excerpt;
        const ogImage = post.og_image || post.image || `${SITE_URL}/logo.jpg`;
        const url = `${SITE_URL}/blog/${post.slug}`;

        // Combine SEO keywords with tags for better SEO
        const seoKeywords = post.seo_keywords?.split(',').map(k => k.trim()).filter(Boolean) || [];
        const tagKeywords = post.tags || [];
        const allKeywords = [...seoKeywords, ...tagKeywords].filter(Boolean);

        return {
            title,
            description: description.substring(0, 160), // Limit to 160 chars for SEO
            keywords: allKeywords.length > 0 ? allKeywords : undefined,
            alternates: {
                canonical: url,
            },
            openGraph: {
                title,
                description: description.substring(0, 200),
                url,
                siteName: 'Binary Buddies',
                images: [
                    {
                        url: ogImage,
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    },
                ],
                type: 'article',
                publishedTime: post.date,
                authors: [post.author.name],
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description: description.substring(0, 200),
                images: [ogImage],
            },
        };
    } catch (error: any) {
        // Handle 404 errors gracefully
        if (error instanceof ApiRequestError && error.status === 404) {
            return {
                title: 'Blog Post Not Found',
                robots: { index: false, follow: false },
            };
        }
        if (error?.status === 404 || error?.message?.includes('404') || error?.message?.includes('not found')) {
            return {
                title: 'Blog Post Not Found',
                robots: { index: false, follow: false },
            };
        }
        console.error('Error generating metadata:', error);
        return {
            title: 'Blog Post',
            robots: { index: false, follow: false },
        };
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    let post: ApiBlogPost | null = null;
    let relatedPosts: ApiBlogPost[] = [];

    try {
        const resolvedParams = await params;
        const slug = resolvedParams?.slug;

        // Validate slug - ensure it's a valid string
        if (!slug || typeof slug !== 'string' || slug.trim() === '' || slug === 'false' || slug === 'true') {
            console.error('Invalid slug in page component:', slug, 'params:', resolvedParams);
            notFound();
        }

        // Check if slug is actually a numeric ID (for backward compatibility)
        // If so, fetch by ID and redirect to the actual slug
        const slugAsNumber = parseInt(slug, 10);
        if (!isNaN(slugAsNumber) && slugAsNumber.toString() === slug) {
            // This is an ID, fetch the blog and redirect to slug
            try {
                const postById = await fetchBlog(slugAsNumber);
                if (postById && postById.slug) {
                    // Redirect to the slug-based URL (this will throw to perform redirect)
                    redirect(`/blog/${postById.slug}`);
                }
            } catch (error) {
                // If fetch fails or redirect throws, show 404
                console.error('Error fetching blog by ID:', error);
            }
            // If no post found or no slug, show 404
            notFound();
        }

        // Normal slug-based lookup
        post = await fetchBlogBySlug(slug);

        // Fetch related articles (same category, excluding current post)
        if (post) {
            try {
                const allPosts = await fetchBlogs({ category: post.category, skipError: true });

                // Handle both array and paginated response formats
                const posts = Array.isArray(allPosts)
                    ? allPosts
                    : allPosts.data || [];

                relatedPosts = posts
                    .filter(p => p.id !== post!.id && p.slug !== post!.slug)
                    .slice(0, 3);
            } catch (error) {
                // If fetching related posts fails, continue without them
                console.error('Error fetching related posts:', error);
                relatedPosts = [];
            }
        }
    } catch (error: any) {
        console.error('Error fetching blog post:', error);
        // Check if it's a 404 error - if so, show 404 page
        if (error instanceof ApiRequestError && error.status === 404) {
            notFound();
        }
        if (error?.status === 404 || error?.message?.includes('404') || error?.message?.includes('not found')) {
            notFound();
        }
        // For other errors (network, timeout, etc.), show 404 to avoid exposing internal errors
        console.error('Unexpected error fetching blog post:', error);
        notFound();
    }

    if (!post) {
        notFound();
    }

    const categoryColors: Record<string, string> = {
        "AI/ML": "bg-primary text-primary-foreground",
        "Automation": "bg-accent text-accent-foreground",
        "Development": "bg-emerald-600 text-white",
        "Industry News": "bg-blue-600 text-white",
    };

    const currentUrl = `${SITE_URL}/blog/${post.slug}`;
    const previewImage = post.image;

    const blogSchema = generateBlogPostingSchema(post);
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: SITE_URL },
        { name: 'Blog', url: `${SITE_URL}/blog` },
        { name: post.title, url: currentUrl },
    ]);

    return (
        <div className="relative min-h-screen bg-background">
            <SchemaMarkup schema={blogSchema} />
            <SchemaMarkup schema={breadcrumbSchema} />
            <BlogViewTracker blogId={parseInt(post.id)} />
            {/* Header Section - Clean and Professional */}
            <section className="relative pt-28 pb-12 border-b border-border/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumbs */}
                        <Breadcrumbs
                            items={[
                                { label: 'Blog', href: '/blog' },
                                { label: post.title, href: `/blog/${post.slug}` },
                            ]}
                        />

                        {/* Back Link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8 font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Link>

                        {/* Preview Image - Only show if image exists */}
                        {previewImage && (
                            <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden bg-muted/10">
                                <BlogImage
                                    src={previewImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                    priority={true}
                                />
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className={`px-3 py-1 text-sm font-medium rounded-md ${categoryColors[post.category] || "bg-primary text-primary-foreground"}`}>
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                {post.readTime}
                            </span>
                            {post.view_count !== undefined && (
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Eye className="w-4 h-4" />
                                    {post.view_count} {post.view_count === 1 ? 'view' : 'views'}
                                </span>
                            )}
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Title - Clean without blur/glow */}
                        <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-foreground">
                            {post.title}
                        </h1>

                        {/* Author Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                                {post.author.avatar || <User className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-medium text-foreground">{post.author.name}</p>
                                <p className="text-sm text-muted-foreground">Author</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section - Aligned with Header */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <article className="max-w-4xl mx-auto">
                        {/* Excerpt/Lead */}
                        {post.excerpt && (
                            <p className="text-lg md:text-xl text-muted-foreground mb-8 pb-8 border-b border-border/50 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Main Content */}
                        <BlogContentWithScripts content={post.content} />

                        {/* Share Section */}
                        <div className="mt-12 pt-8 border-t border-border flex flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <p className="text-muted-foreground font-medium">Share this article</p>
                                <LikeButton blogId={parseInt(post.id)} size="lg" />
                            </div>
                            <div className="flex gap-2">
                                <BlogShareButton
                                    title={post.title}
                                    excerpt={post.excerpt}
                                    url={currentUrl}
                                />
                            </div>
                        </div>

                        {/* Comments Section */}
                        <CommentSection blogId={parseInt(post.id)} />

                        {/* Related Articles */}
                        <RelatedArticles relatedPosts={relatedPosts} />
                    </article>
                </div>
            </section>

            <Footer />
        </div>
    );
}

