'use client';

/**
 * Profile Page - User dashboard showing activity
 * Tabs: Overview, Liked Blogs, My Comments
 */

import { useState } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import {
    User,
    Heart,
    MessageCircle,
    FileText,
    Calendar,
    Loader2,
    ChevronRight,
} from 'lucide-react';
import { Footer } from '@/components/Footer';
import {
    useCurrentUserProfile,
    useUserLikedBlogs,
    useUserComments,
} from '@/hooks/useUserProfile';

// Tab definitions
const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'liked', label: 'Liked Blogs', icon: Heart },
    { id: 'comments', label: 'My Comments', icon: MessageCircle },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    // Redirect if not authenticated
    if (status === 'unauthenticated') {
        redirect('/api/auth/signin?callbackUrl=/profile');
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const googleId = (session?.user as { googleId?: string })?.googleId;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="pt-28 pb-8 border-b border-border/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <ProfileHeader googleId={googleId} session={session} />
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <section className="border-b border-border/50 sticky top-0 bg-background z-10">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <nav className="flex gap-1 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </section>

            {/* Tab Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {activeTab === 'overview' && <OverviewTab googleId={googleId} />}
                        {activeTab === 'liked' && <LikedBlogsTab googleId={googleId} />}
                        {activeTab === 'comments' && <CommentsTab googleId={googleId} />}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// ============================================================================
// Profile Header
// ============================================================================

function ProfileHeader({
    googleId,
    session,
}: {
    googleId?: string;
    session: { user?: { name?: string | null; email?: string | null; image?: string | null } } | null;
}) {
    const { data: profile, isLoading } = useCurrentUserProfile();

    const user = session?.user;
    const memberSince = profile?.member_since
        ? formatDistanceToNow(new Date(profile.member_since), { addSuffix: true })
        : null;

    return (
        <div className="flex items-start gap-6">
            {/* Avatar */}
            {user?.image ? (
                <img
                    src={user.image}
                    alt={user.name || 'Profile'}
                    className="w-20 h-20 rounded-full"
                />
            ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
            )}

            {/* Info */}
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">{user?.name || 'User'}</h1>
                <p className="text-muted-foreground">{user?.email}</p>

                {memberSince && (
                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Member {memberSince}
                    </p>
                )}

                {/* Stats */}
                {!isLoading && profile?.stats && (
                    <div className="flex gap-6 mt-4">
                        <div className="text-center">
                            <p className="text-xl font-bold text-foreground">
                                {profile.stats.total_comments}
                            </p>
                            <p className="text-xs text-muted-foreground">Comments</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-foreground">
                                {profile.stats.total_likes_given}
                            </p>
                            <p className="text-xs text-muted-foreground">Likes Given</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// Overview Tab
// ============================================================================

function OverviewTab({ googleId }: { googleId?: string }) {
    const { data: profile } = useCurrentUserProfile();

    return (
        <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Comments Card */}
                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold">Comments</h3>
                    </div>
                    <p className="text-3xl font-bold">{profile?.stats?.total_comments ?? 0}</p>
                    <p className="text-sm text-muted-foreground">Total comments posted</p>
                </div>

                {/* Likes Card */}
                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                            <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="font-semibold">Likes Given</h3>
                    </div>
                    <p className="text-3xl font-bold">{profile?.stats?.total_likes_given ?? 0}</p>
                    <p className="text-sm text-muted-foreground">Posts you&apos;ve liked</p>
                </div>

                {/* Blogs Card (if can author) */}
                {profile?.can_author_blogs && (
                    <div className="p-6 rounded-xl border border-border bg-card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-semibold">Authored</h3>
                        </div>
                        <p className="text-3xl font-bold">{profile?.stats?.authored_blogs_count ?? 0}</p>
                        <p className="text-sm text-muted-foreground">Blog posts written</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// Liked Blogs Tab
// ============================================================================

function LikedBlogsTab({ googleId }: { googleId?: string }) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useUserLikedBlogs(googleId);

    const blogs = data?.pages.flatMap((page) => page.data) ?? [];

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <div className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium">No liked blogs yet</p>
                <p className="text-muted-foreground">
                    Start exploring and like posts to save them here!
                </p>
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 mt-4 text-primary hover:underline"
                >
                    Browse Blog <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {blogs.map((blog) => (
                <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="block p-4 rounded-xl border border-border hover:border-primary/50 bg-card transition-colors"
                >
                    <div className="flex gap-4">
                        {blog.image && (
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-24 h-24 rounded-lg object-cover hidden sm:block"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{blog.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {blog.excerpt}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>{blog.category}</span>
                                <span className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" /> {blog.like_count}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageCircle className="h-3 w-3" /> {blog.comment_count}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}

            {hasNextPage && (
                <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="w-full py-3 text-center text-primary hover:underline disabled:opacity-50"
                >
                    {isFetchingNextPage ? 'Loading...' : 'Load more'}
                </button>
            )}
        </div>
    );
}

// ============================================================================
// Comments Tab
// ============================================================================

function CommentsTab({ googleId }: { googleId?: string }) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useUserComments(googleId);

    const comments = data?.pages.flatMap((page) => page.comments) ?? [];

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium">No comments yet</p>
                <p className="text-muted-foreground">
                    Start a conversation by commenting on blog posts!
                </p>
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 mt-4 text-primary hover:underline"
                >
                    Browse Blog <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div
                    key={comment.id}
                    className="p-4 rounded-xl border border-border bg-card"
                >
                    <Link
                        href={`/blog/${comment.blog.slug}`}
                        className="text-sm text-primary hover:underline"
                    >
                        On: {comment.blog.title}
                    </Link>
                    <p className="mt-2 text-foreground line-clamp-3">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {comment.like_count}
                        </span>
                        <span>
                            {comment.created_at &&
                                formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                    </div>
                </div>
            ))}

            {hasNextPage && (
                <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="w-full py-3 text-center text-primary hover:underline disabled:opacity-50"
                >
                    {isFetchingNextPage ? 'Loading...' : 'Load more'}
                </button>
            )}
        </div>
    );
}
