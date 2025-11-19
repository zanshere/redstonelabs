"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/partials/Navbar";
import { useTheme } from "next-themes";
import { apiService } from "@/lib/api";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    acceptTerms: false,
  });
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  
  const containerRef = useRef(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Reset semua element sebelum animasi
    gsap.set([
      ".register-card", 
      ".register-header", 
      ".form-field",
      submitButtonRef.current
    ], {
      opacity: 1,
      y: 0
    });

    // GSAP Animations - FIXED VERSION
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.fromTo(".register-card", 
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6 }
    )
    .fromTo(".register-header", 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.3"
    )
    .fromTo(".form-field", 
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
      "-=0.2"
    )
    // Animasi submit button terpisah
    .fromTo(submitButtonRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4 },
      "-=0.1"
    );

    return () => {
      tl.kill();
    };
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    
    if (!formData.acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      // Generate username dari email (ambil bagian sebelum @)
      const username = formData.email.split('@')[0];
      
      const response = await apiService.register({
        name: formData.name,
        username: username,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      });
      
      console.log("Registration successful:", response);
      
      // Simpan token dan redirect ke halaman setup username
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Success animation
      gsap.to(".register-card", {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // Redirect ke halaman setup profile untuk melengkapi data
          window.location.href = "/auth/setup-profile";
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <>
      <Navbar />
      
      <div ref={containerRef} className={`auth-container ${isDark ? 'dark' : ''}`}>
        {/* Background Pattern */}
        <div className={`auth-pattern absolute inset-0 ${isDark ? 'dark' : ''}`} />

        {/* Gradient Orbs */}
        <div className={`auth-orb-1 top-1/4 left-1/4 ${isDark ? 'dark' : ''}`} />
        <div className={`auth-orb-2 bottom-1/4 right-1/4 ${isDark ? 'dark' : ''}`} />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
          <Card className={`register-card auth-card w-full max-w-md ${isDark ? 'dark' : ''}`}>
            <CardHeader className="register-header space-y-1 text-center pb-8">
              <CardTitle className={`auth-title text-4xl font-bold ${isDark ? 'dark' : ''}`}>
                Create Account
              </CardTitle>
              <CardDescription className={`auth-description text-base ${isDark ? 'dark' : ''}`}>
                Join Ryuzen Dev community today
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <div className={`p-3 rounded-lg text-sm ${
                  isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                }`}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div className="form-field space-y-2">
                  <label htmlFor="name" className={`auth-label ${isDark ? 'dark' : ''}`}>
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      isDark ? 'text-white/60 group-focus-within:text-white' : 'text-gray-500 group-focus-within:text-gray-700'
                    } transition-colors`} />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className={`pl-10 h-11 auth-input ${isDark ? 'dark' : ''}`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="form-field space-y-2">
                  <label htmlFor="email" className={`auth-label ${isDark ? 'dark' : ''}`}>
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      isDark ? 'text-white/60 group-focus-within:text-white' : 'text-gray-500 group-focus-within:text-gray-700'
                    } transition-colors`} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className={`pl-10 h-11 auth-input ${isDark ? 'dark' : ''}`}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="form-field space-y-2">
                  <label htmlFor="phoneNumber" className={`auth-label ${isDark ? 'dark' : ''}`}>
                    Phone Number
                  </label>
                  <div className="relative group">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      isDark ? 'text-white/60 group-focus-within:text-white' : 'text-gray-500 group-focus-within:text-gray-700'
                    } transition-colors`} />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+62 812-3456-7890"
                      className={`pl-10 h-11 auth-input ${isDark ? 'dark' : ''}`}
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="form-field space-y-2">
                  <label htmlFor="password" className={`auth-label ${isDark ? 'dark' : ''}`}>
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      isDark ? 'text-white/60 group-focus-within:text-white' : 'text-gray-500 group-focus-within:text-gray-700'
                    } transition-colors`} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className={`pl-10 pr-10 h-11 auth-input ${isDark ? 'dark' : ''}`}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        isDark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                      } transition-colors`}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="form-field space-y-2">
                  <label htmlFor="confirmPassword" className={`auth-label ${isDark ? 'dark' : ''}`}>
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      isDark ? 'text-white/60 group-focus-within:text-white' : 'text-gray-500 group-focus-within:text-gray-700'
                    } transition-colors`} />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={`pl-10 pr-10 h-11 auth-input ${isDark ? 'dark' : ''}`}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        isDark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                      } transition-colors`}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="form-field flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, acceptTerms: checked as boolean })
                    }
                    required
                    disabled={isLoading}
                    className={`mt-1 ${
                      isDark 
                        ? 'data-[state=checked]:bg-white data-[state=checked]:text-black border-white/20' 
                        : 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-gray-300'
                    }`}
                  />
                  <label
                    htmlFor="terms"
                    className={`text-sm leading-relaxed cursor-pointer auth-link ${isDark ? 'dark' : ''}`}
                  >
                    I agree to the{" "}
                    <Link href="#" className={`font-medium underline ${isDark ? 'text-white hover:text-white/80' : 'text-primary hover:text-primary/80'}`}>
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className={`font-medium underline ${isDark ? 'text-white hover:text-white/80' : 'text-primary hover:text-primary/80'}`}>
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button 
                  ref={submitButtonRef}
                  type="submit" 
                  className={`form-field w-full h-11 text-base font-semibold auth-button-primary ${isDark ? 'dark' : ''}`}
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                  {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-white/20">
              <div className={`text-sm text-center auth-link ${isDark ? 'dark' : ''}`}>
                Already have an account?{" "}
                <Link href="/auth/login" className={`font-semibold underline ${isDark ? 'text-white hover:text-white/80' : 'text-primary hover:text-primary/80'}`}>
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}