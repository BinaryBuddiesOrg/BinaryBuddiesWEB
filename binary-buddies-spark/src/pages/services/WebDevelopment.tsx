import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Globe, 
  Smartphone, 
  Zap, 
  ShoppingCart, 
  Lock, 
  Search,
  CheckCircle2,
  ArrowRight,
  Code,
  Palette,
  Server,
  Rocket,
  MonitorSmartphone,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Globe,
    title: "Frontend Development",
    description: "Modern, responsive web applications using React, Vue.js, Angular, and Next.js. Pixel-perfect designs with smooth animations and optimal user experience."
  },
  {
    icon: Server,
    title: "Backend Development",
    description: "Robust server-side solutions with Node.js, Python, PHP, and .NET. RESTful APIs, microservices architecture, and scalable infrastructure."
  },
  {
    icon: MonitorSmartphone,
    title: "Full-Stack Development",
    description: "End-to-end web solutions from frontend to backend. Seamless integration, optimized performance, and comprehensive functionality."
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Development",
    description: "Feature-rich online stores with payment gateways, inventory management, order tracking, and customer portals. Shopify, WooCommerce, and custom solutions."
  },
  {
    icon: Search,
    title: "SEO-Optimized Websites",
    description: "Websites built for search engine visibility. Fast loading times, mobile-first design, structured data, and content optimization."
  },
  {
    icon: Lock,
    title: "Secure Web Applications",
    description: "Security-first development with SSL certificates, data encryption, secure authentication, and compliance with industry standards."
  },
  {
    icon: Zap,
    title: "Progressive Web Apps (PWA)",
    description: "Web applications that work like native apps. Offline functionality, push notifications, and app-like user experience."
  },
  {
    icon: Layers,
    title: "CMS Development",
    description: "Custom content management systems and WordPress, Drupal, and headless CMS solutions. Easy content updates and management."
  }
];

const technologies = [
  "React", "Vue.js", "Angular", "Next.js", "Nuxt.js",
  "Node.js", "Express", "Python", "Django", "Flask",
  "PHP", "Laravel", "TypeScript", "JavaScript",
  "HTML5", "CSS3", "SASS", "Tailwind CSS",
  "MongoDB", "PostgreSQL", "MySQL", "Redis",
  "AWS", "Azure", "Vercel", "Netlify",
  "Docker", "Kubernetes", "CI/CD"
];

const benefits = [
  {
    title: "Responsive Design",
    description: "Perfect display on all devices - desktop, tablet, and mobile"
  },
  {
    title: "Fast Performance",
    description: "Optimized for speed with minimal load times and smooth interactions"
  },
  {
    title: "SEO Friendly",
    description: "Built with search engine optimization best practices"
  },
  {
    title: "Scalable Architecture",
    description: "Grows with your business needs and user base"
  }
];

export default function WebDevelopment() {
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
              <span className="text-gradient glow-text">Web Development</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Create stunning, high-performance websites and web applications that engage users, 
              drive conversions, and scale with your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow">
                <Link to="/contact">Start Your Project</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="glass hover-glow border-primary/30 px-8 py-6 text-lg">
                <Link to="/contact">View Portfolio</Link>
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
                Modern Web Solutions for <span className="text-gradient">Digital Success</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                At Binary Buddies, we craft exceptional web experiences that combine cutting-edge 
                technology with intuitive design. Our web development services cover everything from 
                simple business websites to complex web applications and e-commerce platforms.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                We specialize in responsive, mobile-first designs that work flawlessly across all 
                devices. Our full-stack expertise ensures seamless integration between frontend and 
                backend, delivering fast, secure, and scalable web solutions.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Mobile-First Design</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold">SEO Optimized</span>
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
                  <Globe className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Frontend</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Modern, responsive interfaces</p>
                </CardContent>
              </Card>
              <Card className="glass hover-glow border-primary/20">
                <CardHeader>
                  <Server className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Backend</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Robust server-side solutions</p>
                </CardContent>
              </Card>
              <Card className="glass hover-glow border-primary/20">
                <CardHeader>
                  <ShoppingCart className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>E-commerce</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Online store solutions</p>
                </CardContent>
              </Card>
              <Card className="glass hover-glow border-primary/20">
                <CardHeader>
                  <Zap className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>PWA</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Progressive web apps</p>
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
            <h2 className="text-4xl font-bold mb-4">Our Web Development Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive web solutions from design to deployment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <h2 className="text-4xl font-bold mb-4">Technologies We Use</h2>
            <p className="text-xl text-muted-foreground">
              Modern tech stack for cutting-edge web solutions
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
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Web Development?</h2>
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
            <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Ready to Build Your Web Presence?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's create a stunning website that drives results for your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow">
                <Link to="/contact">
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="glass hover-glow border-primary/30 px-8 py-6 text-lg">
                <Link to="/contact">Get Free Consultation</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

