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

// ============================================================================
// COMMENTS TYPES
// ============================================================================

// Comment user info (embedded in comment)
export interface CommentUser {
    id: number;
    name: string;
    image_url: string | null;
}

// Single comment from API
export interface ApiComment {
    id: number;
    content: string;
    user: CommentUser;
    parent_id: number | null;
    depth: number;
    like_count: number;
    reply_count: number;
    is_liked: boolean;
    is_own: boolean;
    is_edited: boolean;
    edited_at: string | null;
    is_deleted: boolean;
    created_at: string;
}

// Paginated comments response (keyset pagination)
export interface PaginatedComments {
    comments: ApiComment[];
    pagination: {
        next_cursor: string | null;
        has_more: boolean;
        total_count: number;
    };
}

// Create comment request
export interface CreateCommentRequest {
    google_id: string;
    content: string;
    parent_id?: number;
}

// Create comment response
export interface CreateCommentResponse {
    status: "success" | "error";
    message?: string;
    comment?: ApiComment;
}

// Edit comment request
export interface EditCommentRequest {
    google_id: string;
    content: string;
}

// Edit comment response
export interface EditCommentResponse {
    status: "success" | "error";
    message?: string;
    comment?: {
        id: number;
        content: string;
        is_edited: boolean;
        edited_at: string | null;
    };
}

// Delete comment response
export interface DeleteCommentResponse {
    status: "success" | "error";
    message?: string;
}

// ============================================================================
// LIKES TYPES
// ============================================================================

// Toggle like response (for both blogs and comments)
export interface ToggleLikeResponse {
    status: "success" | "error";
    message?: string;
    is_liked?: boolean;
    like_count?: number;
}

// Blog engagement data (combined stats)
export interface ApiBlogEngagement {
    like_count: number;
    comment_count: number;
    view_count: number;
    is_liked: boolean;
}

// ============================================================================
// USER PROFILE TYPES
// ============================================================================

// User profile stats
export interface UserProfileStats {
    total_comments: number;
    total_likes_given: number;
    authored_blogs_count: number;
}

// Full user profile
export interface ApiUserProfile {
    id: number;
    name: string;
    email: string;
    image_url: string | null;
    member_since: string | null;
    can_comment: boolean;
    can_author_blogs: boolean;
    is_banned: boolean;
    stats: UserProfileStats;
}

// User comment with blog reference (for profile page)
export interface ApiUserComment {
    id: number;
    content: string;
    blog: {
        id: number;
        title: string;
        slug: string;
    };
    like_count: number;
    created_at: string;
}

// Paginated user comments response
export interface PaginatedUserComments {
    comments: ApiUserComment[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        has_more: boolean;
    };
}

// Liked blog item (with additional metadata)
export interface ApiLikedBlog extends ApiBlogPost {
    like_count: number;
    comment_count: number;
    liked_at: string;
}

// Paginated liked blogs response
export interface PaginatedLikedBlogs {
    data: ApiLikedBlog[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        has_more: boolean;
    };
}
