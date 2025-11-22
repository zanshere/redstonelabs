"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register') || pathname?.includes('/forgot-password');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fungsi untuk handle klik navigation link dengan Lenis
  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    
    if (href.includes('#')) {
      const id = href.split('#')[1];
      
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          // Gunakan Lenis untuk smooth scroll
          const windowWithLenis = window as Window & { lenis?: { scrollTo: (el: Element, options: { offset: number; duration: number }) => void } };
          if (windowWithLenis.lenis) {
            windowWithLenis.lenis.scrollTo(element, {
              offset: -80,
              duration: 1.2
            });
          } else {
            // Fallback ke native smooth scroll
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }, 50);
    }
  };

  // Fungsi untuk toggle theme dengan transisi yang lebih baik
  const handleThemeToggle = () => {
    if (!mounted) return;
    
    // Prevent multiple rapid clicks
    const newTheme = theme === "dark" ? "light" : "dark";
    
    // Apply transition class to specific elements instead of entire document
    const mainElements = document.querySelectorAll('main, section, div[class*="bg-"], div[class*="border-"]');
    mainElements.forEach(el => {
      el.classList.add('theme-transition');
    });

    setTheme(newTheme);
    
    // Remove transition class after animation
    setTimeout(() => {
      mainElements.forEach(el => {
        el.classList.remove('theme-transition');
      });
    }, 300);
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Image 
                src="/images/RD-Dark-nobg.png" 
                alt="Ryuzen Dev Logo" 
                width={72} 
                height={72} 
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
      scrolled 
        ? 'bg-background/80 backdrop-blur-md border-b border-border' 
        : 'bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/images/RD-Dark-nobg.png" 
              alt="Ryuzen Dev Logo" 
              width={72} 
              height={72} 
              className="rounded-md"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['home', 'about', 'team', 'portfolio', 'pricing', 'contact'].map((item) => (
              <a
                key={item}
                href={`/#${item}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(`/#${item}`);
                }}
                className="text-foreground hover:text-primary transition-colors duration-200 capitalize relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Auth Buttons & Theme Toggle */}
          <div className="flex items-center space-x-4">
            {!isAuthPage && (
              <>
                <Link href="http://localhost:8000/login" className="hidden md:block">
                  <Button variant="ghost" className="transition-all duration-200">Login</Button>
                </Link>
                <Link href="http://localhost:8000/register" className="hidden md:block">
                  <Button className="transition-all duration-200">Sign Up</Button>
                </Link>
              </>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className="transition-all duration-200 hover:scale-110"
              disabled={!mounted}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border/50">
            {['home', 'about', 'team', 'portfolio', 'pricing', 'contact'].map((item) => (
              <a
                key={item}
                href={`/#${item}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(`/#${item}`);
                }}
                className="block text-foreground hover:text-primary transition-all duration-200 capitalize py-2 px-4 rounded-lg hover:bg-accent"
              >
                {item}
              </a>
            ))}
            {!isAuthPage && (
              <div className="pt-4 border-t border-border space-y-2">
                <Link href="/auth/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full transition-all duration-200">Login</Button>
                </Link>
                <Link href="/auth/register" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full transition-all duration-200">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}