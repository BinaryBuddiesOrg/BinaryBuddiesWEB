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
    ApiError,
} from '../types/api';

// Generic fetch wrapper with error handling
async function fetchApi<T>(url: string): Promise<T> {
    try {
        // Add cache-busting timestamp to prevent browser caching
        const separator = url.includes('?') ? '&' : '?';
        const urlWithCacheBust = `${url}${separator}_t=${Date.now()}`;

        const response = await fetch(urlWithCacheBust, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        console.error('API fetch error:', error);
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

export async function fetchBlogs(options?: FetchBlogsOptions): Promise<ApiBlogPost[]> {
    let url = API_ENDPOINTS.blogs;

    // Use featured endpoint if requested
    if (options?.featured) {
        url = API_ENDPOINTS.blogsFeatured;
    }

    // Add category filter if provided
    if (options?.category && !options?.featured) {
        url = buildUrl(url, { category: options.category });
    }

    const data = await fetchApi<ApiBlogPost[]>(url);

    // Transform base64 images to data URLs
    return data.map(post => ({
        ...post,
        image: base64ToDataUrl(post.image),
    }));
}

export async function fetchBlog(id: number): Promise<ApiBlogPost> {
    const data = await fetchApi<ApiBlogPost>(API_ENDPOINTS.blog(id));

    return {
        ...data,
        image: base64ToDataUrl(data.image),
    };
}

// ============================================================================
// Careers
// ============================================================================

export interface FetchCareersOptions {
    department?: string;
}

export async function fetchCareers(options?: FetchCareersOptions): Promise<ApiCareer[]> {
    let url = API_ENDPOINTS.careers;

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
