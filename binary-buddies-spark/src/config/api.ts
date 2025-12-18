/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Use relative paths so requests go through Nginx proxy
// This avoids CORS issues as Nginx forwards to Odoo
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

    // Careers
    careers: `${API_BASE_URL}/api/bbweb/careers`,
    career: (id: number) => `${API_BASE_URL}/api/bbweb/careers/${id}`,
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
