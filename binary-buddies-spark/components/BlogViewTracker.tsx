'use client';

import { useEffect } from 'react';
import { incrementBlogView } from '@/services/api';

interface BlogViewTrackerProps {
    blogId: number;
}

export function BlogViewTracker({ blogId }: BlogViewTrackerProps) {
    useEffect(() => {
        // Increment view count when component mounts (blog page is viewed)
        // Only track once per page load
        const trackView = async () => {
            try {
                await incrementBlogView(blogId);
            } catch (error) {
                // Silently fail - view tracking shouldn't break the page
                console.error('Failed to increment view count:', error);
            }
        };

        trackView();
    }, [blogId]);

    // This component doesn't render anything
    return null;
}
