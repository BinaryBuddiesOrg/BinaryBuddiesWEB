/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Determine API base URL based on environment
// During build time, we need absolute URLs
// At runtime, we use relative URLs (via Next.js rewrites to Odoo)
// 
// Strategy: Always use relative URLs. The ensureAbsoluteUrl function
// in services/api.ts will convert to absolute only during actual build.
const API_BASE_URL = '';

// API endpoint paths
export const API_ENDPOINTS = {
    // Featured Projects
    projects: `${API_BASE_URL}/api/bbweb/projects`,
    project: (id: number) => `${API_BASE_URL}/api/bbweb/projects/${id}`,

    // Team Members
    team: `${API_BASE_URL}/api/bbweb/team`,
    teamMember: (id: number) => `${API_BASE_URL}/api/bbweb/team/${id}`,

    // Blog Posts
    blogs: `${API_BASE_URL}/api/bbweb/blogs`,
    blogsFeatured: `${API_BASE_URL}/api/bbweb/blogs/featured`,
    blog: (id: number) => `${API_BASE_URL}/api/bbweb/blogs/${id}`,
    blogBySlug: (slug: string) => `${API_BASE_URL}/api/bbweb/blogs/slug/${slug}`,

    // Careers
    careers: `${API_BASE_URL}/api/bbweb/careers`,
    career: (id: number) => `${API_BASE_URL}/api/bbweb/careers/${id}`,

    // Comments
    blogComments: (blogId: number) => `${API_BASE_URL}/api/bbweb/blogs/${blogId}/comments`,
    commentReplies: (commentId: number) => `${API_BASE_URL}/api/bbweb/comments/${commentId}/replies`,
    comment: (commentId: number) => `${API_BASE_URL}/api/bbweb/comments/${commentId}`,
    commentLike: (commentId: number) => `${API_BASE_URL}/api/bbweb/comments/${commentId}/like`,

    // Blog Likes & Engagement
    blogLike: (blogId: number) => `${API_BASE_URL}/api/bbweb/blogs/${blogId}/like`,
    blogEngagement: (blogId: number) => `${API_BASE_URL}/api/bbweb/blogs/${blogId}/engagement`,

    // User Profile
    userProfile: (googleId: string) => `${API_BASE_URL}/api/bbweb/users/${googleId}/profile`,
    userComments: (googleId: string) => `${API_BASE_URL}/api/bbweb/users/${googleId}/comments`,
    userLikedBlogs: (googleId: string) => `${API_BASE_URL}/api/bbweb/users/${googleId}/liked-blogs`,

    // Applications
    applicationsCreate: `${API_BASE_URL}/api/bbweb/applications/create`,
} as const;

// API configuration
export const API_CONFIG = {
    baseUrl: API_BASE_URL,
    timeout: 10000, // 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
} as const;

// Helper to build URL with query parameters
export const buildUrl = (url: string, params?: Record<string, string>): string => {
    if (!params || Object.keys(params).length === 0) {
        return url;
    }

    const queryString = new URLSearchParams(params).toString();
    return `${url}?${queryString}`;
};

// Helper to detect image MIME type from base64 string
const detectImageMimeType = (base64: string): string => {
    // Check base64 signature to determine image type
    // JPEG: /9j/4AAQSkZJRg... or /9j/
    // PNG: iVBORw0KGgoAAAANSUhEUgAA...
    // WebP: UklGR...
    const trimmed = base64.trim();

    if (trimmed.startsWith('/9j/') || trimmed.startsWith('/9j/4AAQ')) {
        return 'image/jpeg';
    }
    if (trimmed.startsWith('iVBORw0KGgo')) {
        return 'image/png';
    }
    if (trimmed.startsWith('UklGR')) {
        return 'image/webp';
    }
    // Default to PNG if can't detect
    return 'image/png';
};

// Helper to convert base64 image to data URL
export const base64ToDataUrl = (base64: string | null, mimeType?: string): string | null => {
    // Handle null/undefined/empty
    if (!base64 || typeof base64 !== 'string') {
        return null;
    }

    // Remove any whitespace
    const cleanBase64 = base64.trim();

    // Check if empty after trimming
    if (cleanBase64 === '') {
        return null;
    }

    // Check if it's already a data URL
    if (cleanBase64.startsWith('data:')) {
        return cleanBase64;
    }

    // Auto-detect MIME type if not provided
    const detectedMimeType = mimeType || detectImageMimeType(cleanBase64);

    // Convert base64 to data URL
    const dataUrl = `data:${detectedMimeType};base64,${cleanBase64}`;

    // Debug logging (only in development)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        if (cleanBase64.length < 100) {
            console.warn('[base64ToDataUrl] Very short base64 string:', {
                length: cleanBase64.length,
                preview: cleanBase64.substring(0, 50),
            });
        }
    }

    return dataUrl;
};
