import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Target, Users, Rocket, Award } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { BenefitCard } from "@/components/BenefitCard";
import { Footer } from "@/components/Footer";
import { jobs, benefits, testimonials } from "@/data/careersData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Careers = () => {
    const [selectedDepartment, setSelectedDepartment] = useState("All");

    const departments = ["All", ...Array.from(new Set(jobs.map(job => job.department)))];

    const filteredJobs = selectedDepartment === "All"
        ? jobs
        : jobs.filter(job => job.department === selectedDepartment);

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16 md:pt-20">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-hero opacity-50" />

                {/* Floating Orbs */}
                <motion.div
                    className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center justify-center gap-2 mb-6"
                    >
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                            Join Our Team
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    >
                        <span className="text-gradient glow-text">Build the Future</span>
                        <br />
                        <span className="text-foreground">With Us</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
                    >
                        Join a team of innovators building cutting-edge AI and automation solutions
                    </motion.p>
                </div>
            </section>

            {/* Why Join Us Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-gradient">Why Binary Buddies?</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            We're not just building software—we're shaping the future of technology
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Target,
                                title: "Mission-Driven",
                                description: "Work on projects that make a real impact on businesses worldwide"
                            },
                            {
                                icon: Users,
                                title: "Collaborative Culture",
                                description: "Join a diverse team of talented individuals who support each other"
                            },
                            {
                                icon: Rocket,
                                title: "Growth Opportunities",
                                description: "Continuous learning and career advancement in a fast-growing company"
                            },
                            {
                                icon: Award,
                                title: "Innovation First",
                                description: "Work with cutting-edge technologies and solve challenging problems"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="glass hover-glow p-6 h-full text-center group">
                                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 group-hover:shadow-glow transition-all duration-300">
                                        <item.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 md:py-24 bg-card/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-gradient">Benefits & Perks</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            We take care of our team with comprehensive benefits and unique perks
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <BenefitCard
                                key={benefit.id}
                                icon={benefit.icon}
                                title={benefit.title}
                                description={benefit.description}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-gradient">Open Positions</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Find your perfect role and apply today
                        </p>
                    </motion.div>

                    {/* Department Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {departments.map((dept) => (
                            <Button
                                key={dept}
                                onClick={() => setSelectedDepartment(dept)}
                                variant={selectedDepartment === dept ? "default" : "outline"}
                                className={
                                    selectedDepartment === dept
                                        ? "bg-primary hover:bg-primary-glow text-primary-foreground shadow-glow"
                                        : "glass border-primary/30 hover:border-primary/50"
                                }
                            >
                                {dept}
                            </Button>
                        ))}
                    </div>

                    {/* Job Listings */}
                    <div className="space-y-6">
                        {filteredJobs.map((job, index) => (
                            <JobCard key={job.id} job={job} index={index} />
                        ))}
                    </div>

                    {filteredJobs.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground text-lg">
                                No positions found in this department. Check back soon!
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Employee Testimonials */}
            <section className="py-16 md:py-24 bg-card/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="text-gradient">What Our Team Says</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Hear from the people who make Binary Buddies great
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="glass hover-glow p-6 h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Careers;
