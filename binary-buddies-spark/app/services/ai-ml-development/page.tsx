"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  Bot,
  Eye,
  MessageSquare,
  TrendingUp,
  Zap,
  CheckCircle2,
  ArrowRight,
  Cloud,
  Database,
  Shield,
  Rocket,
  Sparkles,
  BarChart3,
  Cpu
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Brain,
    title: "AI Strategy & Consulting",
    description: "Discovery workshops to assess processes, data, and infrastructure. We identify high-ROI AI use cases and craft scalable, domain-specific roadmaps with implementation strategies."
  },
  {
    icon: Bot,
    title: "ML Development & Consulting",
    description: "End-to-end ML pipelines for data processing, training, and optimization. Using supervised, unsupervised, and reinforcement learning to create intelligent, adaptive models."
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics & Forecasting",
    description: "ML-driven predictive analytics to forecast customer churn, sales trends, maintenance needs, and risk exposure. Complemented with prescriptive analytics for optimal decisions."
  },
  {
    icon: MessageSquare,
    title: "Natural Language Processing (NLP)",
    description: "NLP solutions enabling systems to read, interpret, and respond to human language. From automating document workflows to powering intelligent chatbots with state-of-the-art language models."
  },
  {
    icon: Eye,
    title: "Computer Vision Development",
    description: "AI systems to interpret images, video, and real-world objects. Ideal for automated inspection, facial recognition, and security with high accuracy in complex environments."
  },
  {
    icon: Zap,
    title: "AI for Business Process Automation",
    description: "Enhance traditional RPA with cognitive capabilities, making workflows adaptive, context-aware, and efficient. AI agents optimize operational data and trigger autonomous actions."
  },
  {
    icon: Cloud,
    title: "AI on Cloud & Edge",
    description: "Seamless model integration and inference, deploying via FastAPI/Flask, served with TorchServe or TensorFlow, containerized with Docker, and orchestrated using Kubernetes."
  },
  {
    icon: Sparkles,
    title: "Generative AI",
    description: "Advanced Generative AI solutions enabling enterprises to create intelligent systems that produce human-like text, images, and insights. RAG-powered knowledge systems and custom model fine-tuning."
  },
  {
    icon: Cpu,
    title: "Deep Learning",
    description: "Cutting-edge neural networks that optimize processes, improve decision-making, and turn data into actionable insights, effectively transforming business outcomes."
  },
  {
    icon: MessageSquare,
    title: "Chatbot Development",
    description: "Conversational AI solutions that automate customer and employee interactions with human-like understanding. Integrated with ERP, CRM, and workflows for multilingual service."
  },
  {
    icon: Database,
    title: "RAG Development Services",
    description: "RAG solutions combining AI models with enterprise knowledge bases, enabling intelligent document search, real-time answers, and context-aware recommendations."
  },
  {
    icon: Shield,
    title: "AI Risk, Ethics & Compliance",
    description: "Build responsible AI systems aligning with industry standards, regulations, and public trust. Address ethical, legal, and regulatory challenges in AI decision-making."
  }
];

const approach = [
  {
    title: "Discovery & Assessment",
    description: "Identify the best-fit AI/ML use cases for your business",
    icon: BarChart3
  },
  {
    title: "Data Engineering",
    description: "Clean, prepare, and structure data pipelines",
    icon: Database
  },
  {
    title: "Model Development",
    description: "Select the appropriate ML algorithms",
    icon: Brain
  },
  {
    title: "Testing & Validation",
    description: "Evaluate accuracy, reduce bias",
    icon: Shield
  },
  {
    title: "Deployment & Monitoring",
    description: "Continuous training and performance optimization",
    icon: Rocket
  },
  {
    title: "Maintenance & Evolution",
    description: "Ensure adaptability to changing business needs",
    icon: Zap
  }
];

const stats = [
  { number: "12+", label: "Years of Industry Expertise" },
  { number: "100+", label: "AI Developers and Consultants" },
  { number: "24x7", label: "Expert Support Available" },
  { number: "550+", label: "Talented Workforce" }
];

export default function AIMLDevelopment() {
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
              <span className="text-muted-foreground font-semibold tracking-wider uppercase text-sm">
                Predict + Adapt + Automate
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient glow-text">AI & ML</span>
              <br />
              <span className="text-foreground">Development Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Transforming businesses with intelligent solutions that learn, adapt, and deliver
              measurable results. From predictive analytics to generative AI, we build algorithms
              that transform your business outcomes.
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow">
                <Link href="/contact">Talk to Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card/30">
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
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
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
                Drive Intelligence, <span className="text-gradient">Deliver Results</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                At Binary Buddies, with 12+ years of expertise, we build algorithms and architect
                intelligent systems that learn, adapt, and transform your business outcomes. Our AI
                and ML services go beyond traditional automation, empowering you to discover patterns,
                extract actionable insights, and make real-time, data-driven decisions.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                From predictive maintenance in manufacturing to intelligent chatbots in customer service,
                and AI-powered risk scoring in finance, our solutions are designed to augment human
                intelligence and maximize business potential. We deliver custom AI/ML development
                services tailored to your domain, ensuring speed, accuracy, and compliance across every
                AI touchpoint.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Domain-Specific Solutions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Ethical AI Practices</span>
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
                  <Brain className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>AI Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Custom AI roadmaps for your business</p>
                </CardContent>
              </Card>
              <Card className="glass hover-glow border-primary/20">
                <CardHeader>
                  <Bot className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>ML Pipelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">End-to-end machine learning solutions</p>
                </CardContent>
              </Card>
              <Card className="glass hover-glow border-primary/20">
                <CardHeader>
                  <Sparkles className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Generative AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">RAG-powered knowledge systems</p>
                </CardContent>
              </Card>
              <Card className="glass hover-glow border-primary/20">
                <CardHeader>
                  <Eye className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Computer Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Image and video analysis solutions</p>
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
            <h2 className="text-4xl font-bold mb-4">Our AI & ML Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              For end-to-end AI-powered workflows
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
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

      {/* Approach Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our AI-Driven Approach</h2>
            <p className="text-xl text-muted-foreground">
              Transforming data into intelligent solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approach.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="glass hover-glow border-primary/20 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">{index + 1}</span>
                      </div>
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {step.description}
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
            <Brain className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">
              Unlock Smarter Workflows, Faster Insights, and Scalable Automation
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get started today with our AI & ML development services
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow">
                <Link href="/contact">
                  Start Your AI Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}




