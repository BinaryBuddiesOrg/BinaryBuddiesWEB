import { motion } from "framer-motion";
import { MessageSquare, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const products = [
    {
        icon: MessageSquare,
        title: "Chatbot",
        description: "AI-powered customer support chatbot that engages visitors 24/7 and boosts conversion rates.",
        tags: ["AI", "Chatbot", "Support"],
        color: "primary",
        link: "/products/chatbot",
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    hover: { y: -5 }
};

export const OurProducts = () => {
    return (
        <section id="products" className="relative py-24 overflow-hidden bg-secondary/5">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Our <span className="text-gradient">Products</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Innovative tools designed to accelerate your digital transformation
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-6"
                >
                    {products.map((product, index) => (
                        <motion.div key={index} variants={item} whileHover="hover" className="w-full max-w-sm">
                            <Card className="glass h-full flex flex-col overflow-hidden border-primary/10 hover:border-primary/30 transition-colors duration-300">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg bg-${product.color}/10 flex items-center justify-center mb-4`}>
                                        <product.icon className={`w-6 h-6 text-${product.color}`} />
                                    </div>
                                    <CardTitle className="text-xl">{product.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription className="text-base mb-4">
                                        {product.description}
                                    </CardDescription>
                                    <div className="flex flex-wrap gap-2">
                                        {product.tags.map((tag, i) => (
                                            <span key={i} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    {product.link ? (
                                        <Button asChild variant="outline" className="w-full group">
                                            <Link to={product.link}>
                                                Learn More
                                                <Globe className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button variant="outline" className="w-full group" disabled>
                                            Coming Soon
                                            <Globe className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </section>
    );
};
