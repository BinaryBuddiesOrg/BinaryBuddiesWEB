import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Github, Twitter, Loader2, AlertCircle } from "lucide-react";
import { useTeam } from "@/hooks/useTeam";

export const Team = () => {
  const { data: team, isLoading, error } = useTeam();

  if (isLoading) {
    return (
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-lg text-muted-foreground">Failed to load team members. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

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
            Meet Our <span className="text-gradient">Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Industry experts passionate about transforming businesses through AI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team?.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass hover-glow h-full group cursor-pointer transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent p-1">
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                          <span className="text-4xl font-bold text-gradient">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">✓</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-2 group-hover:text-gradient transition-all duration-300">
                      {member.name}
                    </h3>

                    <p className="text-primary font-semibold mb-2">{member.role}</p>

                    <Badge variant="outline" className="mb-4">
                      {member.specialty}
                    </Badge>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {member.bio}
                    </p>

                    <div className="space-y-2 mb-6 w-full">
                      {member.certifications.map((cert, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-foreground">{cert}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 mt-auto">
                      {member.linkedin_url && (
                        <a href={member.linkedin_url} className="text-muted-foreground hover:text-primary transition-colors">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.github_url && (
                        <a href={member.github_url} className="text-muted-foreground hover:text-primary transition-colors">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {member.twitter_url && (
                        <a href={member.twitter_url} className="text-muted-foreground hover:text-primary transition-colors">
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
    </section>
  );
};
