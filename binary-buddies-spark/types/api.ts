/**
 * API Type Definitions
 * TypeScript interfaces for all API responses
 */

// Featured Projects
export interface ApiFeaturedProject {
    id: number;
    title: string;
    category: string;
    description: string;
    results: string[];
    tags: string[];
    gradient: string;
    image: string | null; // base64 encoded
    caseStudyUrl?: string; // URL to case study page
}

// Team Members
export interface ApiTeamMember {
    id: number;
    name: string;
    role: string;
    specialty: string;
    bio: string;
    certifications: string[];
    image: string | null; // base64 encoded
    linkedin_url: string;
    github_url: string;
    twitter_url: string;
}

// Blog Posts
export interface ApiBlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: "AI/ML" | "Automation" | "Development" | "Industry News";
    author: {
        name: string;
        avatar: string;
    };
    date: string;
    readTime: string;
    image: string | null; // URL to image (not base64)
    featured: boolean;
    tags?: string[]; // Blog post tags
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    og_image?: string | null; // URL to image (not base64)
    view_count?: number; // Number of views
}

// Pagination response structure
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number | null;
        has_more: boolean;
    };
}

// Careers
export interface ApiCareer {
    id: string;
    title: string;
    department: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract" | "Remote" | "Hybrid";
    description: string;
    requirements: string[];
    responsibilities: string[];
}

// API Error Response
export interface ApiError {
    message: string;
    status?: number;
    details?: unknown;
}

// Blog creation request
export interface CreateBlogRequest {
    title: string;
    excerpt: string;
    content: string; // HTML content
    category: "ai_ml" | "automation" | "development" | "industry_news";
    author_name: string;
    author_avatar?: string;
    slug?: string;
    publish_date?: string;
    read_time?: string;
    tags?: string[];
    featured?: boolean;
    active?: boolean;
    image_base64?: string; // Preview image
    og_image_base64?: string; // OG image
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
}

// Blog creation response
export interface CreateBlogResponse {
    status: "success" | "error";
    message: string;
    data?: {
        id: number;
        slug: string;
        title: string;
        url: string;
        author: string;
        category: string;
        publish_date: string;
        featured: boolean;
        active: boolean;
        tags: string[];
    };
    authenticated_as?: "session" | "api_key";
}

// User permissions (from /api/bbweb/users/<google_id>)
export interface UserPermissions {
    id: number;
    name: string;
    image_url: string | null;
    can_comment: boolean;
    can_author_blogs: boolean;
    is_banned: boolean;
}
