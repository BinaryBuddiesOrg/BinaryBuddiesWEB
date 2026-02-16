"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sun, Moon, PenSquare, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { UserMenu } from "@/components/UserMenu";
import { useCanAuthorBlogs } from "@/hooks/useUserPermissions";

export const BlogNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const canAuthorBlogs = useCanAuthorBlogs();

  // Initialize search from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    } else {
      setSearchQuery(''); // Clear search if param is removed
    }
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isOnBlogList = pathname === "/blog";

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (pathname !== "/blog") {
      // If not on blog list, navigate there with search
      router.push(`/blog?search=${encodeURIComponent(value)}`);
    } else {
      // If on blog list, update URL params
      if (value.trim()) {
        router.push(`/blog?search=${encodeURIComponent(value)}`);
      } else {
        router.push('/blog');
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-card/80 backdrop-blur-2xl border-b border-primary/20 shadow-lg"
          : "bg-background/50 backdrop-blur-xl"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 md:h-18">
          {/* Left Section - Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group flex-shrink-0"
            title="Back to Binary Buddies Home"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/logo.jpg"
                alt="Binary Buddies Logo"
                className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-full"
              />
            </motion.div>
            <span className="hidden sm:block text-lg md:text-xl font-bold text-foreground font-lexend tracking-wider">
              Binary Buddies
            </span>
          </Link>

          {/* Center Section - Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-10 glass border-primary/20 focus:border-primary w-full"
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {canAuthorBlogs && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden lg:flex hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 gap-2"
              >
                <Link href="/blog/create">
                  <PenSquare className="w-4 h-4" />
                  <span>Write</span>
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:flex hover:bg-primary/10 text-muted-foreground hover:text-primary"
              title="Main Site"
            >
              <Link href="/">
                <Home className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-primary/10 transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </Button>

            <UserMenu />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 h-10 glass border-primary/20 focus:border-primary w-full"
            />
          </div>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </motion.nav>
  );
};
