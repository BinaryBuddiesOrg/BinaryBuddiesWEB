export interface BlogPost {
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
    image: string;
    featured: boolean;
}

export const blogPosts: BlogPost[] = [
    {
        id: "1",
        title: "The Future of AI-Powered Automation in Enterprise Software",
        excerpt: "Discover how artificial intelligence is revolutionizing business process automation and transforming enterprise workflows for maximum efficiency.",
        content: "As we move deeper into 2024, AI-powered automation is no longer a luxury—it's a necessity for businesses looking to stay competitive...",
        category: "AI/ML",
        author: {
            name: "Sarah Chen",
            avatar: "SC"
        },
        date: "2024-12-05",
        readTime: "8 min read",
        image: "/blog/ai-automation.jpg",
        featured: true
    },
    {
        id: "2",
        title: "Hyperautomation: The Next Evolution in Digital Transformation",
        excerpt: "Learn how hyperautomation combines RPA, AI, and machine learning to create end-to-end intelligent automation solutions.",
        content: "Hyperautomation represents a paradigm shift in how organizations approach digital transformation...",
        category: "Automation",
        author: {
            name: "Michael Rodriguez",
            avatar: "MR"
        },
        date: "2024-12-03",
        readTime: "6 min read",
        image: "/blog/hyperautomation.jpg",
        featured: true
    },
    {
        id: "3",
        title: "Building Scalable Microservices with Modern Architecture Patterns",
        excerpt: "A comprehensive guide to designing and implementing microservices architecture for high-performance applications.",
        content: "Microservices architecture has become the de facto standard for building scalable, maintainable applications...",
        category: "Development",
        author: {
            name: "Alex Kumar",
            avatar: "AK"
        },
        date: "2024-12-01",
        readTime: "10 min read",
        image: "/blog/microservices.jpg",
        featured: false
    },
    {
        id: "4",
        title: "Machine Learning Model Deployment: Best Practices for Production",
        excerpt: "Essential strategies for deploying ML models at scale, from containerization to monitoring and continuous improvement.",
        content: "Deploying machine learning models to production environments requires careful planning and robust infrastructure...",
        category: "AI/ML",
        author: {
            name: "Dr. Emily Watson",
            avatar: "EW"
        },
        date: "2024-11-28",
        readTime: "12 min read",
        image: "/blog/ml-deployment.jpg",
        featured: false
    },
    {
        id: "5",
        title: "The Rise of No-Code/Low-Code Platforms in 2024",
        excerpt: "How no-code and low-code platforms are democratizing software development and empowering citizen developers.",
        content: "The no-code/low-code revolution is transforming who can build software and how quickly applications can be developed...",
        category: "Industry News",
        author: {
            name: "James Park",
            avatar: "JP"
        },
        date: "2024-11-25",
        readTime: "7 min read",
        image: "/blog/nocode.jpg",
        featured: false
    },
    {
        id: "6",
        title: "API-First Development: Why It Matters for Modern Applications",
        excerpt: "Understanding the API-first approach and how it accelerates development, improves collaboration, and future-proofs your applications.",
        content: "In today's interconnected digital ecosystem, APIs are the backbone of modern software architecture...",
        category: "Development",
        author: {
            name: "Rachel Thompson",
            avatar: "RT"
        },
        date: "2024-11-22",
        readTime: "9 min read",
        image: "/blog/api-first.jpg",
        featured: false
    },
    {
        id: "7",
        title: "Edge AI: Bringing Intelligence Closer to Data Sources",
        excerpt: "Explore how edge computing and AI are converging to enable real-time processing and reduce latency in critical applications.",
        content: "Edge AI represents a fundamental shift in how we deploy and utilize artificial intelligence...",
        category: "AI/ML",
        author: {
            name: "David Lin",
            avatar: "DL"
        },
        date: "2024-11-20",
        readTime: "8 min read",
        image: "/blog/edge-ai.jpg",
        featured: true
    },
    {
        id: "8",
        title: "Robotic Process Automation: ROI and Implementation Strategies",
        excerpt: "A practical guide to implementing RPA in your organization, measuring success, and maximizing return on investment.",
        content: "Robotic Process Automation (RPA) has proven to deliver significant ROI across industries...",
        category: "Automation",
        author: {
            name: "Maria Garcia",
            avatar: "MG"
        },
        date: "2024-11-18",
        readTime: "11 min read",
        image: "/blog/rpa-roi.jpg",
        featured: false
    }
];

export const categories = ["All", "AI/ML", "Automation", "Development", "Industry News"] as const;
