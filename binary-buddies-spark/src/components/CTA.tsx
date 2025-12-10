import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

export const CTA = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass hover-glow max-w-4xl mx-auto p-12 md:p-16 rounded-2xl text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to <span className="text-gradient glow-text">Transform</span> Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Let's discuss how our cutting-edge solutions can help you achieve your goals. Get a free consultation today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="group bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow hover:shadow-glow-strong transition-all duration-300"
            >
              <Mail className="mr-2 w-5 h-5" />
              Contact Us
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="glass hover-glow border-primary/30 font-semibold px-8 py-6 text-lg"
            >
              Schedule a Call
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div>
              <div className="text-primary font-semibold mb-2">Response Time</div>
              <div className="text-2xl font-bold">24 Hours</div>
            </div>
            <div>
              <div className="text-primary font-semibold mb-2">Free Consultation</div>
              <div className="text-2xl font-bold">30 Minutes</div>
            </div>
            <div>
              <div className="text-primary font-semibold mb-2">Project Start</div>
              <div className="text-2xl font-bold">2 Weeks</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};