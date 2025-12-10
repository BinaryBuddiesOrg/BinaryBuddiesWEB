import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ContactForm = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
  };

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
            Let's Build Something <span className="text-gradient">Amazing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your business? Get in touch and let's discuss your project
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Get In Touch Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass p-8 rounded-xl hover-glow">
              <h3 className="text-2xl font-bold mb-6 text-gradient text-center">Get In Touch</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email Us</h4>
                    <p className="text-muted-foreground">hello@binarybuddies.com</p>
                    <p className="text-muted-foreground">support@binarybuddies.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Call Us</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-muted-foreground">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Visit Us</h4>
                    <p className="text-muted-foreground">123 Tech Street, Innovation District</p>
                    <p className="text-muted-foreground">San Francisco, CA 94107</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Binary Buddies Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass p-8 rounded-xl hover-glow">
              <h3 className="text-2xl font-bold mb-6 text-gradient text-center">Why Choose Binary Buddies?</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "24/7 dedicated support",
                  "98% client satisfaction rate",
                  "Proven track record of 500+ projects",
                  "Expert team with 15+ years experience",
                  "Transparent pricing with no hidden fees",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="glass p-8 rounded-xl space-y-6 hover-glow">
              <h3 className="text-2xl font-bold mb-6 text-gradient text-center">Send Us a Message</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input placeholder="John" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input placeholder="Doe" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" placeholder="john@company.com" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input type="tel" placeholder="+1 (555) 123-4567" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Service Interested In</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">AI Tools & Solutions</SelectItem>
                    <SelectItem value="automation">Automation Services</SelectItem>
                    <SelectItem value="software">Software Development</SelectItem>
                    <SelectItem value="api">API Development</SelectItem>
                    <SelectItem value="product">Product Development</SelectItem>
                    <SelectItem value="ecommerce">E-commerce Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Details</label>
                <Textarea
                  placeholder="Tell us about your project..."
                  rows={5}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold py-6 shadow-glow hover:shadow-glow-strong transition-all duration-300"
              >
                Send Message
                <Send className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    </section>
  );
};
