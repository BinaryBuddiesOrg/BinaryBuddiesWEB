"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, ChevronDown, Sun, Moon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Blog", path: "/blog" },
  { name: "Careers", path: "/careers" },
  { name: "Contact", path: "/contact" },
];

const serviceItems = [
  { name: "Software Development", path: "/services/software-development" },
  { name: "AI/ML Development", path: "/services/ai-ml-development" },
  { name: "Web Development", path: "/services/web-development" },
  { name: "App Development", path: "/services/app-development" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-card/60 backdrop-blur-2xl border-b border-primary/30 shadow-glow"
          : "bg-background/30 backdrop-blur-2xl"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >

            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <img src="/logo.jpg" alt="Binary Buddies Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            </motion.div>
            <span className="text-xl md:text-2xl font-bold text-foreground">
              Binary Buddies
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                    isActive(item.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  )}
                </Link>
              ))}

              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg flex items-center gap-1",
                      pathname.startsWith("/services")
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {pathname.startsWith("/services") && (
                      <motion.div
                        layoutId="activeTabServices"
                        className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">Services</span>
                    <ChevronDown className="w-4 h-4 relative z-10" />
                    {pathname.startsWith("/services") && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="glass border-primary/30 bg-card/80 backdrop-blur-2xl min-w-[220px] mt-2"
                >
                  {serviceItems.map((service) => (
                    <DropdownMenuItem key={service.path} asChild>
                      <Link
                        href={service.path}
                        className={cn(
                          "cursor-pointer px-4 py-2.5 text-sm transition-all duration-300 rounded-md",
                          isActive(service.path)
                            ? "text-primary bg-primary/10 border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                        )}
                      >
                        {service.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Theme Toggle - Desktop */}
          {!isMobile && (
            <div className="hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:bg-primary/10 transition-all duration-300"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-primary" />
                ) : (
                  <Moon className="w-5 h-5 text-primary" />
                )}
              </Button>
            </div>
          )}

          {/* CTA Button - Desktop */}
          {!isMobile && (
            <div className="hidden md:block">
              <Button
                asChild
                size="sm"
                className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold shadow-glow hover:shadow-glow-strong transition-all duration-300"
              >
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-primary/10"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-card dark:bg-card/70 backdrop-blur-2xl border-l border-primary/30 w-[280px] sm:w-[320px]"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center gap-2 mb-8 pt-4">
                    <img src="/logo.jpg" alt="Binary Buddies Logo" className="w-8 h-8 object-contain" />
                    <span className="text-xl font-bold text-foreground">
                      Binary Buddies
                    </span>
                  </div>

                  {/* Mobile Navigation Items */}
                  <nav className="flex flex-col gap-2 flex-1">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                            isActive(item.path)
                              ? "text-primary bg-primary/10 border border-primary/30 shadow-glow"
                              : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                          )}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}

                    {/* Services Section in Mobile */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.1 }}
                      className="pt-2"
                    >
                      <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Services
                      </div>
                      {serviceItems.map((service, index) => (
                        <motion.div
                          key={service.path}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (navItems.length + index) * 0.1 }}
                        >
                          <Link
                            href={service.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "block px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                              isActive(service.path)
                                ? "text-primary bg-primary/10 border border-primary/30 shadow-glow"
                                : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                            )}
                          >
                            {service.name}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  </nav>

                  {/* Theme Toggle - Mobile */}
                  <div className="pt-4 pb-2">
                    <Button
                      variant="outline"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="w-full glass border-primary/30 hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className="w-5 h-5 text-primary" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-5 h-5 text-primary" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Mobile CTA */}
                  <div className="pt-2 pb-4">
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold shadow-glow hover:shadow-glow-strong"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/contact">Get Started</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </motion.nav>
  );
};

