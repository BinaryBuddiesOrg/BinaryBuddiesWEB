import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What services does Binary Buddies offer?",
    answer: "We specialize in AI tools and solutions, automation services, custom software development, API development, product development, and e-commerce solutions. Our team handles everything from initial strategy to deployment and ongoing support.",
  },
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on complexity and scope. An MVP can take 4-8 weeks, while enterprise solutions typically require 3-6 months. We provide detailed timelines during the discovery phase and maintain transparent communication throughout.",
  },
  {
    question: "Do you work with startups or only enterprises?",
    answer: "We work with both! From early-stage startups building their MVP to Fortune 500 companies scaling their operations, we tailor our approach to meet your specific needs and budget.",
  },
  {
    question: "What technologies do you specialize in?",
    answer: "Our tech stack includes React, Node.js, Python, TensorFlow, AWS, Azure, Google Cloud, and more. We stay current with the latest technologies and choose the best tools for each project's requirements.",
  },
  {
    question: "How do you ensure project success?",
    answer: "We follow agile methodologies with regular sprints, maintain constant communication, conduct thorough testing, and provide comprehensive documentation. Our 98% client satisfaction rate speaks to our commitment to excellence.",
  },
  {
    question: "What kind of support do you provide after launch?",
    answer: "We offer 24/7 support, regular maintenance, performance monitoring, security updates, and continuous optimization. Our support packages are flexible and can be customized to your needs.",
  },
  {
    question: "How do you handle data security and compliance?",
    answer: "Security is our top priority. We follow industry best practices, implement end-to-end encryption, conduct regular security audits, and ensure compliance with GDPR, HIPAA, and other relevant regulations.",
  },
  {
    question: "Can you integrate with our existing systems?",
    answer: "Absolutely! We specialize in system integration and have experience connecting various platforms, databases, and third-party services. We ensure seamless integration with minimal disruption to your operations.",
  },
  {
    question: "What is your pricing model?",
    answer: "We offer flexible pricing models including fixed-price projects, time and materials, and retainer agreements. After understanding your requirements, we provide transparent quotes with no hidden fees.",
  },
  {
    question: "How do we get started?",
    answer: "Simply reach out through our contact form or schedule a free consultation. We'll discuss your needs, provide initial recommendations, and outline the next steps to bring your project to life.",
  },
];

export const FAQ = () => {
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
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about working with Binary Buddies
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass px-8 rounded-xl border-primary/20 hover-glow"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-gradient hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    </section>
  );
};
