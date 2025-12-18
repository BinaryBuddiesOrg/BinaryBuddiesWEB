import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Target, Users, Rocket, Award, Loader2, AlertCircle } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { BenefitCard } from "@/components/BenefitCard";
import { Footer } from "@/components/Footer";
import { benefits, testimonials } from "@/data/careersData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCareers } from "@/hooks/useCareers";

const Careers = () => {
    const [selectedDepartment, setSelectedDepartment] = useState("All");

    // Fetch careers based on selected department
    const departmentFilter = selectedDepartment !== "All" ? selectedDepartment : undefined;
    const { data: jobs, isLoading, error } = useCareers({ department: departmentFilter });

    const departments = ["All", ...Array.from(new Set(jobs?.map(job => job.department) || []))];

    const filteredJobs = jobs || [];

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
                </div>
            </section>

            {/* Loading State */}
            {isLoading && (
                <section className="container mx-auto px-4 py-16">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </section>
            )}

            {/* Error State */}
            {error && (
                <section className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                        <p className="text-lg text-muted-foreground">Failed to load career listings. Please try again later.</p>
                    </div>
                </section>
            )}

            {/* Content - Only show when not loading and no error */}
            {!isLoading && !error && (
                <>
                    {/* Job Listings */}
                    <section className="py-16 md:py-24 pt-0"> {/* pt-0 to avoid double padding with previous section */}
                        <div className="container mx-auto px-4">
                            {/* Department Filter */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="flex flex-wrap gap-3 justify-center mb-12"
                            >
                                {departments.map((dept) => (
                                    <Button
                                        key={dept}
                                        variant={selectedDepartment === dept ? "default" : "outline"}
                                        onClick={() => setSelectedDepartment(dept)}
                                        className={
                                            selectedDepartment === dept
                                                ? "bg-primary hover:bg-primary-glow text-primary-foreground shadow-glow"
                                                : "glass border-primary/30 hover:border-primary/50"
                                        }
                                    >
                                        {dept}
                                    </Button>
                                ))}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center mb-8"
                            >
                                <p className="text-muted-foreground">
                                    {filteredJobs.length} {filteredJobs.length === 1 ? "position" : "positions"} available
                                </p>
                            </motion.div>

                            {filteredJobs.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                                    {filteredJobs.map((job, index) => (
                                        <JobCard key={job.id} job={job} index={index} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <p className="text-muted-foreground text-lg">
                                        No positions available in this department at the moment.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

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
