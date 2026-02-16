'use client';

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ChevronLeft, ChevronRight, PenSquare } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { BlogCardSkeleton } from "@/components/BlogCardSkeleton";
import { categories } from "@/data/blogData";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { useBlogs } from "@/hooks/useBlogs";
import { useCanAuthorBlogs } from "@/hooks/useUserPermissions";
import type { ApiBlogPost } from "@/types/api";
import type { PaginatedBlogResponse } from "@/services/api";

const POSTS_PER_PAGE = 12;

export default function BlogPage() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const canAuthorBlogs = useCanAuthorBlogs();


    // Reset to page 1 when category or search changes
    const categoryFilter = selectedCategory !== "All" ? selectedCategory : undefined;

    // Fetch blogs with pagination
    const {
        data: blogsData,
        isLoading,
        error,
    } = useBlogs({
        category: categoryFilter,
        page: currentPage,
        limit: POSTS_PER_PAGE,
    });


    // Extract blog posts and pagination info
    const { posts, pagination } = useMemo(() => {
        if (!blogsData) {
            return { posts: [], pagination: null };
        }

        if (Array.isArray(blogsData)) {
            // Legacy format - no pagination
            return { posts: blogsData, pagination: null };
        }

        // Paginated format
        return {
            posts: blogsData.data || [],
            pagination: blogsData.pagination || null,
        };
    }, [blogsData]);

    // Client-side search filtering (only if not using pagination)
    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) return posts;
        return posts.filter((post) => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [posts, searchQuery]);

    // Calculate total pages
    const totalPages = pagination
        ? Math.ceil(pagination.total / (pagination.limit || POSTS_PER_PAGE))
        : 1;

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Reset page when category changes
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden pt-20 md:pt-24">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-hero opacity-50" />

                {/* Floating Orbs */}
                <motion.div
                    className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center justify-center gap-2 mb-6"
                    >
                        <span className="text-muted-foreground font-semibold tracking-wider uppercase text-sm">
                            Insights & Innovation
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    >
                        <span className="text-gradient glow-text">Tech Blog</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
                    >
                        Expert insights on AI, automation, and the future of technology
                    </motion.p>

                    {/* Create Blog Button (for authorized users) */}
                    {canAuthorBlogs && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="mt-8"
                        >
                            <Link href="/blog/create">
                                <Button className="gap-2">
                                    <PenSquare className="h-4 w-4" />
                                    Create Blog Post
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Loading State - Show Skeletons */}
            {isLoading && (
                <section className="container mx-auto px-4 py-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="h-8 w-48 bg-muted/50 rounded-md animate-pulse mx-auto mb-4" />
                            <div className="h-4 w-32 bg-muted/30 rounded-md animate-pulse mx-auto" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(POSTS_PER_PAGE)].map((_, i) => (
                                <BlogCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Error State */}
            {error && (
                <section className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                        <p className="text-lg text-muted-foreground">Failed to load blog posts. Please try again later.</p>
                    </div>
                </section>
            )}

            {/* Content - Show when not loading and no error */}
            {!isLoading && !error && (
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        {/* Category Filter */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-wrap gap-3 justify-center mb-12"
                        >
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    onClick={() => handleCategoryChange(category)}
                                    className={
                                        selectedCategory === category
                                            ? "bg-primary text-white hover:bg-primary/90 border-primary/50 shadow-sm"
                                            : "glass"
                                    }
                                >
                                    {category}
                                </Button>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center mb-8"
                        >
                            <p className="text-muted-foreground">
                                {searchQuery
                                    ? `${filteredPosts.length} ${filteredPosts.length === 1 ? "article" : "articles"} found`
                                    : pagination
                                        ? `Showing ${posts.length} of ${pagination.total} ${pagination.total === 1 ? "article" : "articles"} (Page ${currentPage} of ${totalPages})`
                                        : `${posts.length} ${posts.length === 1 ? "article" : "articles"}`
                                }
                            </p>
                        </motion.div>

                        {filteredPosts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredPosts.map((post, index) => (
                                        <BlogCard key={post.id} post={post} index={index} />
                                    ))}
                                </div>

                                {/* Pagination - Only show when not searching and we have pagination info */}
                                {!searchQuery && pagination && totalPages > 1 && (
                                    <div className="mt-16 flex justify-center">
                                        <Pagination>
                                            <PaginationContent className="flex items-center gap-2">
                                                <PaginationItem>
                                                    <Button
                                                        variant="outline"
                                                        size="default"
                                                        onClick={() => {
                                                            if (currentPage > 1) {
                                                                handlePageChange(currentPage - 1);
                                                            }
                                                        }}
                                                        disabled={currentPage === 1}
                                                        className="gap-2 px-4 py-2"
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                        <span>Previous</span>
                                                    </Button>
                                                </PaginationItem>

                                                {/* Page Numbers */}
                                                {(() => {
                                                    const pages: (number | 'ellipsis')[] = [];
                                                    const showEllipsis = totalPages > 7;

                                                    if (!showEllipsis) {
                                                        // Show all pages if 7 or fewer
                                                        for (let i = 1; i <= totalPages; i++) {
                                                            pages.push(i);
                                                        }
                                                    } else {
                                                        // Always show first page
                                                        pages.push(1);

                                                        if (currentPage <= 3) {
                                                            // Show 1, 2, 3, 4, ..., last
                                                            for (let i = 2; i <= 4; i++) {
                                                                pages.push(i);
                                                            }
                                                            pages.push('ellipsis');
                                                            pages.push(totalPages);
                                                        } else if (currentPage >= totalPages - 2) {
                                                            // Show 1, ..., last-3, last-2, last-1, last
                                                            pages.push('ellipsis');
                                                            for (let i = totalPages - 3; i <= totalPages; i++) {
                                                                pages.push(i);
                                                            }
                                                        } else {
                                                            // Show 1, ..., current-1, current, current+1, ..., last
                                                            pages.push('ellipsis');
                                                            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                                                                pages.push(i);
                                                            }
                                                            pages.push('ellipsis');
                                                            pages.push(totalPages);
                                                        }
                                                    }

                                                    return pages.map((item, index) => {
                                                        if (item === 'ellipsis') {
                                                            return (
                                                                <PaginationItem key={`ellipsis-${index}`}>
                                                                    <PaginationEllipsis />
                                                                </PaginationItem>
                                                            );
                                                        }
                                                        return (
                                                            <PaginationItem key={item}>
                                                                <Button
                                                                    variant={currentPage === item ? "default" : "outline"}
                                                                    size="icon"
                                                                    onClick={() => handlePageChange(item)}
                                                                    className={`h-10 w-10 ${currentPage === item
                                                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                                        : "hover:bg-muted"
                                                                        }`}
                                                                >
                                                                    {item}
                                                                </Button>
                                                            </PaginationItem>
                                                        );
                                                    });
                                                })()}

                                                <PaginationItem>
                                                    <Button
                                                        variant="outline"
                                                        size="default"
                                                        onClick={() => {
                                                            if (currentPage < totalPages) {
                                                                handlePageChange(currentPage + 1);
                                                            }
                                                        }}
                                                        disabled={currentPage === totalPages}
                                                        className="gap-2 px-4 py-2"
                                                    >
                                                        <span>Next</span>
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-muted-foreground text-lg">
                                    No articles found matching your criteria. Try a different search or category.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
