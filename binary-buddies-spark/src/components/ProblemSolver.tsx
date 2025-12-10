import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Clock, CheckCircle, Lightbulb, 
  Settings, Rocket, Target, TrendingUp,
  Code, Shield, Zap, Database, ArrowRight
} from "lucide-react";
import { WarpBackground } from "@/components/ui/warp-background";

const workflowStages = [
  {
    id: "discovery",
    title: "Problem Discovery",
    description: "We analyze your challenge and understand the requirements",
    icon: Target,
    color: "primary",
    duration: 2000,
    details: ["Requirement Analysis", "Stakeholder Interviews", "Technical Assessment"]
  },
  {
    id: "analysis",
    title: "Deep Analysis",
    description: "Our AI systems process and categorize the problem",
    icon: Brain,
    color: "accent",
    duration: 2500,
    details: ["AI Processing", "Pattern Recognition", "Solution Mapping"]
  },
  {
    id: "ideation",
    title: "Solution Ideation",
    description: "Brainstorming innovative solutions with our expert team",
    icon: Lightbulb,
    color: "primary",
    duration: 3000,
    details: ["Creative Brainstorming", "Technology Selection", "Architecture Design"]
  },
  {
    id: "planning",
    title: "Strategic Planning",
    description: "Creating detailed roadmap and implementation strategy",
    icon: Settings,
    color: "accent",
    duration: 2000,
    details: ["Project Roadmap", "Resource Allocation", "Timeline Planning"]
  },
  {
    id: "development",
    title: "Development",
    description: "Building the solution with cutting-edge technologies",
    icon: Code,
    color: "primary",
    duration: 4000,
    details: ["Agile Development", "Code Quality", "Continuous Integration"]
  },
  {
    id: "testing",
    title: "Quality Assurance",
    description: "Comprehensive testing and validation",
    icon: Shield,
    color: "accent",
    duration: 2000,
    details: ["Automated Testing", "Security Audits", "Performance Testing"]
  },
  {
    id: "deployment",
    title: "Deployment",
    description: "Seamless deployment with zero downtime",
    icon: Rocket,
    color: "primary",
    duration: 1500,
    details: ["CI/CD Pipeline", "Blue-Green Deployment", "Monitoring Setup"]
  },
  {
    id: "optimization",
    title: "Optimization",
    description: "Continuous monitoring and performance optimization",
    icon: TrendingUp,
    color: "accent",
    duration: 2000,
    details: ["Performance Monitoring", "User Analytics", "Continuous Improvement"]
  },
  {
    id: "success",
    title: "Success Delivered",
    description: "Problem solved with measurable results",
    icon: CheckCircle,
    color: "primary",
    duration: 2000,
    details: ["Client Satisfaction", "ROI Achievement", "Long-term Support"]
  }
];

export const ProblemSolver = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startTimer = setTimeout(() => setIsRunning(true), 1000);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const stageTimer = setTimeout(() => {
      if (currentStage < workflowStages.length - 1) {
        setCompletedStages(prev => [...prev, currentStage]);
        setCurrentStage(prev => prev + 1);
      } else {
        // Reset after showing all stages
        setTimeout(() => {
          setCurrentStage(0);
          setCompletedStages([]);
        }, 3000);
      }
    }, workflowStages[currentStage].duration);

    return () => clearTimeout(stageTimer);
  }, [currentStage, isRunning, isPaused]);

  const handleStageClick = (index: number) => {
    setCurrentStage(index);
    setCompletedStages(Array.from({ length: index }, (_, i) => i));
  };

  const toggleAnimation = () => {
    setIsPaused(!isPaused);
  };

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            How <span className="text-gradient">Binary Buddies</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            From problem identification to solution delivery, we follow a systematic approach that ensures success at every stage
          </p>
          
          {/* Interactive Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={toggleAnimation}
              className="glass px-6 py-3 rounded-xl hover-glow transition-all duration-300 flex items-center gap-2"
            >
              {isPaused ? (
                <>
                  <div className="w-4 h-4 bg-primary rounded-sm" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 border-2 border-primary rounded-sm" />
                  <span>Pause</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setCurrentStage(0);
                setCompletedStages([]);
                setIsRunning(true);
              }}
              className="glass px-6 py-3 rounded-xl hover-glow transition-all duration-300 flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Restart</span>
            </button>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="glass p-6 rounded-xl backdrop-blur-xl bg-card/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Workflow Progress</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {currentStage + 1} of {workflowStages.length} stages
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">
                    {isPaused ? "Paused" : "Running"}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStage + 1) / workflowStages.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
              <span>Started</span>
              <span>In Progress</span>
              <span>Completed</span>
            </div>
          </div>
        </motion.div>

        {/* Stage Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {workflowStages.map((stage, index) => {
              const isActive = currentStage === index;
              const isCompleted = completedStages.includes(index);
              
              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageClick(index)}
                  className={`px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-glow' 
                      : isCompleted 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <span className="hidden sm:inline">{index + 1}. </span>
                  <span className="sm:hidden">{index + 1}</span>
                  <span className="hidden md:inline">{stage.title}</span>
                  <span className="md:hidden">{stage.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Workflow Visualization with Grid Layout */}
        <div className="relative max-w-7xl mx-auto">
          {/* Workflow Stages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {workflowStages.map((stage, index) => {
              const isActive = currentStage === index;
              const isCompleted = completedStages.includes(index);
              
              return (
                <motion.div
                  key={stage.id}
                  className="cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: isActive || isCompleted ? 1 : 0.6,
                    scale: isActive ? 1.05 : 1
                  }}
                  transition={{ duration: 0.5 }}
                  onClick={() => handleStageClick(index)}
                >
                  {/* Stage Card */}
                  <div className={`glass p-4 md:p-6 rounded-xl relative overflow-hidden text-center backdrop-blur-xl bg-card/60 transition-all duration-300 h-full ${
                    isActive ? 'border-2 border-primary shadow-glow' : 
                    isCompleted ? 'border border-primary/50' : 'border border-muted'
                  }`}>
                    {/* Active stage glow */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    {/* Completed stage checkmark */}
                    {isCompleted && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    )}
                    
                    
                    {/* Stage Icon */}
                    <div className={`inline-flex p-3 md:p-4 rounded-xl mb-3 md:mb-4 ${
                      isActive ? `bg-${stage.color}/20 shadow-glow` : 
                      isCompleted ? `bg-${stage.color}/10` : 'bg-muted/20'
                    }`}>
                      {React.createElement(stage.icon, {
                        className: `w-6 h-6 md:w-8 md:h-8 ${
                          isActive ? `text-${stage.color}` : 
                          isCompleted ? `text-${stage.color}` : 'text-muted-foreground'
                        }`
                      })}
                    </div>
                    
                    {/* Stage Title */}
                    <h3 className={`text-base md:text-lg font-bold mb-2 md:mb-3 ${
                      isActive ? 'text-gradient' : 
                      isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {stage.title}
                    </h3>
                    
                    {/* Stage Description */}
                    <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 leading-relaxed">
                      {stage.description}
                    </p>
                    
                    {/* Stage Details - Only show for active stage */}
                    {isActive && (
                      <motion.div
                        className="text-xs text-muted-foreground space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {stage.details.map((detail, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                    
                    {/* Progress indicator */}
                    {isActive && (
                      <motion.div
                        className="w-full h-1 bg-muted rounded-full overflow-hidden mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: stage.duration / 1000, ease: "linear" }}
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
    </section>
  );
};
