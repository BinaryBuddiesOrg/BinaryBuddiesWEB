"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Bot,
    MessageSquare,
    Zap,
    Palette,
    BarChart3,
    Globe,
    Clock,
    Shield,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    Code,
    Settings,
    Rocket,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

const stats = [
    { number: "24/7", label: "Always Available", icon: Clock },
    { number: "2 min", label: "Integration Time", icon: Zap },
    { number: "90%+", label: "Query Resolution", icon: CheckCircle2 },
    { number: "50+", label: "Platform Integrations", icon: Globe },
];

const features = [
    {
        icon: Globe,
        title: "Multi-Platform Integration",
        description: "Seamlessly integrate with any website, web app, mobile app, or software. Works with React, Angular, Vue, WordPress, Shopify, and more."
    },
    {
        icon: Palette,
        title: "Custom Branding & Themes",
        description: "Fully customizable appearance to match your brand. Choose colors, fonts, avatar, and chat bubble styles that reflect your identity."
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        description: "Comprehensive insights into conversations, user behavior, popular queries, and resolution rates. Make data-driven decisions."
    },
    {
        icon: Sparkles,
        title: "AI-Powered Understanding",
        description: "Advanced natural language processing understands context, handles complex queries, and provides accurate, helpful responses."
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "End-to-end encryption, GDPR compliance, and enterprise-grade security. Your data and your customers' data stay protected."
    },
    {
        icon: Settings,
        title: "Easy Configuration",
        description: "No-code setup with intuitive dashboard. Train your chatbot, manage responses, and configure behavior without any technical expertise."
    },
];

const steps = [
    {
        step: "01",
        title: "Sign Up & Create",
        description: "Create your account and set up your first chatbot in minutes. No credit card required to start.",
        icon: Bot
    },
    {
        step: "02",
        title: "Configure & Train",
        description: "Upload your knowledge base, customize responses, and train your AI to understand your business.",
        icon: Settings
    },
    {
        step: "03",
        title: "Deploy & Scale",
        description: "Copy a simple code snippet and paste it into your website. Go live instantly and scale as you grow.",
        icon: Rocket
    },
];

const demoImages = [
    {
        src: "/images/chatbot/dashboard-main.png",
        title: "Powerful Dashboard",
        description: "Monitor all conversations, analytics, and settings from one central hub"
    },
    {
        src: "/images/chatbot/chat-widget.png",
        title: "Elegant Chat Widget",
        description: "Beautiful, responsive widget that looks great on any device"
    },
    {
        src: "/images/chatbot/customization.png",
        title: "Full Customization",
        description: "Tailor every aspect of your chatbot to match your brand"
    },
    {
        src: "/images/chatbot/themes.png",
        title: "Theme Options",
        description: "Choose from multiple themes or create your own custom look"
    },
];

export default function Chatbot() {
    return (
        <div className="relative min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-hero opacity-50" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                                    AI-Powered Chatbot
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6">
                                <span className="text-gradient glow-text">Chatbot</span>
                                <br />
                                <span className="text-foreground text-4xl md:text-5xl">Your 24/7 AI Assistant</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                                Integrate a powerful AI chatbot into any website or software in just{" "}
                                <span className="text-primary font-bold">2 minutes</span>.
                                Boost conversions, automate support, and delight your customers around the clock.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow">
                                    <a href="https://chatbot.binarybuddies.in/" target="_blank" rel="noopener noreferrer">
                                        Try It Now
                                        <ExternalLink className="ml-2 w-5 h-5" />
                                    </a>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="glass hover-glow border-primary/30 px-8 py-6 text-lg">
                                    <Link href="/contact">Book a Demo</Link>
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
                                <img
                                    src="/images/chatbot/hero.png"
                                    alt="Chatbot Dashboard Preview"
                                    className="w-full h-auto"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                            </div>
                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-card/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-7 h-7 text-primary" />
                                </div>
                                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Everything You Need to <span className="text-gradient">Automate Support</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed to help you engage customers and scale your business
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                            >
                                <Card className="glass hover-glow border-primary/20 h-full">
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <feature.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Showcase Section */}
            <section className="py-24 bg-card/30">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            See <span className="text-gradient">Chatbot</span> in Action
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            A glimpse into the powerful features and intuitive interface
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {demoImages.map((image, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-card hover-glow transition-all duration-300">
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={image.src}
                                            alt={image.title}
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                                        <p className="text-muted-foreground">{image.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Get Started in <span className="text-gradient">3 Simple Steps</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            From signup to live chatbot in minutes, not days
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.15 }}
                                className="relative"
                            >
                                <Card className="glass hover-glow border-primary/20 h-full text-center">
                                    <CardHeader>
                                        <div className="relative mb-4">
                                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                                <step.icon className="w-10 h-10 text-primary" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                                {step.step}
                                            </div>
                                        </div>
                                        <CardTitle className="text-2xl">{step.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            {step.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                                {/* Connector line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Integration Code Preview */}
            <section className="py-20 bg-card/30">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-bold mb-6">
                                Integration is <span className="text-gradient">This Simple</span>
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                Just copy and paste a single code snippet into your website. That's it!
                                No complex setup, no dependencies, no configuration files.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Works with any website or web app",
                                    "No npm packages or build steps required",
                                    "Automatically loads and initializes",
                                    "Updates happen automatically"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="glass rounded-xl overflow-hidden border-primary/20">
                                <div className="flex items-center gap-2 px-4 py-3 bg-card/50 border-b border-primary/10">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    </div>
                                    <span className="text-sm text-muted-foreground ml-2">index.html</span>
                                </div>
                                <pre className="p-6 overflow-x-auto text-sm">
                                    <code className="text-muted-foreground">
                                        {`<!-- Add this before </body> -->
<script
  src="https://chatbot.binarybuddies.in/widget.js"
  data-chatbot-id="YOUR_CHATBOT_ID"
  async>
</script>`}
                                    </code>
                                </pre>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* CTA Section */}
            < section className="py-24" >
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="glass hover-glow border-primary/30 rounded-2xl p-12 text-center max-w-4xl mx-auto"
                    >
                        <MessageSquare className="w-16 h-16 text-primary mx-auto mb-6" />
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Ready to Transform Your Customer Experience?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join hundreds of businesses already using Chatbot to automate support,
                            increase conversions, and delight customers 24/7.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow">
                                <a href="https://chatbot.binarybuddies.in/" target="_blank" rel="noopener noreferrer">
                                    Start Free Trial
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </a>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="glass hover-glow border-primary/30 px-8 py-6 text-lg">
                                <Link href="/contact">Schedule Demo</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section >

            <Footer />
        </div >
    );
}
