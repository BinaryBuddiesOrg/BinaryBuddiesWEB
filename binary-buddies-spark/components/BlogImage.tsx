'use client';

interface BlogImageProps {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
}

export function BlogImage({ src, alt, className = '', priority = false }: BlogImageProps) {
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={(e) => {
                console.error('Failed to load image:', src);
                // Hide image on error
                e.currentTarget.style.display = 'none';
            }}
        />
    );
}
