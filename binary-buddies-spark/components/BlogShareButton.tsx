'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
    Share2, 
    Twitter, 
    Facebook, 
    Linkedin, 
    MessageCircle, 
    Mail, 
    Copy,
    Check
} from "lucide-react";

interface BlogShareButtonProps {
    title: string;
    excerpt: string;
    url: string;
}

export function BlogShareButton({ title, excerpt, url }: BlogShareButtonProps) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    // Encode URL and text for sharing
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(excerpt);

    // Social media share URLs
    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`,
    };

    // Web Share API (mobile browsers)
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: excerpt,
                    url,
                });
                toast({
                    title: "Shared successfully!",
                    description: "Thank you for sharing this article.",
                });
            } catch (error: any) {
                // User cancelled or error occurred
                if (error.name !== 'AbortError') {
                    toast({
                        title: "Share failed",
                        description: "Unable to share. Please try another method.",
                        variant: "destructive",
                    });
                }
            }
        }
    };

    // Copy link to clipboard
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast({
                title: "Link copied!",
                description: "The article link has been copied to your clipboard.",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast({
                title: "Copy failed",
                description: "Unable to copy link. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Open share link in new window
    const handleShare = (platform: keyof typeof shareLinks) => {
        const shareUrl = shareLinks[platform];
        if (platform === 'email') {
            window.location.href = shareUrl;
        } else {
            window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
        }
    };

    // Check if Web Share API is available
    const hasNativeShare = typeof navigator !== 'undefined' && navigator.share;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {hasNativeShare && (
                    <>
                        <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share via...
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem 
                    onClick={() => handleShare('twitter')} 
                    className="cursor-pointer"
                >
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => handleShare('facebook')} 
                    className="cursor-pointer"
                >
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => handleShare('linkedin')} 
                    className="cursor-pointer"
                >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => handleShare('whatsapp')} 
                    className="cursor-pointer"
                >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => handleShare('email')} 
                    className="cursor-pointer"
                >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={handleCopyLink} 
                    className="cursor-pointer"
                >
                    {copied ? (
                        <>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Link
                        </>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

