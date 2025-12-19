'use client';

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface BlogShareButtonProps {
    title: string;
    excerpt: string;
    url: string;
}

export function BlogShareButton({ title, excerpt, url }: BlogShareButtonProps) {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title,
                text: excerpt,
                url,
            });
        } else {
            navigator.clipboard.writeText(url);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleShare}
        >
            <Share2 className="w-4 h-4" />
            Share
        </Button>
    );
}
