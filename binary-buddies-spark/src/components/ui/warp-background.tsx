import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface WarpBackgroundProps {
  perspective?: number;
  beamsPerSide?: number;
  beamSize?: number;
  beamDuration?: number;
  className?: string;
  children?: React.ReactNode;
}

export const WarpBackground = ({
  perspective = 120,
  beamsPerSide = 6,
  beamSize = 4,
  beamDuration = 3,
  className = "",
  children,
}: WarpBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Removed mouse interaction to prevent lag

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ perspective: `${perspective}px` }}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Animated Beams */}
      {Array.from({ length: beamsPerSide * 2 }).map((_, i) => {
        const isVertical = i < beamsPerSide;
        const position = isVertical ? (i / beamsPerSide) * 100 : ((i - beamsPerSide) / beamsPerSide) * 100;
        const delay = (i * beamDuration) / (beamsPerSide * 2);

        return (
          <motion.div
            key={i}
            className={`absolute bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 ${
              isVertical ? "w-px h-full" : "h-px w-full"
            }`}
            style={{
              [isVertical ? "left" : "top"]: `${position}%`,
              [isVertical ? "top" : "left"]: 0,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: beamDuration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};