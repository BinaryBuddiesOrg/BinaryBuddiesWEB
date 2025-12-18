import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            // Show banner after a small delay
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookieConsent", "declined");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-8 z-50 md:max-w-md"
                >
                    <div className="glass border-primary/20 p-6 rounded-xl shadow-glow-strong bg-card/80 backdrop-blur-xl">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-full shrink-0">
                                <Cookie className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold mb-2">We value your privacy</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our{" "}
                                    <Link to="/privacy-policy" className="text-primary hover:underline">
                                        Privacy Policy
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="/terms-of-service" className="text-primary hover:underline">
                                        Terms of Service
                                    </Link>
                                    .
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        onClick={handleAccept}
                                        className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-glow hover:shadow-glow-strong transition-all duration-300 flex-1"
                                    >
                                        Accept All
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleDecline}
                                        className="border-primary/30 hover:bg-primary/10 hover:text-primary transition-all duration-300 flex-1"
                                    >
                                        Decline
                                    </Button>
                                </div>
                            </div>
                            <button
                                onClick={handleDecline}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
