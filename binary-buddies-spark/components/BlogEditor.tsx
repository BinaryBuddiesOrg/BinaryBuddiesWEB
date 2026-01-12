/**
 * BlogEditor Component
 * Rich text editor using Tiptap with full formatting capabilities
 */

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';

import { useState, useEffect, useCallback } from 'react';
import EditorToolbar from './EditorToolbar';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';
import { TooltipProvider } from './ui/tooltip';

interface BlogEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    minHeight?: string;
}

export default function BlogEditor({
    content,
    onChange,
    placeholder = 'Write your blog content here...',
    className,
    minHeight = '400px',
}: BlogEditorProps) {
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [htmlContent, setHtmlContent] = useState(content);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline hover:text-primary/80',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full my-4',
                },
            }),
            TableRow,
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-border p-2',
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-border p-2 bg-muted font-semibold',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none',
                    'focus:outline-none p-4',
                    'min-h-[inherit]'
                ),
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
            setHtmlContent(html);
        },
    });

    // Sync external content changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
            setHtmlContent(content);
        }
    }, [content, editor]);

    const handleToggleHtml = useCallback(() => {
        if (isHtmlMode && editor) {
            // Switching from HTML to Visual
            editor.commands.setContent(htmlContent);
        }
        setIsHtmlMode(!isHtmlMode);
    }, [isHtmlMode, htmlContent, editor]);

    const handleHtmlChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newHtml = e.target.value;
            setHtmlContent(newHtml);
            onChange(newHtml);
        },
        [onChange]
    );

    return (
        <TooltipProvider>
            <div className={cn('border rounded-lg bg-background overflow-hidden', className)}>
                <EditorToolbar
                    editor={editor}
                    onToggleHtml={handleToggleHtml}
                    isHtmlMode={isHtmlMode}
                />

                {isHtmlMode ? (
                    <Textarea
                        value={htmlContent}
                        onChange={handleHtmlChange}
                        className="font-mono text-sm rounded-none border-0 focus-visible:ring-0 resize-none"
                        style={{ minHeight }}
                        placeholder="<p>Enter HTML content...</p>"
                    />
                ) : (
                    <div
                        className="overflow-y-auto"
                        style={{ minHeight }}
                    >
                        <EditorContent editor={editor} className="min-h-[inherit]" />
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
}
