"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/partials/Navbar";
import { useTheme } from "next-themes";
import { apiService } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const tl = gsap.timeline();
    
    gsap.set([".forgot-card", ".forgot-title", ".forgot-form > *", buttonRef.current], {
      opacity: 1,
      y: 0
    });
    
    tl.fromTo(".forgot-card", 
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(".forgot-title", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    )
    .fromTo(".forgot-form .form-field", 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" },
      "-=0.3"
    )
    .fromTo(buttonRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      "-=0.2"
    );

  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await apiService.forgotPassword(email);
      setIsSubmitted(true);
      
      gsap.fromTo(".success-content",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
          <Card ref={formRef} className={`forgot-card auth-card w-full max-w-md ${isDark ? 'dark' : ''}`}>
            {!isSubmitted ? (
              <>
                <CardHeader className="space-y-1 text-center">
                  <CardTitle className={`forgot-title auth-title text-3xl ${isDark ? 'dark' : ''}`}>
                    Forgot Password?
                  </CardTitle>
                  <CardDescription className={`forgot-title auth-description ${isDark ? 'dark' : ''}`}>
                    No worries, we'll send you reset instructions
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="forgot-form space-y-6">
                    {/* Error Message */}
                    {error && (
                      <div className={`p-3 rounded-lg text-sm ${
                        isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                      }`}>
                        {error}
                      </div>
                    )}

                    {/* Email Input */}
                    <div className="form-field space-y-2">
                      <label htmlFor="email" className={`auth-label ${isDark ? 'dark' : ''}`}>
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className={`pl-10 auth-input ${isDark ? 'dark' : ''}`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <p className={`text-xs mt-2 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                        We'll send a password reset link to this email
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      ref={buttonRef}
                      type="submit" 
                      className={`w-full auth-button-primary ${isDark ? 'dark' : ''}`}
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Reset Link
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Link 
                    href="/auth/login" 
                    className={`flex items-center text-sm auth-link ${isDark ? 'dark' : ''}`}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                  </Link>
                </CardFooter>
              </>
            ) : (
              <div className="success-content p-8">
                <CardHeader className="space-y-1 text-center pb-6">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    isDark ? 'bg-white/10' : 'bg-primary/10'
                  }`}>
                    <Mail className={`w-8 h-8 ${isDark ? 'text-white' : 'text-primary'}`} />
                  </div>
                  <CardTitle className={`auth-title text-2xl ${isDark ? 'dark' : ''}`}>
                    Check Your Email
                  </CardTitle>
                  <CardDescription className={`auth-description ${isDark ? 'dark' : ''}`}>
                    We've sent a password reset link to
                  </CardDescription>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{email}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className={`rounded-lg p-4 space-y-2 ${
                    isDark ? 'bg-white/10' : 'bg-primary/10'
                  }`}>
                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                      Didn't receive the email? Check your spam folder or
                    </p>
                    <Button 
                      variant="link" 
                      className={`p-0 h-auto font-medium ${isDark ? 'text-white hover:text-white/80' : 'text-primary hover:text-primary/80'}`}
                      onClick={() => {
                        setIsSubmitted(false);
                        setError("");
                      }}
                    >
                      try another email address
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 pt-6">
                  <Link 
                    href="/auth/login" 
                    className={`flex items-center text-sm auth-link ${isDark ? 'dark' : ''}`}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                  </Link>
                </CardFooter>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}