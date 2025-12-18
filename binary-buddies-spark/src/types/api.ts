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
    image: string | null; // base64 encoded
    featured: boolean;
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
