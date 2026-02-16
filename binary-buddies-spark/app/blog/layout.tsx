import { BlogNavbar } from "@/components/BlogNavbar";
import { BlogFooter } from "@/components/BlogFooter";

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Blog-specific Navbar */}
            <BlogNavbar />

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Blog-specific Footer */}
            <BlogFooter />
        </div>
    );
}
