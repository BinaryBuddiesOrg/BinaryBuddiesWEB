"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Mail, Phone, MapPin, Send, MessageSquare, Clock, Linkedin, Twitter, Github } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const Contact = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.firstName || !formData.email || !formData.message) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/bbweb/leads/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    company: formData.company,
                    description: formData.message
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                toast({
                    title: "Message Sent!",
                    description: "Thank you for contacting us. We'll get back to you within 24 hours.",
                });
                // Reset form
                setFormData({ firstName: "", lastName: "", email: "", company: "", message: "" });
            } else {
                throw new Error(data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

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
                        <span className="text-muted-foreground font-semibold tracking-wider uppercase text-sm">
                            Get In Touch
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    >
                        <span className="text-gradient glow-text">Let's Talk</span>
                        <br />
                        <span className="text-foreground">About Your Project</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
                    >
                        We'd love to hear from you. Reach out and let's build something amazing together.
                    </motion.p>
                </div>
            </section>

            {/* Contact Information Cards */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {[
                            {
                                icon: Mail,
                                title: "Email Us",
                                content: "hello@binarybuddies.com",
                                subtext: "We reply within 24 hours"
                            },
                            {
                                icon: Phone,
                                title: "Call Us",
                                content: "+1 (555) 123-4567",
                                subtext: "Mon-Fri, 9am-6pm EST"
                            },
                            {
                                icon: MapPin,
                                title: "Visit Us",
                                content: "Remote-First Company",
                                subtext: "Offices in SF, NYC, London"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="glass hover-glow p-6 text-center group h-full">
                                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 group-hover:shadow-glow transition-all duration-300">
                                        <item.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-foreground font-semibold mb-1">{item.content}</p>
                                    <p className="text-sm text-muted-foreground">{item.subtext}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Form and Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="glass p-8">
                                <h2 className="text-3xl font-bold mb-2">
                                    <span className="text-gradient">Send us a message</span>
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName" className="text-foreground">
                                                First Name <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="John"
                                                className="mt-2 glass border-primary/30"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName" className="text-foreground">
                                                Last Name
                                            </Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Doe"
                                                className="mt-2 glass border-primary/30"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="email" className="text-foreground">
                                            Email <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="mt-2 glass border-primary/30"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="company" className="text-foreground">
                                            Company
                                        </Label>
                                        <Input
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            placeholder="Your Company"
                                            className="mt-2 glass border-primary/30"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="message" className="text-foreground">
                                            Message <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us about your project..."
                                            className="mt-2 glass border-primary/30 min-h-[150px]"
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary hover:bg-primary-glow text-primary-foreground shadow-glow hover:shadow-glow-strong"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </Button>
                                </form>
                            </Card>
                        </motion.div>

                        {/* Additional Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            {/* Response Time */}
                            <Card className="glass p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Quick Response Time</h3>
                                        <p className="text-muted-foreground">
                                            We typically respond to all inquiries within 24 hours during business days.
                                            For urgent matters, please call us directly.
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* What to Expect */}
                            <Card className="glass p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                        <MessageSquare className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">What to Expect</h3>
                                        <p className="text-muted-foreground mb-3">
                                            After you reach out, here's what happens next:
                                        </p>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>Initial response within 24 hours</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>Discovery call to understand your needs</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>Customized proposal and timeline</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>Transparent pricing and next steps</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Card>

                            {/* Social Media */}
                            <Card className="glass p-6">
                                <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                                <div className="flex gap-4">
                                    <a
                                        href="#"
                                        className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 hover:shadow-glow transition-all duration-300"
                                    >
                                        <Linkedin className="w-6 h-6 text-primary" />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 hover:shadow-glow transition-all duration-300"
                                    >
                                        <Twitter className="w-6 h-6 text-primary" />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 hover:shadow-glow transition-all duration-300"
                                    >
                                        <Github className="w-6 h-6 text-primary" />
                                    </a>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 md:py-24 bg-card/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-gradient">Frequently Asked Questions</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Quick answers to common questions
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Accordion type="single" collapsible className="space-y-4">
                            <AccordionItem value="item-1" className="glass border-primary/20 rounded-lg px-6">
                                <AccordionTrigger className="text-left hover:text-primary">
                                    How quickly can you start on a new project?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    We can typically begin discovery and planning within 1-2 weeks of initial contact.
                                    Development timelines vary based on project scope and our current capacity.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="glass border-primary/20 rounded-lg px-6">
                                <AccordionTrigger className="text-left hover:text-primary">
                                    What is your pricing model?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    We offer flexible pricing models including fixed-price projects, time and materials,
                                    and dedicated team arrangements. Pricing depends on project complexity, timeline, and requirements.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3" className="glass border-primary/20 rounded-lg px-6">
                                <AccordionTrigger className="text-left hover:text-primary">
                                    Do you work with startups or only established companies?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    We work with businesses of all sizes, from early-stage startups to Fortune 500 companies.
                                    We have experience with MVP development, scaling applications, and enterprise solutions.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4" className="glass border-primary/20 rounded-lg px-6">
                                <AccordionTrigger className="text-left hover:text-primary">
                                    What technologies do you specialize in?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    We specialize in modern web technologies (React, Node.js, TypeScript), AI/ML (Python, TensorFlow, PyTorch),
                                    cloud platforms (AWS, Azure, GCP), and automation tools. We're technology-agnostic and choose the best tools for each project.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-5" className="glass border-primary/20 rounded-lg px-6">
                                <AccordionTrigger className="text-left hover:text-primary">
                                    Do you provide ongoing support and maintenance?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Yes! We offer comprehensive support and maintenance packages to ensure your application
                                    continues to run smoothly. This includes bug fixes, updates, monitoring, and feature enhancements.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
