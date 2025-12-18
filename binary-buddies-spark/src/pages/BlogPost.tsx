import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Loader2, AlertCircle } from "lucide-react";
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
        "AI/ML": "bg-primary/10 text-primary",
        "Automation": "bg-accent/10 text-accent",
        "Development": "bg-accent-pink/10 text-accent-pink",
        "Industry News": "bg-accent-neon/10 text-accent-neon",
    };

    return (
        <div className="relative min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-hero opacity-50" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Link>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                            <span className={`px-3 py-1 rounded-full ${categoryColors[post.category] || "bg-primary/10 text-primary"}`}>
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {post.readTime}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            <span className="text-gradient glow-text">{post.title}</span>
                        </h1>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                {post.author.avatar}
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">{post.author.name}</p>
                                <p className="text-sm text-muted-foreground">Author</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="prose prose-invert prose-lg max-w-none glass p-8 md:p-12 rounded-2xl"
                    >
                        {/* Lead paragraph */}
                        <p className="lead text-xl text-muted-foreground mb-8">
                            {post.excerpt}
                        </p>

                        {/* Blog content - rendered as HTML */}
                        <div
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        <div className="mt-12 pt-8 border-t border-primary/20 flex justify-between items-center">
                            <p className="text-muted-foreground">Share this article:</p>
                            <div className="flex gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-primary"
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
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default BlogPost;
