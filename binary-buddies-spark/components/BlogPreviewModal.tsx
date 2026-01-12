/**
 * BlogPreviewModal Component
 * Modal to preview blog post before publishing
 */

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogPreviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    blog: {
        title: string;
        excerpt: string;
        content: string;
        category: string;
        author: string;
        date: string;
        image?: string;
        tags?: string[];
    };
}

export default function BlogPreviewModal({ open, onOpenChange, blog }: BlogPreviewModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-muted-foreground">
                        Blog Preview
                    </DialogTitle>
                </DialogHeader>

                <article className="mt-4">
                    {/* Header Image */}
                    {blog.image && (
                        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Category Badge */}
                    <Badge variant="secondary" className="mb-4">
                        {blog.category}
                    </Badge>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        {blog.title}
                    </h1>

                    {/* Excerpt */}
                    <p className="text-lg text-muted-foreground mb-6">
                        {blog.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {blog.author.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{blog.author}</span>
                        </div>

                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(blog.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}</span>
                        </div>

                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>5 min read</span>
                        </div>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {blog.tags.map((tag, index) => (
                                <Badge key={index} variant="outline">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className={cn(
                            'prose prose-lg dark:prose-invert max-w-none',
                            'prose-headings:font-bold prose-headings:tracking-tight',
                            'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
                            'prose-img:rounded-lg',
                            'prose-pre:bg-muted prose-pre:text-foreground',
                            'prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded'
                        )}
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </article>
            </DialogContent>
        </Dialog>
    );
}
