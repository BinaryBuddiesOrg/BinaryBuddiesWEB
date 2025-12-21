"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Eye } from "lucide-react";
import { ApiBlogPost } from "@/types/api";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Client component for image with error handling
function BlogImageCard({ src, alt, featured }: { src: string; alt: string; featured?: boolean }) {
    return (
        <div className="relative h-48 overflow-hidden bg-muted/10">
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                    console.error('Failed to load image:', src);
                    // Hide image on error
                    e.currentTarget.style.display = 'none';
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            {featured && (
                <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-primary text-primary-foreground shadow-glow">
                        Featured
                    </Badge>
                </div>
            )}
        </div>
    );
}

interface BlogCardProps {
    post: ApiBlogPost;
    index: number;
}

export const BlogCard = ({ post, index }: BlogCardProps) => {
    const categoryColors = {
        "AI/ML": "bg-primary/20 text-primary border-primary/30",
        "Automation": "bg-accent/20 text-accent border-accent/30",
        "Development": "bg-accent-pink/20 text-accent-pink border-accent-pink/30",
        "Industry News": "bg-accent-neon/20 text-accent-neon border-accent-neon/30",
    };

    // Check if image is a URL (starts with http) or data URL
    const image = post.image;
    const hasImage = image && typeof image === 'string' && image.trim() !== '';
    const isImageUrl = hasImage && image && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/'));
    const isDataUrl = hasImage && image && image.startsWith('data:image');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link href={`/blog/${post.slug}`} className="block h-full">
                <Card className="glass hover-glow overflow-hidden group cursor-pointer h-full flex flex-col transition-all duration-300">
                    {/* Preview Image - Only show if image exists */}
                    {(isImageUrl || isDataUrl) && image && (
                        <BlogImageCard
                            src={image}
                            alt={post.title}
                            featured={post.featured}
                        />
                    )}
                    {!image && post.featured && (
                        <div className="relative p-6 pb-0">
                            <div className="flex justify-end">
                                <Badge className="bg-primary text-primary-foreground shadow-glow">
                                    Featured
                                </Badge>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                        {/* Category Badge */}
                        <Badge
                            variant="outline"
                            className={cn("w-fit mb-3", categoryColors[post.category])}
                        >
                            {post.category}
                        </Badge>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-gradient transition-all duration-300 line-clamp-2">
                            {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                            {post.excerpt}
                        </p>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <Badge
                                        key={tagIndex}
                                        variant="outline"
                                        className="text-xs px-2 py-0.5 bg-primary/5 text-primary border-primary/20"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                                {post.tags.length > 3 && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs px-2 py-0.5 bg-muted text-muted-foreground"
                                    >
                                        +{post.tags.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-primary/20">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">
                                    {post.author.avatar}
                                </div>
                                <span>{post.author.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{post.readTime}</span>
                            </div>
                            {post.view_count !== undefined && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Eye className="w-4 h-4" />
                                    <span>{post.view_count}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
};

