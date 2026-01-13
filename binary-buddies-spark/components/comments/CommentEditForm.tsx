'use client';

/**
 * CommentEditForm - Inline form for editing comments
 */

import { useState } from 'react';
import { Loader2, Check, X } from 'lucide-react';
import { useEditComment } from '@/hooks/useComments';

interface CommentEditFormProps {
    commentId: number;
    blogId: number;
    initialContent: string;
    onCancel: () => void;
    onSuccess: () => void;
}

export function CommentEditForm({
    commentId,
    blogId,
    initialContent,
    onCancel,
    onSuccess,
}: CommentEditFormProps) {
    const [content, setContent] = useState(initialContent);
    const [error, setError] = useState<string | null>(null);
    const editComment = useEditComment(blogId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const trimmedContent = content.trim();
        if (!trimmedContent) {
            setError('Comment cannot be empty');
            return;
        }

        try {
            const result = await editComment.mutateAsync({
                commentId,
                content: trimmedContent,
            });

            if (result.status === 'success') {
                onSuccess();
            } else {
                setError(result.message || 'Failed to update comment');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update comment');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={editComment.isPending}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                autoFocus
            />

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    disabled={editComment.isPending || !content.trim()}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                    {editComment.isPending ? (
                        <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Check className="h-3 w-3" />
                            Save
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={editComment.isPending}
                    className="px-3 py-1.5 text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
                >
                    <X className="h-3 w-3" />
                    Cancel
                </button>
            </div>
        </form>
    );
}
