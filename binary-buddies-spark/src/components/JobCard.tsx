import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { Job } from "@/data/careersData";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface JobCardProps {
    job: Job;
    index: number;
}

export const JobCard = ({ job, index }: JobCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const typeColors = {
        "Full-time": "bg-primary/20 text-primary border-primary/30",
        "Part-time": "bg-accent/20 text-accent border-accent/30",
        "Contract": "bg-accent-pink/20 text-accent-pink border-accent-pink/30",
        "Remote": "bg-accent-neon/20 text-accent-neon border-accent-neon/30",
        "Hybrid": "bg-primary/20 text-primary border-primary/30",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Card className="glass hover-glow overflow-hidden group transition-all duration-300">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-gradient transition-all duration-300">
                                {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Briefcase className="w-4 h-4" />
                                    <span>{job.department}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{job.location}</span>
                                </div>
                            </div>
                        </div>
                        <Badge
                            variant="outline"
                            className={cn("w-fit", typeColors[job.type])}
                        >
                            {job.type}
                        </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mb-4">
                        {job.description}
                    </p>

                    {/* Expandable Details */}
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 mb-4 pt-4 border-t border-primary/20"
                        >
                            {/* Requirements */}
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Requirements:</h4>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {job.requirements.map((req, idx) => (
                                        <li key={idx}>{req}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Responsibilities */}
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Responsibilities:</h4>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {job.responsibilities.map((resp, idx) => (
                                        <li key={idx}>{resp}</li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-primary/20">
                        <Button
                            className="flex-1 bg-primary hover:bg-primary-glow text-primary-foreground shadow-glow hover:shadow-glow-strong"
                        >
                            Apply Now
                        </Button>
                        <Button
                            variant="outline"
                            className="glass border-primary/30"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="w-4 h-4 mr-2" />
                                    Show Less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4 mr-2" />
                                    View Details
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};
