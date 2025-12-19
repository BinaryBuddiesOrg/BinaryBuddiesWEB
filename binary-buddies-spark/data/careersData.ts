export interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract" | "Remote" | "Hybrid";
    description: string;
    requirements: string[];
    responsibilities: string[];
}

export interface Benefit {
    id: string;
    icon: string;
    title: string;
    description: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    avatar: string;
    quote: string;
}

export const jobs: Job[] = [
    {
        id: "1",
        title: "Senior Full Stack Developer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description: "We're seeking an experienced Full Stack Developer to join our engineering team and help build cutting-edge AI-powered applications.",
        requirements: [
            "5+ years of experience in full-stack development",
            "Strong proficiency in React, Node.js, and TypeScript",
            "Experience with cloud platforms (AWS, Azure, or GCP)",
            "Knowledge of microservices architecture",
            "Excellent problem-solving and communication skills"
        ],
        responsibilities: [
            "Design and develop scalable web applications",
            "Collaborate with cross-functional teams",
            "Write clean, maintainable code",
            "Participate in code reviews and mentoring",
            "Contribute to technical architecture decisions"
        ]
    },
    {
        id: "2",
        title: "Machine Learning Engineer",
        department: "AI/ML",
        location: "Hybrid",
        type: "Full-time",
        description: "Join our AI team to develop and deploy machine learning models that power our intelligent automation solutions.",
        requirements: [
            "3+ years of experience in machine learning",
            "Strong knowledge of Python, TensorFlow, and PyTorch",
            "Experience with NLP and computer vision",
            "Understanding of MLOps and model deployment",
            "Master's degree in Computer Science or related field"
        ],
        responsibilities: [
            "Develop and train ML models",
            "Deploy models to production environments",
            "Optimize model performance and accuracy",
            "Collaborate with data scientists and engineers",
            "Stay updated with latest ML research"
        ]
    },
    {
        id: "3",
        title: "Product Designer (UI/UX)",
        department: "Design",
        location: "Remote",
        type: "Full-time",
        description: "We're looking for a creative Product Designer to craft beautiful, intuitive user experiences for our software products.",
        requirements: [
            "4+ years of UI/UX design experience",
            "Proficiency in Figma, Adobe XD, or Sketch",
            "Strong portfolio demonstrating design thinking",
            "Experience with design systems",
            "Understanding of front-end development"
        ],
        responsibilities: [
            "Create user-centered designs",
            "Conduct user research and usability testing",
            "Develop and maintain design systems",
            "Collaborate with developers and product managers",
            "Present design concepts to stakeholders"
        ]
    },
    {
        id: "4",
        title: "DevOps Engineer",
        department: "Infrastructure",
        location: "Hybrid",
        type: "Full-time",
        description: "Help us build and maintain robust, scalable infrastructure for our cloud-native applications.",
        requirements: [
            "3+ years of DevOps experience",
            "Strong knowledge of Docker, Kubernetes, and CI/CD",
            "Experience with AWS or Azure",
            "Proficiency in scripting (Python, Bash)",
            "Understanding of security best practices"
        ],
        responsibilities: [
            "Manage cloud infrastructure",
            "Implement CI/CD pipelines",
            "Monitor system performance and reliability",
            "Automate deployment processes",
            "Ensure security and compliance"
        ]
    },
    {
        id: "5",
        title: "Content Marketing Manager",
        department: "Marketing",
        location: "Remote",
        type: "Full-time",
        description: "Lead our content strategy and create compelling content that showcases our expertise in AI and automation.",
        requirements: [
            "5+ years of content marketing experience",
            "Strong writing and editing skills",
            "Experience in B2B tech marketing",
            "Knowledge of SEO and content analytics",
            "Ability to translate technical concepts"
        ],
        responsibilities: [
            "Develop content strategy",
            "Create blog posts, whitepapers, and case studies",
            "Manage content calendar",
            "Collaborate with subject matter experts",
            "Analyze content performance"
        ]
    },
    {
        id: "6",
        title: "Customer Success Manager",
        department: "Customer Success",
        location: "Remote",
        type: "Full-time",
        description: "Build strong relationships with our clients and ensure they achieve maximum value from our solutions.",
        requirements: [
            "3+ years in customer success or account management",
            "Excellent communication and interpersonal skills",
            "Experience with SaaS products",
            "Problem-solving mindset",
            "Technical aptitude"
        ],
        responsibilities: [
            "Onboard new customers",
            "Provide ongoing support and training",
            "Identify upsell opportunities",
            "Gather customer feedback",
            "Ensure customer satisfaction and retention"
        ]
    }
];

export const benefits: Benefit[] = [
    {
        id: "1",
        icon: "Heart",
        title: "Health & Wellness",
        description: "Comprehensive health insurance, mental health support, and wellness programs"
    },
    {
        id: "2",
        icon: "Home",
        title: "Remote-First Culture",
        description: "Work from anywhere with flexible hours and home office stipend"
    },
    {
        id: "3",
        icon: "GraduationCap",
        title: "Learning & Development",
        description: "$2,000 annual learning budget for courses, conferences, and certifications"
    },
    {
        id: "4",
        icon: "Plane",
        title: "Unlimited PTO",
        description: "Take the time you need to recharge with our unlimited vacation policy"
    },
    {
        id: "5",
        icon: "DollarSign",
        title: "Competitive Compensation",
        description: "Market-leading salaries, equity options, and performance bonuses"
    },
    {
        id: "6",
        icon: "Users",
        title: "Team Events",
        description: "Regular virtual and in-person team building activities and annual retreats"
    },
    {
        id: "7",
        icon: "Baby",
        title: "Parental Leave",
        description: "16 weeks paid parental leave for all new parents"
    },
    {
        id: "8",
        icon: "Laptop",
        title: "Latest Equipment",
        description: "Top-of-the-line MacBook or PC, monitors, and accessories of your choice"
    }
];

export const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Jessica Martinez",
        role: "Senior Software Engineer",
        avatar: "JM",
        quote: "Binary Buddies has been the best career decision I've made. The team is incredibly talented, and I'm constantly learning and growing. The remote-first culture gives me the flexibility I need."
    },
    {
        id: "2",
        name: "Ryan Chen",
        role: "ML Engineer",
        avatar: "RC",
        quote: "Working on cutting-edge AI projects with such a supportive team has been amazing. The company truly invests in our professional development and values work-life balance."
    },
    {
        id: "3",
        name: "Priya Patel",
        role: "Product Designer",
        avatar: "PP",
        quote: "The collaborative environment here is unmatched. Everyone's ideas are valued, and we have the autonomy to make real impact. Plus, the benefits package is incredible!"
    }
];
