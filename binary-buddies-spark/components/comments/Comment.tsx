'use client';

/**
 * Comment - Individual comment with nested replies support
 */

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Pencil, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useReplies, useCreateComment, useDeleteComment, flattenComments } from '@/hooks/useComments';
import { useCommentLike, debouncedLike } from '@/hooks/useLikes';
import { CommentForm } from './CommentForm';
import { CommentEditForm } from './CommentEditForm';
import type { ApiComment } from '@/types/api';

interface CommentProps {
    comment: ApiComment;
    blogId: number;
}

export function Comment({ comment, blogId }: CommentProps) {
    const { data: session } = useSession();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Hooks
    const { data: repliesData, fetchNextPage, hasNextPage, isFetchingNextPage } = useReplies(
        comment.id,
        showReplies && comment.reply_count > 0
    );
    const createReply = useCreateComment(blogId);
    const deleteComment = useDeleteComment(blogId);
    const likeMutation = useCommentLike(comment.id, blogId);

    const replies = flattenComments(repliesData);

    // Format time
    const timeAgo = comment.created_at
        ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
        : '';
    const editedTimeAgo = comment.edited_at
        ? formatDistanceToNow(new Date(comment.edited_at), { addSuffix: true })
        : '';

    const handleLike = () => {
        debouncedLike(() => {
            likeMutation.mutate();
        });
    };

    const handleReply = async (content: string) => {
        try {
            const result = await createReply.mutateAsync({
                content,
                parentId: comment.id,
            });
            if (result.status === 'success') {
                setShowReplyForm(false);
                setShowReplies(true); // Show replies after adding one
            }
        } catch (error) {
            console.error('Failed to create reply:', error);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this comment?')) {
            try {
                await deleteComment.mutateAsync(comment.id);
            } catch (error) {
                console.error('Failed to delete comment:', error);
            }
        }
    };

    // Render deleted comment placeholder
    if (comment.is_deleted) {
        return (
            <div className={`py-4 ${comment.depth > 0 ? 'ml-8 border-l-2 border-border/50 pl-4' : 'border-b border-border/50'}`}>
                <p className="text-muted-foreground italic">
                    [This comment has been deleted]
                </p>

                {/* Still show replies for deleted comments */}
                {comment.reply_count > 0 && (
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="mt-2 text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                        {showReplies ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
                    </button>
                )}

                {showReplies && replies.length > 0 && (
                    <div className="mt-2">
                        {replies.map((reply) => (
                            <Comment key={reply.id} comment={reply} blogId={blogId} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`py-4 ${comment.depth > 0 ? 'ml-8 border-l-2 border-border/50 pl-4' : 'border-b border-border/50'}`}>
            {/* Header: Avatar + Name + Time */}
            <div className="flex items-center gap-3 mb-2">
                {comment.user.image_url ? (
                    <img
                        src={comment.user.image_url}
                        alt={comment.user.name}
                        className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground text-xs font-bold">
                        {comment.user.name.charAt(0).toUpperCase()}
                    </div>
                )}
                <span className="font-medium text-foreground">
                    {comment.user.name}
                </span>
                <span className="text-sm text-muted-foreground">
                    {timeAgo}
                </span>
                {comment.is_edited && (
                    <span className="text-xs text-muted-foreground/60" title={`Edited ${editedTimeAgo}`}>
                        (edited)
                    </span>
                )}
            </div>

            {/* Content */}
            {isEditing ? (
                <CommentEditForm
                    commentId={comment.id}
                    blogId={blogId}
                    initialContent={comment.content}
                    onCancel={() => setIsEditing(false)}
                    onSuccess={() => setIsEditing(false)}
                />
            ) : (
                <p className="text-foreground whitespace-pre-wrap mb-3">
                    {comment.content}
                </p>
            )}

            {/* Actions */}
            {!isEditing && (
                <div className="flex items-center gap-4 text-sm">
                    {/* Like Button */}
                    <button
                        onClick={handleLike}
                        disabled={likeMutation.isPending}
                        className={`flex items-center gap-1 transition-colors ${comment.is_liked
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-primary'
                            }`}
                    >
                        <Heart
                            className={`h-4 w-4 ${comment.is_liked ? 'fill-current' : ''}`}
                        />
                        <span>{comment.like_count || ''}</span>
                    </button>

                    {/* Reply Button */}
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Reply
                    </button>

                    {/* Show Replies Button */}
                    {comment.reply_count > 0 && !showReplies && (
                        <button
                            onClick={() => setShowReplies(true)}
                            className="flex items-center gap-1 text-primary hover:text-primary/80"
                        >
                            <ChevronDown className="h-4 w-4" />
                            {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
                        </button>
                    )}

                    {/* Hide Replies Button */}
                    {showReplies && (
                        <button
                            onClick={() => setShowReplies(false)}
                            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                        >
                            <ChevronUp className="h-4 w-4" />
                            Hide replies
                        </button>
                    )}

                    {/* Edit Button (own comments only) */}
                    {comment.is_own && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </button>
                    )}

                    {/* Delete Button (own comments only) */}
                    {comment.is_own && (
                        <button
                            onClick={handleDelete}
                            disabled={deleteComment.isPending}
                            className="flex items-center gap-1 text-muted-foreground hover:text-destructive"
                        >
                            {deleteComment.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                            Delete
                        </button>
                    )}
                </div>
            )}

            {/* Reply Form */}
            {showReplyForm && (
                <div className="mt-4 ml-8">
                    <CommentForm
                        onSubmit={handleReply}
                        onCancel={() => setShowReplyForm(false)}
                        isSubmitting={createReply.isPending}
                        placeholder={`Reply to ${comment.user.name}...`}
                        compact
                    />
                </div>
            )}

            {/* Nested Replies */}
            {showReplies && replies.length > 0 && (
                <div className="mt-4">
                    {replies.map((reply) => (
                        <Comment key={reply.id} comment={reply} blogId={blogId} />
                    ))}

                    {/* Load More Replies */}
                    {hasNextPage && (
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="mt-2 ml-8 text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                'Load more replies'
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
