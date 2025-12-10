import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SoftwareDevelopment from "./pages/services/SoftwareDevelopment";
import AIMLDevelopment from "./pages/services/AIMLDevelopment";
import WebDevelopment from "./pages/services/WebDevelopment";
import AppDevelopment from "./pages/services/AppDevelopment";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="binary-buddies-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Service Routes */}
            <Route path="/services/software-development" element={<SoftwareDevelopment />} />
            <Route path="/services/ai-ml-development" element={<AIMLDevelopment />} />
            <Route path="/services/web-development" element={<WebDevelopment />} />
            <Route path="/services/app-development" element={<AppDevelopment />} />
            {/* Main Pages */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
