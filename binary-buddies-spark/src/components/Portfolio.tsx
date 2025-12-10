import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "AI-Powered Healthcare Platform",
    category: "Healthcare",
    description: "Revolutionized patient care with predictive analytics and automated diagnosis assistance.",
    results: ["50% faster diagnosis", "98% accuracy rate", "500+ hospitals"],
    tags: ["AI", "Machine Learning", "Healthcare"],
    gradient: "from-primary/20 to-accent/20",
  },
  {
    title: "E-commerce Automation Suite",
    category: "Retail",
    description: "Complete automation solution handling inventory, orders, and customer service.",
    results: ["70% cost reduction", "24/7 automation", "1M+ transactions/day"],
    tags: ["Automation", "E-commerce", "RPA"],
    gradient: "from-accent/20 to-primary/20",
  },
  {
    title: "Fintech Mobile Application",
    category: "Finance",
    description: "Secure mobile banking solution with AI fraud detection and real-time analytics.",
    results: ["Zero security breaches", "2M+ active users", "4.8★ rating"],
    tags: ["Fintech", "Mobile", "Security"],
    gradient: "from-primary/20 to-accent/20",
  },
  {
    title: "IoT Manufacturing Platform",
    category: "Manufacturing",
    description: "Connected factory solution with predictive maintenance and real-time monitoring.",
    results: ["40% downtime reduction", "100+ factories", "Real-time insights"],
    tags: ["IoT", "Analytics", "Industry 4.0"],
    gradient: "from-accent/20 to-primary/20",
  },
  {
    title: "AI Content Generation Tool",
    category: "Marketing",
    description: "Advanced content creation platform powered by GPT-4 and custom ML models.",
    results: ["10x content output", "95% satisfaction", "50K+ users"],
    tags: ["AI", "NLP", "SaaS"],
    gradient: "from-primary/20 to-accent/20",
  },
  {
    title: "Smart City Dashboard",
    category: "Government",
    description: "Comprehensive city management system with real-time data visualization.",
    results: ["30% efficiency gain", "500K+ citizens", "Award-winning"],
    tags: ["Big Data", "Visualization", "Smart City"],
    gradient: "from-accent/20 to-primary/20",
  },
];

export const Portfolio = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-world solutions delivering measurable impact across industries
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass hover-glow h-full group cursor-pointer transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className={`h-48 rounded-lg bg-gradient-to-br ${project.gradient} mb-6 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse" />
                    <span className="text-5xl font-bold text-gradient relative z-10">
                      {project.category.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  
                  <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                    {project.category}
                  </Badge>
                  
                  <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-gradient transition-all duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {project.results.map((result, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-foreground font-medium">{result}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex items-center text-primary font-semibold group-hover:gap-3 gap-2 transition-all duration-300">
                    View Case Study
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
    </section>
  );
};
