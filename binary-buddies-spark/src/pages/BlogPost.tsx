import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
    const { id } = useParams();

    // In a real app, you would fetch the post data based on the ID
    // For now, we'll show a generic template

    return (
        <div className="relative min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-hero opacity-50" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-8">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Link>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Technology</span>
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Dec 18, 2025</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 5 min read</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            <span className="text-gradient glow-text">The Future of AI in Enterprise Automation</span>
                        </h1>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">John Doe</p>
                                <p className="text-sm text-muted-foreground">Senior AI Engineer</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="prose prose-invert prose-lg max-w-none glass p-8 md:p-12 rounded-2xl"
                    >
                        <p className="lead text-xl text-muted-foreground mb-8">
                            Artificial Intelligence is revolutionizing how businesses operate, automating complex tasks and providing insights that were previously impossible to obtain. In this article, we explore the transformative power of AI in enterprise automation.
                        </p>

                        <h2>The Rise of Intelligent Automation</h2>
                        <p>
                            Traditional automation was limited to repetitive, rule-based tasks. Today, AI-powered automation can handle unstructured data, make decisions, and learn from experience. This shift is enabling businesses to automate end-to-end processes, from customer service to supply chain management.
                        </p>

                        <blockquote>
                            "AI is not just about replacing humans; it's about augmenting human capabilities and freeing us to focus on creative and strategic work."
                        </blockquote>

                        <h2>Key Benefits</h2>
                        <ul>
                            <li><strong>Increased Efficiency:</strong> AI operates 24/7 without fatigue, significantly speeding up processes.</li>
                            <li><strong>Reduced Errors:</strong> Automated systems eliminate human error, ensuring consistent and accurate results.</li>
                            <li><strong>Cost Savings:</strong> By automating routine tasks, businesses can reduce operational costs and allocate resources more effectively.</li>
                            <li><strong>Better Decision Making:</strong> AI analyzes vast amounts of data to provide actionable insights for better strategic decisions.</li>
                        </ul>

                        <h2>Looking Ahead</h2>
                        <p>
                            As AI technology continues to evolve, we can expect even more sophisticated automation solutions. From autonomous agents to predictive analytics, the future of enterprise automation is bright and full of potential.
                        </p>

                        <div className="mt-12 pt-8 border-t border-primary/20 flex justify-between items-center">
                            <p className="text-muted-foreground">Share this article:</p>
                            <div className="flex gap-4">
                                <Button variant="ghost" size="icon" className="hover:text-primary">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default BlogPost;
