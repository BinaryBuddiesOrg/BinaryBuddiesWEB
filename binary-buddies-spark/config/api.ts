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

// Helper to convert base64 image to data URL
export const base64ToDataUrl = (base64: string | null, mimeType = 'image/png'): string | null => {
    if (!base64) return null;
    return `data:${mimeType};base64,${base64}`;
};
