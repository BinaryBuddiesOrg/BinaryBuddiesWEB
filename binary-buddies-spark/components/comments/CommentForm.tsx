'use client';

/**
 * CommentForm - Form for creating new comments
 */

import { useState } from 'react';
import { Loader2, Send, X } from 'lucide-react';

interface CommentFormProps {
    onSubmit: (content: string) => Promise<void>;
    onCancel?: () => void;
    isSubmitting: boolean;
    placeholder?: string;
    compact?: boolean;
}

export function CommentForm({
    onSubmit,
    onCancel,
    isSubmitting,
    placeholder = 'Write a comment...',
    compact = false,
}: CommentFormProps) {
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);

    const maxLength = 10000;
    const remainingChars = maxLength - content.length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const trimmedContent = content.trim();
        if (!trimmedContent) {
            setError('Please enter a comment');
            return;
        }

        if (trimmedContent.length > maxLength) {
            setError(`Comment is too long (max ${maxLength} characters)`);
            return;
        }

        try {
            await onSubmit(trimmedContent);
            setContent('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit comment');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    disabled={isSubmitting}
                    rows={compact ? 2 : 4}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                />

                {/* Character count */}
                <div
                    className={`absolute bottom-2 right-2 text-xs ${remainingChars < 100
                            ? remainingChars < 0
                                ? 'text-red-500'
                                : 'text-amber-500'
                            : 'text-gray-400'
                        }`}
                >
                    {remainingChars < 500 && `${remainingChars} characters remaining`}
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            <div className="flex items-center justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Posting...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4" />
                            Post Comment
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
