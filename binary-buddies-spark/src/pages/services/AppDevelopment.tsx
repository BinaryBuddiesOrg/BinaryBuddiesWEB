import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Smartphone, 
  Tablet, 
  Phone, 
  Zap, 
  ShoppingCart, 
  Gamepad2,
  CheckCircle2,
  ArrowRight,
  Code,
  Layers,
  Rocket,
  Shield,
  Globe,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Tablet,
    title: "iOS App Development",
    description: "Native iOS applications using Swift and SwiftUI. Optimized for iPhone and iPad with seamless App Store integration and Apple ecosystem compatibility."
  },
  {
    icon: Phone,
    title: "Android App Development",
    description: "Native Android apps built with Kotlin and Java. Material Design principles, Google Play Store optimization, and Android ecosystem integration."
  },
  {
    icon: Globe,
    title: "Cross-Platform Development",
    description: "React Native, Flutter, and Xamarin solutions for iOS and Android. Single codebase, faster development, and consistent user experience across platforms."
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Mobile Apps",
    description: "Feature-rich shopping apps with secure payments, product catalogs, wishlists, order tracking, and customer loyalty programs."
  },
  {
    icon: Gamepad2,
    title: "Gaming Apps",
    description: "Engaging mobile games with stunning graphics, smooth gameplay, multiplayer features, and in-app purchases. Unity and Unreal Engine expertise."
  },
  {
    icon: Users,
    title: "Social Media Apps",
    description: "Interactive social platforms with real-time messaging, content sharing, user profiles, and community features."
  },
  {
    icon: Zap,
    title: "Enterprise Mobile Apps",
    description: "Business applications for internal operations, field services, CRM integration, and workflow automation."
  },
  {
    icon: Shield,
    title: "App Maintenance & Support",
    description: "Ongoing updates, bug fixes, performance optimization, security patches, and feature enhancements."
  }
];

const technologies = [
  "Swift", "SwiftUI", "Objective-C", "Kotlin", "Java",
  "React Native", "Flutter", "Dart", "Xamarin", "Ionic",
  "Unity", "Unreal Engine", "Firebase", "AWS Amplify",
  "REST APIs", "GraphQL", "Push Notifications",
  "App Store", "Google Play", "CI/CD", "TestFlight"
];

const platforms = [
  {
    icon: Tablet,
    title: "iOS Development",
    description: "Native iOS apps for iPhone, iPad, Apple Watch, and Apple TV",
    features: ["Swift & SwiftUI", "App Store Optimization", "ARKit Integration", "Core ML"]
  },
  {
    icon: Phone,
    title: "Android Development",
    description: "Native Android apps with Material Design and Google services",
    features: ["Kotlin & Java", "Material Design", "Google Play Integration", "Android Jetpack"]
  },
  {
    icon: Globe,
    title: "Cross-Platform",
    description: "Single codebase for iOS and Android with React Native or Flutter",
    features: ["React Native", "Flutter", "Faster Development", "Cost Effective"]
  }
];

const benefits = [
  {
    title: "Native Performance",
    description: "Optimized apps with smooth animations and fast load times"
  },
  {
    title: "User-Centric Design",
    description: "Intuitive interfaces following platform-specific design guidelines"
  },
  {
    title: "Secure & Compliant",
    description: "Built with security best practices and app store compliance"
  },
  {
    title: "Scalable Architecture",
    description: "Designed to handle growth and increasing user base"
  }
];

export default function AppDevelopment() {
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
              <span className="text-gradient glow-text">App Development</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Build powerful, engaging mobile applications for iOS and Android that connect with 
              users, drive engagement, and deliver exceptional experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow">
                <Link to="/contact">Start Your App</Link>
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
                Mobile Apps That <span className="text-gradient">Drive Results</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                At Binary Buddies, we create mobile applications that users love. Whether you need 
                a native iOS app, Android app, or a cross-platform solution, we deliver high-quality 
                mobile experiences that engage users and drive business growth.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our expertise spans native development, cross-platform frameworks, and emerging 
                technologies. We follow platform-specific design guidelines, ensure optimal 
                performance, and implement robust security measures for app store approval.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold">App Store Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Cross-Platform</span>
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
                  <Tablet className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>iOS Apps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Native iOS development</p>
                </CardContent>
              </Card>
              <Card className="glass hover-glow border-primary/20">
                <CardHeader>
                  <Phone className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Android Apps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Native Android development</p>
                </CardContent>
              </Card>
              <Card className="glass hover-glow border-primary/20">
                <CardHeader>
                  <Globe className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Cross-Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">React Native & Flutter</p>
                </CardContent>
              </Card>
              <Card className="glass hover-glow border-primary/20">
                <CardHeader>
                  <Gamepad2 className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Gaming Apps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Mobile game development</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Development Platforms</h2>
            <p className="text-xl text-muted-foreground">
              Choose the right approach for your mobile app
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="glass hover-glow border-primary/20 h-full">
                  <CardHeader>
                    <platform.icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle>{platform.title}</CardTitle>
                    <CardDescription className="text-base mb-4">
                      {platform.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {platform.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our App Development Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive mobile app solutions from concept to app store
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
      <section className="py-20 bg-card/30">
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
              Modern tech stack for cutting-edge mobile apps
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Our App Development?</h2>
            <p className="text-xl text-muted-foreground">
              Delivering excellence in every mobile app
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
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass hover-glow border-primary/30 rounded-2xl p-12 text-center max-w-4xl mx-auto"
          >
            <Smartphone className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Ready to Build Your Mobile App?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's create an app that users love and drives business growth
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow">
                <Link to="/contact">
                  Start Your App
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

