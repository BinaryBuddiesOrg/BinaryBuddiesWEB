import { Search, Lightbulb, Code2, Rocket, Settings, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discovery & Analysis",
    description: "We dive deep into your business needs, challenges, and goals to understand the full picture.",
    duration: "1-2 weeks",
  },
  {
    icon: Lightbulb,
    title: "Strategy & Planning",
    description: "Our experts design a comprehensive solution tailored to your specific requirements.",
    duration: "1 week",
  },
  {
    icon: Code2,
    title: "Development & Implementation",
    description: "Agile development with regular updates, ensuring transparency and quality at every stage.",
    duration: "4-12 weeks",
  },
  {
    icon: Rocket,
    title: "Testing & Deployment",
    description: "Rigorous testing and smooth deployment with zero downtime and full support.",
    duration: "1-2 weeks",
  },
  {
    icon: Settings,
    title: "Optimization & Training",
    description: "Fine-tuning performance and comprehensive team training for seamless adoption.",
    duration: "1 week",
  },
  {
    icon: CheckCircle,
    title: "Support & Maintenance",
    description: "24/7 ongoing support, updates, and continuous improvement to ensure long-term success.",
    duration: "Ongoing",
  },
];

export const Process = () => {
  return (
    <section className="relative py-24 pt-32 md:pt-24 overflow-hidden bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Our <span className="text-gradient">Process</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A proven methodology that delivers exceptional results every time
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto relative">
          {/* Vertical Line - positioned on the left, hidden on mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary hidden md:block" />

          {/* Cards Container - Always vertical stack */}
          <div className="w-full flex flex-col gap-6 md:gap-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className="w-full relative"
              >
                {/* Step Number Circle - Desktop only */}
                <div className="absolute left-0 top-0 w-16 h-16 -translate-x-1/2 glass rounded-full items-center justify-center z-10 hover-glow hidden md:flex">
                  <span className="text-2xl font-bold text-gradient">{index + 1}</span>
                </div>

                {/* Mobile Step Number - visible only on mobile */}
                <div className="flex md:hidden items-center gap-3 mb-4 w-full">
                  <div className="w-10 h-10 glass rounded-full flex items-center justify-center hover-glow flex-shrink-0">
                    <span className="text-lg font-bold text-gradient">{index + 1}</span>
                  </div>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
                </div>

                {/* Content Card - Full width on mobile */}
                <div className="glass p-6 md:p-8 rounded-xl md:ml-12 w-full group hover-glow cursor-pointer transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col md:flex-row items-start gap-4 w-full">
                    <div className="p-3 md:p-4 rounded-xl bg-primary/10 group-hover:shadow-glow transition-all duration-300 flex-shrink-0">
                      <step.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                    </div>
                    
                    <div className="flex-1 w-full">
                      <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground group-hover:text-gradient transition-all duration-300">
                        {step.title}
                      </h3>
                      <p className="text-sm md:text-base text-primary font-semibold mb-3">
                        Duration: {step.duration}
                      </p>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    </section>
  );
};
