'use client';

/**
 * CommentSection - Main container for blog comments
 * Displays comments with infinite scroll and a form to add new comments.
 */

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useComments, useCreateComment, flattenComments, getCommentCount } from '@/hooks/useComments';
import { useBlogEngagement } from '@/hooks/useLikes';
import { Comment } from './Comment';
import { CommentForm } from './CommentForm';
import { CommentSkeleton } from './CommentSkeleton';

interface CommentSectionProps {
    blogId: number;
}

export function CommentSection({ blogId }: CommentSectionProps) {
    const { data: session, status: authStatus } = useSession();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useComments(blogId);
    const { data: engagement } = useBlogEngagement(blogId);
    const createComment = useCreateComment(blogId);
    const [showForm, setShowForm] = useState(false);

    const comments = flattenComments(data);
    const totalCount = engagement?.comment_count ?? getCommentCount(data);

    const handleSubmitComment = async (content: string) => {
        try {
            const result = await createComment.mutateAsync({ content });
            if (result.status === 'success') {
                setShowForm(false);
            }
        } catch (error) {
            console.error('Failed to create comment:', error);
        }
    };

    const handleWriteComment = () => {
        if (authStatus !== 'authenticated') {
            signIn('google', { callbackUrl: window.location.href });
            return;
        }
        setShowForm(true);
    };

    if (isError) {
        return (
            <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <MessageCircle className="h-6 w-6" />
                    Comments
                </h2>
                <p className="text-red-500">Failed to load comments. Please try again.</p>
            </section>
        );
    }

    return (
        <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MessageCircle className="h-6 w-6" />
                    Comments
                    {totalCount > 0 && (
                        <span className="text-lg font-normal text-gray-500">
                            ({totalCount})
                        </span>
                    )}
                </h2>

                {!showForm && (
                    <button
                        onClick={handleWriteComment}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Write a Comment
                    </button>
                )}
            </div>

            {/* Comment Form */}
            {showForm && (
                <div className="mb-8">
                    <CommentForm
                        onSubmit={handleSubmitComment}
                        onCancel={() => setShowForm(false)}
                        isSubmitting={createComment.isPending}
                        placeholder="Share your thoughts..."
                    />
                </div>
            )}

            {/* Loading State */}
            {isLoading && <CommentSkeleton count={3} />}

            {/* Comments List */}
            {!isLoading && comments.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No comments yet</p>
                    <p className="text-sm">Be the first to share your thoughts!</p>
                </div>
            )}

            {!isLoading && comments.length > 0 && (
                <div className="space-y-1">
                    {comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            blogId={blogId}
                        />
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {hasNextPage && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {isFetchingNextPage ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                                Loading...
                            </>
                        ) : (
                            'Load more comments'
                        )}
                    </button>
                </div>
            )}
        </section>
    );
}
