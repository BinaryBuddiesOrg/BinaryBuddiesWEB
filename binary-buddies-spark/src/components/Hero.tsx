import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-32 md:top-36 left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
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
            Enterprise AI & Automation Experts
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="text-foreground">Powering Innovation with</span>
          <br />
          <span className="text-gradient glow-text">AI, Automation & Cloud</span>
          <br />
          <span className="text-foreground">Solutions</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
        >
          We build enterprise-grade AI/ML solutions, intelligent automation platforms, and scalable cloud applications that drive measurable ROI for Fortune 500 companies and high-growth startups.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center flex-wrap"
        >
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow hover:shadow-glow-strong transition-all duration-300 min-w-[200px]"
          >
            <Link to="/contact">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="glass hover-glow border-primary/30 text-foreground font-semibold px-8 py-6 text-lg min-w-[200px] hover:bg-primary/10 hover:text-foreground transition-colors"
          >
            <Link to="/portfolio">
              View Our Work
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="glass hover-glow border-primary/30 text-foreground font-semibold px-8 py-6 text-lg min-w-[200px] hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Link to="/products">
              Our Products
            </Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto"
        >
          {[
            { number: "50+", label: "Enterprise Clients" },
            { number: "99.9%", label: "Uptime SLA" },
            { number: "100+", label: "Expert Engineers" },
            { number: "500+", label: "Projects Delivered" },
          ].map((stat, index) => (
            <div key={index} className="glass hover-glow p-6 rounded-xl">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};