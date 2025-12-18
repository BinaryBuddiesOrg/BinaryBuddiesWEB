import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { BlogPost } from "@/data/blogData";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface BlogCardProps {
    post: BlogPost;
    index: number;
}

export const BlogCard = ({ post, index }: BlogCardProps) => {
    const categoryColors = {
        "AI/ML": "bg-primary/20 text-primary border-primary/30",
        "Automation": "bg-accent/20 text-accent border-accent/30",
        "Development": "bg-accent-pink/20 text-accent-pink border-accent-pink/30",
        "Industry News": "bg-accent-neon/20 text-accent-neon border-accent-neon/30",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link to={`/blog/${post.id}`} className="block h-full">
                <Card className="glass hover-glow overflow-hidden group cursor-pointer h-full flex flex-col transition-all duration-300">
                    {/* Image Placeholder with Gradient */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 via-accent/20 to-accent-pink/20 overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-6xl font-bold text-gradient opacity-20">
                                {post.category.split("/")[0]}
                            </div>
                        </div>
                        {post.featured && (
                            <div className="absolute top-4 right-4">
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

