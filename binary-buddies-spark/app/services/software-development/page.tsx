"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code2,
  Cloud,
  Database,
  Shield,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  Settings,
  GitBranch,
  Lock,
  Rocket
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Code2,
    title: "Custom Software Development",
    description: "Tailored solutions built from scratch to meet your unique business requirements and workflows."
  },
  {
    icon: Cloud,
    title: "Cloud-Native Applications",
    description: "Scalable, resilient applications designed for cloud infrastructure with microservices architecture."
  },
  {
    icon: Database,
    title: "Enterprise Software Solutions",
    description: "Robust enterprise-grade applications with advanced data management and integration capabilities."
  },
  {
    icon: Shield,
    title: "Secure Application Development",
    description: "Security-first approach with built-in encryption, authentication, and compliance standards."
  },
  {
    icon: Zap,
    title: "API Development & Integration",
    description: "RESTful and GraphQL APIs with seamless third-party integrations and real-time data synchronization."
  },
  {
    icon: Settings,
    title: "Legacy System Modernization",
    description: "Transform outdated systems into modern, efficient applications with improved performance."
  }
];

const technologies = [
  "Python", "Java", "C#", ".NET", "Node.js", "Go", "Rust",
  "React", "Angular", "Vue.js", "TypeScript",
  "PostgreSQL", "MongoDB", "Redis", "MySQL",
  "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
  "Microservices", "Serverless", "CI/CD", "DevOps"
];

const benefits = [
  {
    title: "Scalable Architecture",
    description: "Built to grow with your business, handling increased load and users seamlessly."
  },
  {
    title: "Agile Methodology",
    description: "Iterative development with continuous feedback and rapid deployment cycles."
  },
  {
    title: "Quality Assurance",
    description: "Comprehensive testing including unit, integration, and end-to-end testing."
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock monitoring, maintenance, and support for your applications."
  }
];

export default function SoftwareDevelopment() {
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient glow-text">Software Development</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Transform your business with custom software solutions engineered for performance,
              scalability, and innovation.
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow">
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Enterprise-Grade <span className="text-gradient">Software Solutions</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                At Binary Buddies, we specialize in developing custom software that drives business
                transformation. Our expert team combines cutting-edge technologies with proven
                methodologies to deliver solutions that are robust, scalable, and future-ready.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Whether you need a complete enterprise application, API development, or legacy system
                modernization, we provide end-to-end software development services tailored to your
                specific industry needs and business objectives.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold">500+ Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold">98% Success Rate</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <Card className="glass hover-glow border-primary/20">
                <CardHeader>
                  <Code2 className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Custom Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Tailored solutions for your unique needs</p>
                </CardContent>
              </Card>
              <Card className="glass hover-glow border-primary/20">
                <CardHeader>
                  <Cloud className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Cloud Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Scalable cloud-native applications</p>
                </CardContent>
              </Card>
              <Card className="glass hover-glow border-primary/20">
                <CardHeader>
                  <Database className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Enterprise Apps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Robust enterprise-grade software</p>
                </CardContent>
              </Card>
              <Card className="glass hover-glow border-primary/20">
                <CardHeader>
                  <Shield className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Secure by Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Security-first development approach</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Software Development Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive software solutions from concept to deployment and beyond
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="glass hover-glow border-primary/20 h-full">
                  <CardHeader>
                    <service.icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Technologies We Work With</h2>
            <p className="text-xl text-muted-foreground">
              Modern tech stack for cutting-edge solutions
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="glass hover-glow border-primary/20 px-6 py-3 rounded-full">
                  <span className="text-sm font-medium">{tech}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Binary Buddies?</h2>
            <p className="text-xl text-muted-foreground">
              Delivering excellence in every project
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="glass hover-glow border-primary/20 h-full text-center">
                  <CardHeader>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass hover-glow border-primary/30 rounded-2xl p-12 text-center max-w-4xl mx-auto"
          >
            <Rocket className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Ready to Build Your Software Solution?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's discuss how we can transform your ideas into powerful software applications
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow">
                <Link href="/contact">
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="glass hover-glow border-primary/30 px-8 py-6 text-lg">
                <Link href="/contact">Get Free Consultation</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}




