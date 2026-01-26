/**
 * BlogCreateForm Component
 * Main form for creating blog posts with validation and rich editor
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Eye, Loader2, Send, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

import BlogEditor from '@/components/BlogEditor';
import ImageUploader from '@/components/ImageUploader';
import BlogPreviewModal from '@/components/BlogPreviewModal';
import { useUserPermissions, useCreateBlog } from '@/hooks/useUserPermissions';

// Form validation schema
const blogFormSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
    excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(500, 'Excerpt is too long'),
    content: z.string().min(50, 'Content must be at least 50 characters'),
    category: z.enum(['ai_ml', 'automation', 'development', 'industry_news'], {
        required_error: 'Please select a category',
    }),
    tags: z.string().optional(),
    featured: z.boolean().default(false),
    seo_title: z.string().max(70, 'SEO title is too long').optional(),
    seo_description: z.string().max(160, 'SEO description is too long').optional(),
    seo_keywords: z.string().max(200, 'Keywords are too long').optional(),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

const CATEGORIES = [
    { value: 'ai_ml', label: 'AI/ML' },
    { value: 'automation', label: 'Automation' },
    { value: 'development', label: 'Development' },
    { value: 'industry_news', label: 'Industry News' },
];

export default function BlogCreateForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { data: permissions, isLoading: permissionsLoading } = useUserPermissions();
    const createBlogMutation = useCreateBlog();

    const [content, setContent] = useState('');
    const [previewImage, setPreviewImage] = useState<string | undefined>();
    const [ogImage, setOgImage] = useState<string | undefined>();
    const [showPreview, setShowPreview] = useState(false);
    const [showSeoOptions, setShowSeoOptions] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<BlogFormData>({
        resolver: zodResolver(blogFormSchema),
        defaultValues: {
            featured: false,
        },
    });

    const watchedValues = watch();

    // Check authentication and permissions
    useEffect(() => {
        if (status === 'unauthenticated') {
            toast.error('Please sign in to create blog posts');
            router.push('/blog');
        }
    }, [status, router]);

    useEffect(() => {
        if (!permissionsLoading && permissions && !permissions.can_author_blogs) {
            toast.error('You do not have permission to create blog posts');
            router.push('/blog');
        }
    }, [permissions, permissionsLoading, router]);

    // Update form content field when editor changes
    useEffect(() => {
        setValue('content', content, { shouldValidate: content.length > 0 });
    }, [content, setValue]);

    const onSubmit = async (data: BlogFormData) => {
        try {
            // Parse tags from comma-separated string
            const tags = data.tags
                ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
                : undefined;

            const result = await createBlogMutation.mutateAsync({
                title: data.title,
                excerpt: data.excerpt,
                content: data.content,
                category: data.category,
                author_name: session?.user?.name || 'Anonymous',
                author_avatar: session?.user?.name?.slice(0, 2).toUpperCase() || 'AN',
                tags,
                featured: data.featured,
                image_base64: previewImage,
                og_image_base64: ogImage,
                seo_title: data.seo_title,
                seo_description: data.seo_description,
                seo_keywords: data.seo_keywords,
            });

            if (result.status === 'success') {
                toast.success('Blog post created successfully!');
                router.push(result.data?.url || '/blog');
            } else {
                toast.error(result.message || 'Failed to create blog post');
            }
        } catch (error) {
            console.error('Blog creation error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to create blog post');
        }
    };

    // Show loading state while checking permissions
    if (status === 'loading' || permissionsLoading) {
        return (
            <div className="container max-w-4xl pt-24 pb-16 md:pt-32 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Don't render if not authorized
    if (status === 'unauthenticated' || (permissions && !permissions.can_author_blogs)) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container max-w-4xl pt-24 pb-16 md:pt-32"
        >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/blog">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Create Blog Post</h1>
                    <p className="text-muted-foreground">
                        Write and publish your blog post
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                        id="title"
                        placeholder="Enter a compelling title..."
                        className="text-lg"
                        {...register('title')}
                    />
                    {errors.title && (
                        <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                        id="excerpt"
                        placeholder="A brief summary of your blog post..."
                        rows={3}
                        {...register('excerpt')}
                    />
                    {errors.excerpt && (
                        <p className="text-sm text-destructive">{errors.excerpt.message}</p>
                    )}
                </div>

                {/* Category and Featured */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select onValueChange={(value) => setValue('category', value as BlogFormData['category'])}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && (
                            <p className="text-sm text-destructive">{errors.category.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                            id="tags"
                            placeholder="React, Next.js, Tutorial (comma separated)"
                            {...register('tags')}
                        />
                    </div>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-3">
                    <Switch
                        id="featured"
                        checked={watchedValues.featured}
                        onCheckedChange={(checked) => setValue('featured', checked)}
                    />
                    <Label htmlFor="featured" className="cursor-pointer">
                        Featured post (shown prominently on the blog page)
                    </Label>
                </div>

                {/* Content Editor */}
                <div className="space-y-2">
                    <Label>Content *</Label>
                    <BlogEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Write your blog content here..."
                        minHeight="400px"
                    />
                    {errors.content && (
                        <p className="text-sm text-destructive">{errors.content.message}</p>
                    )}
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUploader
                        value={previewImage}
                        onChange={setPreviewImage}
                        label="Preview Image"
                    />
                    <ImageUploader
                        value={ogImage}
                        onChange={setOgImage}
                        label="OG Image (for social sharing)"
                    />
                </div>

                {/* SEO Options (Collapsible) */}
                <Collapsible open={showSeoOptions} onOpenChange={setShowSeoOptions}>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" type="button" className="w-full justify-between">
                            SEO Options (Advanced)
                            {showSeoOptions ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="seo_title">SEO Title</Label>
                            <Input
                                id="seo_title"
                                placeholder="Custom title for search engines (max 70 chars)"
                                {...register('seo_title')}
                            />
                            {errors.seo_title && (
                                <p className="text-sm text-destructive">{errors.seo_title.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seo_description">SEO Description</Label>
                            <Textarea
                                id="seo_description"
                                placeholder="Description for search engines (max 160 chars)"
                                rows={2}
                                {...register('seo_description')}
                            />
                            {errors.seo_description && (
                                <p className="text-sm text-destructive">{errors.seo_description.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seo_keywords">SEO Keywords</Label>
                            <Input
                                id="seo_keywords"
                                placeholder="keyword1, keyword2, keyword3"
                                {...register('seo_keywords')}
                            />
                            {errors.seo_keywords && (
                                <p className="text-sm text-destructive">{errors.seo_keywords.message}</p>
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPreview(true)}
                        disabled={!watchedValues.title || !content}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || createBlogMutation.isPending}
                        className="min-w-[120px]"
                    >
                        {isSubmitting || createBlogMutation.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Publish
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* Preview Modal */}
            <BlogPreviewModal
                open={showPreview}
                onOpenChange={setShowPreview}
                blog={{
                    title: watchedValues.title || 'Untitled',
                    excerpt: watchedValues.excerpt || '',
                    content: content,
                    category: CATEGORIES.find(c => c.value === watchedValues.category)?.label || 'Development',
                    author: session?.user?.name || 'Anonymous',
                    date: new Date().toISOString().split('T')[0],
                    image: previewImage ? `data:image/jpeg;base64,${previewImage}` : undefined,
                    tags: watchedValues.tags?.split(',').map(t => t.trim()).filter(Boolean) || [],
                }}
            />
        </motion.div>
    );
}
