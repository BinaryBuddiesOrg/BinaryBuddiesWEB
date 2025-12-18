import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Loader2, AlertCircle, User } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useBlog } from "@/hooks/useBlogs";

const BlogPost = () => {
    const { id } = useParams();
    const blogId = id ? parseInt(id, 10) : 0;
    const { data: post, isLoading, error } = useBlog(blogId);

    if (isLoading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="relative min-h-screen">
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                            <p className="text-lg text-muted-foreground">
                                {error ? "Failed to load blog post. Please try again later." : "Blog post not found."}
                            </p>
                            <Link to="/blog" className="inline-flex items-center text-primary hover:underline mt-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Blog
                            </Link>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    const categoryColors: Record<string, string> = {
        "AI/ML": "bg-primary text-primary-foreground",
        "Automation": "bg-accent text-accent-foreground",
        "Development": "bg-emerald-600 text-white",
        "Industry News": "bg-blue-600 text-white",
    };

    return (
        <div className="relative min-h-screen bg-background">
            {/* Header Section - Clean and Professional */}
            <section className="relative pt-28 pb-12 border-b border-border/50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        {/* Back Link */}
                        <Link
                            to="/blog"
                            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8 font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Link>

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
                        </div>

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
                    </motion.div>
                </div>
            </section>

            {/* Content Section - Aligned with Header */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-4xl mx-auto"
                    >
                        {/* Excerpt/Lead */}
                        {post.excerpt && (
                            <p className="text-lg md:text-xl text-muted-foreground mb-8 pb-8 border-b border-border/50 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Main Content */}
                        <div
                            className="blog-prose"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Share Section */}
                        <div className="mt-12 pt-8 border-t border-border flex flex-wrap justify-between items-center gap-4">
                            <p className="text-muted-foreground font-medium">Share this article</p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: post.title,
                                                text: post.excerpt,
                                                url: window.location.href,
                                            });
                                        } else {
                                            navigator.clipboard.writeText(window.location.href);
                                        }
                                    }}
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </motion.article>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default BlogPost;
