import Link from "next/link";
import { Home, BookOpen, Briefcase, Code, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchBlogs } from "@/services/api";

export default async function NotFound() {
    // Fetch featured blog posts for suggestions
    let featuredPosts: Awaited<ReturnType<typeof fetchBlogs>> = [];
    try {
        const result = await fetchBlogs({ featured: true, skipError: true });
        // Handle both array and paginated response formats
        featuredPosts = Array.isArray(result) ? result : (result.data || []);
    } catch (error) {
        console.error('Error fetching featured posts:', error);
        // Continue with empty array - page will still work
        featuredPosts = [];
    }

    const helpfulLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/blog', label: 'Blog', icon: BookOpen },
        { href: '/services/web-development', label: 'Services', icon: Code },
        { href: '/careers', label: 'Careers', icon: Briefcase },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12">
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-8xl md:text-9xl font-bold text-gradient mb-4">404</h1>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Link href="/">
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/blog">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Browse Blog
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-12 mb-8">
                        <h3 className="text-lg font-semibold mb-4">Popular Pages</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {helpfulLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {featuredPosts.length > 0 && (
                        <div className="mt-12 mb-8">
                            <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                                <Search className="w-5 h-5" />
                                Popular Blog Posts
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                {featuredPosts.slice(0, 4).map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/blog/${post.slug}`}
                                        className="text-left p-4 rounded-lg border border-border hover:bg-accent transition-colors group"
                                    >
                                        <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 text-sm text-muted-foreground">
                        <p>
                            If you believe this is an error, please{' '}
                            <Link href="/contact" className="text-primary hover:underline">
                                contact us
                            </Link>
                            {' '}or visit our{' '}
                            <Link href="/sitemap.xml" className="text-primary hover:underline">
                                sitemap
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
