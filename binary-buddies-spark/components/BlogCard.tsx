"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { ApiBlogPost } from "@/types/api";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

    // Debug: Log image data for troubleshooting
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        if (post.image) {
            const isDataUrl = post.image.startsWith('data:image');
            console.log(`[BlogCard] Post "${post.title}":`, {
                hasImage: !!post.image,
                isDataUrl,
                imageLength: post.image.length,
                imagePreview: post.image.substring(0, 100),
            });
        } else {
            console.log(`[BlogCard] Post "${post.title}": No image`);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link href={`/blog/${post.slug}`} className="block h-full">
                <Card className="glass hover-glow overflow-hidden group cursor-pointer h-full flex flex-col transition-all duration-300">
                    {/* Preview Image or Placeholder */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 via-accent/20 to-accent-pink/20">
                        {post.image && typeof post.image === 'string' && post.image.trim() !== '' && post.image.startsWith('data:image') ? (
                            // Actual preview image from Odoo
                            <>
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                    decoding="async"
                                    onLoad={() => {
                                        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
                                            console.log(`[BlogCard] Image loaded successfully for: "${post.title}"`);
                                        }
                                    }}
                                    onError={(e) => {
                                        // Fallback to placeholder if image fails to load
                                        console.error(`[BlogCard] Image failed to load for: "${post.title}"`);
                                        console.error('Image data preview:', post.image?.substring(0, 100));
                                        console.error('Image length:', post.image?.length);
                                        console.error('Image starts with:', post.image?.substring(0, 20));
                                        // Hide the broken image
                                        e.currentTarget.style.display = 'none';
                                        // Show placeholder
                                        const container = e.currentTarget.parentElement;
                                        if (container) {
                                            const placeholder = container.querySelector('.image-placeholder') as HTMLElement;
                                            if (placeholder) {
                                                placeholder.style.display = 'block';
                                            }
                                        }
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                {/* Hidden placeholder for error fallback */}
                                <div className="image-placeholder absolute inset-0 hidden">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-6xl font-bold text-gradient opacity-20">
                                            {post.category.split("/")[0]}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Placeholder with gradient (fallback)
                            <>
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-6xl font-bold text-gradient opacity-20">
                                        {post.category.split("/")[0]}
                                    </div>
                                </div>
                            </>
                        )}
                        {post.featured && (
                            <div className="absolute top-4 right-4 z-10">
                                <Badge className="bg-primary text-primary-foreground shadow-glow">
                                    Featured
                                </Badge>
                            </div>
                        )}
                    </div>

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
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
};

