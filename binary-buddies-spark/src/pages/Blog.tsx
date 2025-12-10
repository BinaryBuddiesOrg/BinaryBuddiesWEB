import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Search } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { Footer } from "@/components/Footer";
import { blogPosts, categories } from "@/data/blogData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Blog = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = blogPosts.filter((post) => {
        const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredPosts = blogPosts.filter(post => post.featured);

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16 md:pt-20">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-hero opacity-50" />

                {/* Floating Orbs */}
                <motion.div
                    className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center justify-center gap-2 mb-6"
                    >
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                            Insights & Innovation
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    >
                        <span className="text-gradient glow-text">Tech Blog</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
                    >
                        Explore the latest trends in AI, automation, and software development
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="max-w-xl mx-auto"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 glass border-primary/30 text-lg"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Category Filters */}
            <section className="py-12 border-b border-primary/20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                variant={selectedCategory === category ? "default" : "outline"}
                                className={
                                    selectedCategory === category
                                        ? "bg-primary hover:bg-primary-glow text-primary-foreground shadow-glow"
                                        : "glass border-primary/30 hover:border-primary/50"
                                }
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Posts */}
            {selectedCategory === "All" && searchQuery === "" && (
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                <span className="text-gradient">Featured Articles</span>
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Our most popular and impactful content
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredPosts.map((post, index) => (
                                <BlogCard key={post.id} post={post} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Posts */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-gradient">
                                {selectedCategory === "All" ? "Latest Articles" : selectedCategory}
                            </span>
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} found
                        </p>
                    </motion.div>

                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post, index) => (
                                <BlogCard key={post.id} post={post} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground text-lg">
                                No articles found matching your criteria. Try a different search or category.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
