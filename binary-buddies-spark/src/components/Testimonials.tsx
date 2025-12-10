import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jennifer Martinez",
    role: "CTO, HealthTech Solutions",
    company: "Fortune 500 Healthcare",
    content: "Binary Buddies transformed our operations with their AI solution. We've seen a 60% increase in efficiency and our patient satisfaction scores have never been higher.",
    rating: 5,
    image: "JM",
  },
  {
    name: "Robert Chen",
    role: "CEO, FinanceFlow",
    company: "Leading Fintech Startup",
    content: "The automation platform they built saved us millions. Their expertise in both technology and business process is unmatched. Best investment we've made.",
    rating: 5,
    image: "RC",
  },
  {
    name: "Amanda Williams",
    role: "VP of Engineering, RetailMax",
    company: "Global E-commerce Leader",
    content: "Working with Binary Buddies was a game-changer. Their team delivered ahead of schedule and the quality exceeded our expectations. Highly recommended!",
    rating: 5,
    image: "AW",
  },
  {
    name: "Michael Torres",
    role: "Director of IT, ManufacturePro",
    company: "Industrial Manufacturing",
    content: "Their IoT solution revolutionized our factory floor. Real-time insights and predictive maintenance have reduced our downtime by 40%. Exceptional work!",
    rating: 5,
    image: "MT",
  },
  {
    name: "Lisa Anderson",
    role: "Founder, EduTech Innovations",
    company: "EdTech Startup",
    content: "From MVP to scaling, Binary Buddies has been our trusted partner. Their technical expertise combined with business acumen is rare to find.",
    rating: 5,
    image: "LA",
  },
  {
    name: "James Kim",
    role: "COO, LogisticsHub",
    company: "Supply Chain Company",
    content: "The API integration they developed connected all our systems seamlessly. Their attention to detail and commitment to excellence is impressive.",
    rating: 5,
    image: "JK",
  },
];

export const Testimonials = () => {
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
            Client <span className="text-gradient">Success Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from clients who've transformed their businesses with us
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass hover-glow h-full group cursor-pointer transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <Quote className="w-12 h-12 text-primary/30 mb-4" />
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  <p className="text-foreground leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-gradient">
                        {testimonial.image}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground group-hover:text-gradient transition-all duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-primary font-semibold">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    </section>
  );
};
