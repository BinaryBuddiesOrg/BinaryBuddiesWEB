import { BlogCard } from '@/components/BlogCard';
import type { ApiBlogPost } from '@/types/api';

interface RelatedArticlesProps {
    relatedPosts: ApiBlogPost[];
}

export function RelatedArticles({ relatedPosts }: RelatedArticlesProps) {
    if (!relatedPosts || relatedPosts.length === 0) {
        return null;
    }

    return (
        <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post, index) => (
                    <BlogCard key={post.id} post={post} index={index} />
                ))}
            </div>
        </section>
    );
}

