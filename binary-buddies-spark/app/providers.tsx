'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 5 minutes
                        gcTime: 10 * 60 * 1000, // 10 minutes
                    },
                },
            })
    );

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="dark" storageKey="binary-buddies-theme">
                    <TooltipProvider>
                        {children}
                    </TooltipProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
