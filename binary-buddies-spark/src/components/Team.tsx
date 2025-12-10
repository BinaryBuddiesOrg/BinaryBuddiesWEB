import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Github, Twitter } from "lucide-react";

const team = [
  {
    name: "Alex Rivera",
    role: "CEO & Co-Founder",
    specialty: "AI Strategy & Vision",
    bio: "15+ years in AI/ML with Fortune 500 experience",
    certifications: ["AWS Solutions Architect", "Google Cloud ML"],
  },
  {
    name: "Sarah Chen",
    role: "CTO & Co-Founder",
    specialty: "Software Architecture",
    bio: "Ex-Google engineer, 10+ years building scalable systems",
    certifications: ["Kubernetes Expert", "Azure DevOps"],
  },
  {
    name: "Marcus Johnson",
    role: "Head of AI",
    specialty: "Machine Learning & NLP",
    bio: "PhD in Computer Science, published AI researcher",
    certifications: ["TensorFlow Certified", "Deep Learning"],
  },
  {
    name: "Elena Kovač",
    role: "Head of Automation",
    specialty: "RPA & Hyperautomation",
    bio: "Automated processes for 100+ enterprise clients",
    certifications: ["UiPath Expert", "Automation Anywhere"],
  },
  {
    name: "David Park",
    role: "Lead Developer",
    specialty: "Full-Stack Development",
    bio: "Built 50+ production applications across industries",
    certifications: ["React Expert", "Node.js Certified"],
  },
  {
    name: "Priya Sharma",
    role: "Head of Product",
    specialty: "Product Strategy & UX",
    bio: "Launched 20+ successful SaaS products",
    certifications: ["Product Management", "UX Design"],
  },
];

export const Team = () => {
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
            Meet Our <span className="text-gradient">Expert Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Industry leaders with decades of combined experience in AI, automation, and software development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass hover-glow h-full group cursor-pointer transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  {/* Avatar Placeholder */}
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse" />
                    <span className="text-4xl font-bold text-gradient relative z-10">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-center mb-2 text-foreground group-hover:text-gradient transition-all duration-300">
                    {member.name}
                  </h3>
                  
                  <p className="text-primary text-center font-semibold mb-2">
                    {member.role}
                  </p>
                  
                  <Badge className="w-full justify-center mb-4 bg-primary/10 text-primary border-primary/20">
                    {member.specialty}
                  </Badge>
                  
                  <p className="text-muted-foreground text-center mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {member.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center justify-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-foreground">{cert}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                      <Linkedin className="w-4 h-4 text-primary" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                      <Github className="w-4 h-4 text-primary" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                      <Twitter className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    </section>
  );
};
