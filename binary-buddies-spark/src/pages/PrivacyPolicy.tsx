import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, FileText } from "lucide-react";

const PrivacyPolicy = () => {
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
                            <Shield className="w-6 h-6 text-primary animate-pulse" />
                            <span className="text-muted-foreground font-semibold tracking-wider uppercase text-sm">
                                Trust & Security
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="text-gradient glow-text">Privacy Policy</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We are committed to protecting your privacy and ensuring the security of your personal information.
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
                                <Eye className="w-6 h-6 text-primary" />
                                1. Information We Collect
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, request customer support, or otherwise communicate with us. This may include your name, email address, phone number, company name, and any other information you choose to provide.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                We also automatically collect certain information about your device and how you interact with our services, including your IP address, browser type, operating system, and usage data.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <FileText className="w-6 h-6 text-primary" />
                                2. How We Use Your Information
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Send you technical notices, updates, security alerts, and support messages</li>
                                <li>Respond to your comments, questions, and requests</li>
                                <li>Communicate with you about products, services, offers, and events</li>
                                <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Lock className="w-6 h-6 text-primary" />
                                3. Data Security
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no internet or email transmission is ever fully secure or error-free.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Shield className="w-6 h-6 text-primary" />
                                4. Cookies and Tracking Technologies
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">5. Changes to This Policy</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may update this privacy policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our homepage or sending you a notification).
                            </p>
                        </div>

                        <div className="pt-8 border-t border-primary/20">
                            <p className="text-sm text-muted-foreground">
                                Last updated: December 18, 2025
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Contact us at: privacy@binarybuddies.com
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
