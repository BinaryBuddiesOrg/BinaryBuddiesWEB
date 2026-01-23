import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Proxy to Odoo backend
        const odooUrl = process.env.NEXT_PUBLIC_ODOO_URL || 'http://localhost:6534';
        const response = await fetch(`${odooUrl}/app-ads.txt`, {
            cache: 'no-store',
            headers: {
                'User-Agent': 'Next.js/App-ads.txt',
            },
        });

        if (!response.ok) {
            throw new Error(`Odoo backend returned status ${response.status}`);
        }

        const content = await response.text();

        // Return as plain text with proper headers
        return new NextResponse(content, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Error fetching app-ads.txt from Odoo:', error);
        
        // Return a minimal valid file on error
        const fallbackContent = '# app-ads.txt\n# Error fetching content from backend\n';
        
        return new NextResponse(fallbackContent, {
            status: 500,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });
    }
}

