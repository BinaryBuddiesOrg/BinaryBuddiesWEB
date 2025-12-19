"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Job } from "@/data/careersData";
import { submitApplication } from "@/services/api";

interface ApplicationModalProps {
    job: Job;
    isOpen: boolean;
    onClose: () => void;
}

export const ApplicationModal = ({ job, isOpen, onClose }: ApplicationModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        coverLetter: "",
    });
    const [resume, setResume] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ];
            if (!allowedTypes.includes(file.type)) {
                setErrorMessage("Please upload a PDF or Word document");
                return;
            }
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage("File size must be less than 5MB");
                return;
            }
            setResume(file);
            setErrorMessage("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            await submitApplication({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                careerId: job.id,
                coverLetter: formData.coverLetter,
                resume: resume || undefined,
            });

            setSubmitStatus("success");
            // Reset form after success
            setTimeout(() => {
                onClose();
                setSubmitStatus("idle");
                setFormData({ name: "", email: "", phone: "", coverLetter: "" });
                setResume(null);
            }, 2000);
        } catch (error) {
            console.error("Application submission failed:", error);
            setSubmitStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Failed to submit application");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
            setSubmitStatus("idle");
            setErrorMessage("");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="glass border border-primary/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-primary/20">
                                <div>
                                    <h2 className="text-2xl font-bold text-gradient">Apply Now</h2>
                                    <p className="text-muted-foreground mt-1">{job.title}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="hover:bg-primary/10"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Success State */}
                            {submitStatus === "success" && (
                                <div className="p-12 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                                    >
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                                    <p className="text-muted-foreground">
                                        Thank you for your interest. We'll be in touch soon.
                                    </p>
                                </div>
                            )}

                            {/* Form */}
                            {submitStatus !== "success" && (
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            required
                                            className="glass border-primary/20 focus:border-primary"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            required
                                            className="glass border-primary/20 focus:border-primary"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 98765 43210"
                                            className="glass border-primary/20 focus:border-primary"
                                        />
                                    </div>

                                    {/* Resume Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="resume">Resume (PDF or Word, max 5MB)</Label>
                                        <div className="glass border border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                                            <input
                                                id="resume"
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="resume"
                                                className="cursor-pointer flex flex-col items-center gap-2"
                                            >
                                                <Upload className="w-8 h-8 text-muted-foreground" />
                                                {resume ? (
                                                    <span className="text-primary font-medium">{resume.name}</span>
                                                ) : (
                                                    <span className="text-muted-foreground">Click to upload resume</span>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Cover Letter */}
                                    <div className="space-y-2">
                                        <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                                        <Textarea
                                            id="coverLetter"
                                            name="coverLetter"
                                            value={formData.coverLetter}
                                            onChange={handleInputChange}
                                            placeholder="Tell us why you're a great fit for this role..."
                                            rows={4}
                                            className="glass border-primary/20 focus:border-primary resize-none"
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {errorMessage && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {errorMessage}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary hover:bg-primary-glow text-primary-foreground shadow-glow hover:shadow-glow-strong"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Application"
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
