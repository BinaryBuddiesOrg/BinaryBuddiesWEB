import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Scale, FileCheck, AlertTriangle, Gavel } from "lucide-react";

const TermsOfService = () => {
    return (
        <div className="relative min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-hero opacity-50" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Scale className="w-6 h-6 text-primary animate-pulse" />
                            <span className="text-muted-foreground font-semibold tracking-wider uppercase text-sm">
                                Legal Agreements
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="text-gradient glow-text">Terms of Service</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Please read these terms carefully before using our services.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="glass p-8 md:p-12 rounded-2xl space-y-8"
                    >
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <FileCheck className="w-6 h-6 text-primary" />
                                1. Acceptance of Terms
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                By accessing and using this website and our services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Gavel className="w-6 h-6 text-primary" />
                                2. Use License
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Permission is granted to temporarily download one copy of the materials (information or software) on Binary Buddies' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>Modify or copy the materials;</li>
                                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                                <li>Attempt to decompile or reverse engineer any software contained on Binary Buddies' website;</li>
                                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-primary" />
                                3. Disclaimer
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                The materials on Binary Buddies' website are provided on an 'as is' basis. Binary Buddies makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">4. Limitations</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                In no event shall Binary Buddies or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Binary Buddies' website, even if Binary Buddies or a Binary Buddies authorized representative has been notified orally or in writing of the possibility of such damage.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">5. Governing Law</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Any claim relating to Binary Buddies' website shall be governed by the laws of the State of California without regard to its conflict of law provisions.
                            </p>
                        </div>

                        <div className="pt-8 border-t border-primary/20">
                            <p className="text-sm text-muted-foreground">
                                Last updated: December 18, 2025
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Contact us at: legal@binarybuddies.com
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TermsOfService;
