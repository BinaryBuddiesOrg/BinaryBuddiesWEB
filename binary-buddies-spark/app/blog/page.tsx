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
        <div className="relative pt-16 md:pt-20">
            {/* Category Filter Bar - Right below header */}
            <div className="sticky top-16 md:top-20 z-40 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => handleCategoryChange(category)}
                                    className={
                                        selectedCategory === category
                                            ? "bg-primary text-white hover:bg-primary/90"
                                            : "hover:bg-primary/10"
                                    }
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>

                        {/* Write Button for Authors */}
                        {canAuthorBlogs && (
                            <Link href="/blog/create">
                                <Button size="sm" className="gap-2">
                                    <PenSquare className="h-4 w-4" />
                                    <span className="hidden sm:inline">Write Article</span>
                                    <span className="sm:hidden">Write</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading State - Show Skeletons */}
            {isLoading && (
                <section className="container mx-auto px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <section className="py-8 md:py-12">
                    <div className="container mx-auto px-4">
                        {/* Article count */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center mb-6"
                        >
                            <p className="text-sm text-muted-foreground">
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
