/**
 * EditorToolbar Component
 * Toolbar with formatting buttons for the Tiptap editor
 */

'use client';

import { type Editor } from '@tiptap/react';
import {
    Bold, Italic, Underline, Strikethrough,
    List, ListOrdered, Code, Quote,
    Heading1, Heading2, Heading3,
    Link, Image, Table,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Highlighter, Palette, Undo, Redo,
    Code2
} from 'lucide-react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from './ui/tooltip';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import { EditorDialog } from './EditorDialog';

interface EditorToolbarProps {
    editor: Editor | null;
    onToggleHtml?: () => void;
    isHtmlMode?: boolean;
}

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    tooltip: string;
    children: React.ReactNode;
}

function ToolbarButton({ onClick, isActive, disabled, tooltip, children }: ToolbarButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClick}
                    disabled={disabled}
                    className={cn(
                        'h-8 w-8 p-0 hover:bg-muted',
                        isActive && 'bg-muted text-primary'
                    )}
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
                {tooltip}
            </TooltipContent>
        </Tooltip>
    );
}

function ToolbarDivider() {
    return <div className="h-6 w-px bg-border mx-1" />;
}

const COLORS = [
    { name: 'Default', value: '' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
];

export default function EditorToolbar({ editor, onToggleHtml, isHtmlMode }: EditorToolbarProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'link' | 'image' | null>(null);

    const openDialog = (type: 'link' | 'image') => {
        setDialogType(type);
        setDialogOpen(true);
    };

    const handleDialogConfirm = useCallback((value: string) => {
        if (!editor || !dialogType) return;

        if (dialogType === 'link') {
            editor.chain().focus().setLink({ href: value }).run();
        } else if (dialogType === 'image') {
            editor.chain().focus().setImage({ src: value }).run();
        }
    }, [editor, dialogType]);

    const addLink = () => openDialog('link');
    const addImage = () => openDialog('image');

    const insertTable = useCallback(() => {
        if (editor) {
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        }
    }, [editor]);

    if (!editor) return null;

    return (
        <>
            <EditorDialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleDialogConfirm}
                title={dialogType === 'link' ? 'Add Link' : 'Add Image'}
                description={dialogType === 'link' ? 'Enter the URL for the link' : 'Enter the URL for the image'}
                placeholder="https://..."
                confirmText="Add"
            />
            <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/30 rounded-t-lg">
                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    tooltip="Undo"
                >
                    <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    tooltip="Redo"
                >
                    <Redo className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    tooltip="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    tooltip="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    tooltip="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Text formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    tooltip="Bold"
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    tooltip="Italic"
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    tooltip="Underline"
                >
                    <Underline className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    tooltip="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    tooltip="Bullet List"
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    tooltip="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    tooltip="Quote"
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Alignment */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    tooltip="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    tooltip="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    tooltip="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    isActive={editor.isActive({ textAlign: 'justify' })}
                    tooltip="Justify"
                >
                    <AlignJustify className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Color */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                            <Palette className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {COLORS.map((color) => (
                            <DropdownMenuItem
                                key={color.name}
                                onClick={() => {
                                    if (color.value) {
                                        editor.chain().focus().setColor(color.value).run();
                                    } else {
                                        editor.chain().focus().unsetColor().run();
                                    }
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-4 w-4 rounded border"
                                        style={{ backgroundColor: color.value || 'transparent' }}
                                    />
                                    {color.name}
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    isActive={editor.isActive('highlight')}
                    tooltip="Highlight"
                >
                    <Highlighter className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Links, Images, Tables */}
                <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} tooltip="Add Link">
                    <Link className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton onClick={addImage} tooltip="Add Image">
                    <Image className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton onClick={insertTable} tooltip="Insert Table">
                    <Table className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Code */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    tooltip="Inline Code"
                >
                    <Code className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    tooltip="Code Block"
                >
                    <Code2 className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* HTML Toggle */}
                {onToggleHtml && (
                    <Button
                        type="button"
                        variant={isHtmlMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={onToggleHtml}
                        className="h-8 text-xs"
                    >
                        {isHtmlMode ? 'Visual' : 'HTML'}
                    </Button>
                )}
            </div>
        </>
    );
}
