import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // Force lowercase URLs (except for API routes)
    if (pathname !== pathname.toLowerCase() && !pathname.startsWith('/api/')) {
        url.pathname = pathname.toLowerCase();
        return NextResponse.redirect(url, 301);
    }

    // Remove trailing slash (except for root)
    if (pathname !== '/' && pathname.endsWith('/')) {
        url.pathname = pathname.slice(0, -1);
        return NextResponse.redirect(url, 301);
    }

    // Remove query parameters that shouldn't be indexed (like ?id=1)
    // But keep legitimate query params like ?category=ai
    const searchParams = url.searchParams;
    const disallowedParams = ['id'];
    let hasDisallowedParams = false;

    disallowedParams.forEach((param) => {
        if (searchParams.has(param)) {
            searchParams.delete(param);
            hasDisallowedParams = true;
        }
    });

    if (hasDisallowedParams) {
        url.search = searchParams.toString();
        return NextResponse.redirect(url, 301);
    }

    // Handle /index.html redirects
    if (pathname.endsWith('/index.html')) {
        url.pathname = pathname.replace('/index.html', '') || '/';
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
    ],
};
