import { motion } from "framer-motion";
import { Shield, Award, Users, TrendingUp } from "lucide-react";

const indicators = [
  {
    icon: Shield,
    title: "ISO 27001 Certified",
    description: "Enterprise-grade security",
  },
  {
    icon: Award,
    title: "Industry Leader",
    description: "Award-winning solutions",
  },
  {
    icon: Users,
    title: "500+ Clients",
    description: "Trusted worldwide",
  },
  {
    icon: TrendingUp,
    title: "98% Success Rate",
    description: "Proven track record",
  },
];

export const TrustIndicators = () => {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Why <span className="text-gradient">Trust Us?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're committed to excellence, security, and delivering results that exceed expectations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {indicators.map((indicator, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass hover-glow p-8 rounded-xl text-center group cursor-pointer"
            >
              <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4 group-hover:shadow-glow transition-all duration-300">
                <indicator.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{indicator.title}</h3>
              <p className="text-muted-foreground">{indicator.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Client Logos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-muted-foreground mb-8 uppercase tracking-wider text-sm">
            Trusted by Leading Companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-32 h-12 glass rounded-lg flex items-center justify-center text-primary font-bold"
              >
                LOGO {i + 1}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};