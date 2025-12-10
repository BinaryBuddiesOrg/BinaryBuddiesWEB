import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { ProblemSolver } from "@/components/ProblemSolver";
import { Portfolio } from "@/components/Portfolio";
import { Process } from "@/components/Process";
import { Team } from "@/components/Team";
import { Testimonials } from "@/components/Testimonials";
import { TrustIndicators } from "@/components/TrustIndicators";
import { FAQ } from "@/components/FAQ";
import { ContactForm } from "@/components/ContactForm";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative">
      <Hero />
      <Services />
      <ProblemSolver />
      <Portfolio />
      <Process />
      <Team />
      <Testimonials />
      <TrustIndicators />
      <FAQ />
      <ContactForm />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;