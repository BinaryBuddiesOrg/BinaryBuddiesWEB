import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    const allItems = [
        { label: 'Home', href: '/' },
        ...items,
    ];

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                {allItems.map((item, index) => {
                    const isLast = index === allItems.length - 1;
                    
                    return (
                        <li key={item.href} className="flex items-center gap-2">
                            {index === 0 && <Home className="w-4 h-4" />}
                            {isLast ? (
                                <span className="text-foreground font-medium" aria-current="page">
                                    {item.label}
                                </span>
                            ) : (
                                <>
                                    <Link
                                        href={item.href}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
