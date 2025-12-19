"use client";
import { Portfolio as PortfolioComponent } from "@/components/Portfolio";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const Portfolio = () => {
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
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Briefcase className="w-6 h-6 text-primary animate-pulse" />
                            <span className="text-muted-foreground font-semibold tracking-wider uppercase text-sm">
                                Our Work
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="text-gradient glow-text">Portfolio</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Explore our successful projects and see how we've helped businesses transform with AI and automation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Portfolio Component */}
            <PortfolioComponent />

            <Footer />
        </div>
    );
};

export default Portfolio;
