/**
 * API Service Layer
 * Centralized functions for all API calls
 */

import { API_ENDPOINTS, buildUrl, base64ToDataUrl } from '../config/api';
import type {
    ApiFeaturedProject,
    ApiTeamMember,
    ApiBlogPost,
    ApiCareer,
} from '../types/api';

// Helper to ensure absolute URL for fetch
// Client-side: Use relative URLs (go through Next.js rewrites, no CORS issues)
// Server-side: Use absolute URLs (server-side fetch doesn't use rewrites)
function ensureAbsoluteUrl(url: string): string {
    // If already absolute, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    
    // Check if we're in the browser (client-side)
    const isClient = typeof window !== 'undefined';
    
    if (isClient) {
        // Client-side: Use relative URLs - Next.js rewrites will proxy to Odoo
        // This avoids CORS issues since requests go through the same origin
        return url;
    }
    
    // Server-side: Use absolute URLs
    // In Docker with network_mode: "host", localhost:8069 is accessible
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
                   process.env.ODOO_API_URL || 
                   'http://localhost:8069';
    
    // Remove leading slash if present to avoid double slashes
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    return `${baseUrl}/${cleanUrl}`;
}

// Custom error class for API errors
export class ApiRequestError extends Error {
    constructor(
        message: string,
        public status: number,
        public statusText: string
    ) {
        super(message);
        this.name = 'ApiRequestError';
    }
}

// Generic fetch wrapper with error handling
async function fetchApi<T>(url: string, options?: { skipError?: boolean }): Promise<T> {
    try {
        // Ensure absolute URL
        const absoluteUrl = ensureAbsoluteUrl(url);
        
        // Add cache-busting timestamp to prevent browser caching (only at client-side)
        const isClient = typeof window !== 'undefined';
        let finalUrl = absoluteUrl;
        if (isClient) {
            const separator = absoluteUrl.includes('?') ? '&' : '?';
            finalUrl = `${absoluteUrl}${separator}_t=${Date.now()}`;
        }

        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Skip cache for server-side requests
            cache: isClient ? 'default' : 'no-store',
            // Add timeout for server-side requests
            ...(!isClient && { signal: AbortSignal.timeout(10000) }),
        });

        if (!response.ok) {
            // Try to get error message from response
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData.error) {
                    errorMessage = errorData.error;
                }
            } catch {
                // If response is not JSON, use status text
            }
            
            // Create a proper error with status code
            const error = new ApiRequestError(
                errorMessage,
                response.status,
                response.statusText
            );
            
            throw error;
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        // Re-throw ApiRequestError as-is
        if (error instanceof ApiRequestError) {
            throw error;
        }
        
        // Handle other errors (network errors, timeouts, etc.)
        console.error('API fetch error:', error);
        
        if (options?.skipError) {
            // Return empty array/object based on expected type
            return [] as unknown as T;
        }
        
        // Wrap non-ApiRequestError in ApiRequestError for consistent handling
        if (error instanceof Error) {
            throw new ApiRequestError(
                error.message || 'Unknown API error',
                0,
                'Unknown'
            );
        }
        
        throw error;
    }
}

// ============================================================================
// Featured Projects
// ============================================================================

export async function fetchProjects(): Promise<ApiFeaturedProject[]> {
    const data = await fetchApi<ApiFeaturedProject[]>(API_ENDPOINTS.projects);

    // Transform base64 images to data URLs
    return data.map(project => ({
        ...project,
        image: base64ToDataUrl(project.image),
    }));
}

export async function fetchProject(id: number): Promise<ApiFeaturedProject> {
    const data = await fetchApi<ApiFeaturedProject>(API_ENDPOINTS.project(id));

    return {
        ...data,
        image: base64ToDataUrl(data.image),
    };
}

// ============================================================================
// Team Members
// ============================================================================

export async function fetchTeam(): Promise<ApiTeamMember[]> {
    const data = await fetchApi<ApiTeamMember[]>(API_ENDPOINTS.team);

    // Transform base64 images to data URLs
    return data.map(member => ({
        ...member,
        image: base64ToDataUrl(member.image),
    }));
}

export async function fetchTeamMember(id: number): Promise<ApiTeamMember> {
    const data = await fetchApi<ApiTeamMember>(API_ENDPOINTS.teamMember(id));

    return {
        ...data,
        image: base64ToDataUrl(data.image),
    };
}

// ============================================================================
// Blog Posts
// ============================================================================

export interface FetchBlogsOptions {
    category?: string;
    featured?: boolean;
}

export async function fetchBlogs(options?: FetchBlogsOptions & { skipError?: boolean }): Promise<ApiBlogPost[]> {
    let url: string = API_ENDPOINTS.blogs;

    // Use featured endpoint if requested
    if (options?.featured) {
        url = API_ENDPOINTS.blogsFeatured;
    }

    // Add category filter if provided
    if (options?.category && !options?.featured) {
        url = buildUrl(url, { category: options.category });
    }

    const data = await fetchApi<ApiBlogPost[]>(url, { skipError: options?.skipError });

    // Transform base64 images to data URLs
    return data.map(post => {
        const convertedImage = base64ToDataUrl(post.image);
        
        // Debug logging (only in development)
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            if (post.image && !convertedImage) {
                console.warn(`[fetchBlogs] Failed to convert image for post "${post.title}":`, {
                    originalLength: post.image?.length,
                    originalPreview: post.image?.substring(0, 50),
                });
            }
        }
        
        return {
            ...post,
            image: convertedImage,
        };
    });
}

export async function fetchBlog(id: number): Promise<ApiBlogPost> {
    const data = await fetchApi<ApiBlogPost>(API_ENDPOINTS.blog(id));

    return {
        ...data,
        image: base64ToDataUrl(data.image),
        og_image: data.og_image ? base64ToDataUrl(data.og_image) : null,
    };
}

export async function fetchBlogBySlug(slug: string): Promise<ApiBlogPost> {
    const data = await fetchApi<ApiBlogPost>(API_ENDPOINTS.blogBySlug(slug));

    return {
        ...data,
        image: base64ToDataUrl(data.image),
        og_image: data.og_image ? base64ToDataUrl(data.og_image) : null,
    };
}

// ============================================================================
// Careers
// ============================================================================

export interface FetchCareersOptions {
    department?: string;
}

export async function fetchCareers(options?: FetchCareersOptions): Promise<ApiCareer[]> {
    let url: string = API_ENDPOINTS.careers;

    // Add department filter if provided
    if (options?.department) {
        url = buildUrl(url, { department: options.department });
    }

    return fetchApi<ApiCareer[]>(url);
}

export async function fetchCareer(id: number): Promise<ApiCareer> {
    return fetchApi<ApiCareer>(API_ENDPOINTS.career(id));
}

// ============================================================================
// Job Applications
// ============================================================================

export interface SubmitApplicationData {
    name: string;
    email: string;
    phone?: string;
    careerId: string;
    coverLetter?: string;
    resume?: File;
}

export async function submitApplication(data: SubmitApplicationData): Promise<{ status: string; message: string; id?: number }> {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('career_id', data.careerId);

    if (data.phone) {
        formData.append('phone', data.phone);
    }
    if (data.coverLetter) {
        formData.append('cover_letter', data.coverLetter);
    }
    if (data.resume) {
        formData.append('resume', data.resume);
    }

    const response = await fetch(API_ENDPOINTS.applicationsCreate, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary for multipart
    });

    const result = await response.json();

    if (!response.ok || result.status === 'error') {
        throw new Error(result.message || 'Failed to submit application');
    }

    return result;
}
