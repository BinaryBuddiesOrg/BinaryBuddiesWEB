"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface BenefitCardProps {
    icon: string;
    title: string;
    description: string;
    index: number;
}

export const BenefitCard = ({ icon, title, description, index }: BenefitCardProps) => {
    // Dynamically get the icon component
    const IconComponent = (Icons[icon as keyof typeof Icons] as LucideIcon) || Icons.Star;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Card className="glass hover-glow p-6 h-full group cursor-pointer transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 group-hover:shadow-glow transition-all duration-300">
                        <IconComponent className="w-8 h-8 text-primary" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-gradient transition-all duration-300">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground">
                        {description}
                    </p>
                </div>
            </Card>
        </motion.div>
    );
};
