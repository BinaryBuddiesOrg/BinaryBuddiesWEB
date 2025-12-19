import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Output standalone for Docker deployment
    output: 'standalone',

    // Enable experimental features for Next.js 15
    experimental: {
        // Optimize package imports
        optimizePackageImports: ['lucide-react', 'framer-motion'],
    },

    // Image optimization
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        // Allow data URLs for base64 images from API
        dangerouslyAllowSVG: true,
    },

    // API rewrites to proxy Odoo backend
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8069/api/:path*',
            },
        ];
    },
};

export default nextConfig;
