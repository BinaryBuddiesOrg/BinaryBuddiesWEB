"use client";
import Link from "next/link";
import { Twitter, Linkedin, Github, Mail, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BlogFooter = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <img
                                src="/logo.jpg"
                                alt="Binary Buddies Logo"
                                className="w-8 h-8 object-contain rounded-full"
                            />
                            <span className="text-xl font-bold text-foreground font-lexend">
                                Binary Buddies
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                            Expert insights on AI, automation, software development, and the future of technology.
                            Stay updated with the latest trends and best practices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Explore</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/blog"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    All Articles
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Main Website
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/careers"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/privacy-policy"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms-of-service"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} Binary Buddies. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="hover:bg-primary/10 hover:text-primary transition-all"
                        >
                            <a
                                href="https://twitter.com/binarybuddies"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="hover:bg-primary/10 hover:text-primary transition-all"
                        >
                            <a
                                href="https://linkedin.com/company/binarybuddies"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="hover:bg-primary/10 hover:text-primary transition-all"
                        >
                            <a
                                href="https://github.com/binarybuddies"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="hover:bg-primary/10 hover:text-primary transition-all"
                        >
                            <a
                                href="mailto:contact@binarybuddies.in"
                                aria-label="Email"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </Button>
                    </div>

                    {/* Scroll to Top */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={scrollToTop}
                        className="gap-2 hover:bg-primary/10 hover:text-primary transition-all"
                    >
                        <span className="text-xs">Back to Top</span>
                        <ArrowUp className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            {/* Decorative Gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </footer>
    );
};
