"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Github,
  ArrowRight,
  Chrome,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/partials/Navbar";
import { useTheme } from "next-themes";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
    username: string;
    phoneNumber?: string;
    photo?: string;
    companyName?: string;
    address?: string;
    workosId?: string;
    oauthProvider?: string;
    emailVerified: boolean;
    mfaEnabled: boolean;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
  };
  requiresMFA?: boolean;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'github' | 'google' | null>(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const containerRef = useRef(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const socialButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Reset semua element sebelum animasi
    gsap.set(
      [
        ".login-card",
        ".login-header",
        ".social-login",
        ".form-field",
        submitButtonRef.current,
        ...socialButtonsRef.current.filter(Boolean),
      ],
      {
        opacity: 1,
        y: 0,
      }
    );

    // GSAP Animations - FIXED VERSION
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      ".login-card",
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6 }
    )
      .fromTo(
        ".login-header",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.3"
      )
      .fromTo(
        ".social-login",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
        "-=0.2"
      )
      .fromTo(
        ".form-field",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
        "-=0.2"
      )
      // Animasi submit button terpisah
      .fromTo(
        submitButtonRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.1"
      );

    return () => {
      tl.kill();
    };
  }, [mounted]);

  // Fungsi untuk handle social login - DIUBAH
  const handleSocialLogin = (provider: 'github' | 'google') => {
    setSocialLoading(provider);
    setError("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      // Langsung redirect ke endpoint OAuth backend
      if (provider === 'github') {
        window.location.href = `${backendUrl}/api/auth/github`;
      } else {
        window.location.href = `${backendUrl}/api/auth/google`;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : `${provider} login failed`);
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const loginResponse: LoginResponse = await response.json();
      console.log("Login response:", loginResponse);

      // Handle MFA case
      if (loginResponse.requiresMFA) {
        console.log("MFA required, redirecting to OTP page");
        // Redirect ke OTP page dengan email
        window.location.href = `/auth/otp?email=${encodeURIComponent(formData.email)}&provider=email`;
        return;
      }

      console.log("Login successful:", loginResponse);

      localStorage.setItem("token", loginResponse.token);
      localStorage.setItem("user", JSON.stringify(loginResponse.user));

      const redirectPath = loginResponse.user.role === 'ADMIN' 
        ? '/dashboard/admin' 
        : '/dashboard/user';

      // Success animation
      gsap.to(".login-card", {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // Redirect ke dashboard sesuai role
          window.location.href = redirectPath;
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <>
      <Navbar />

      <div
        ref={containerRef}
        className={`auth-container ${isDark ? "dark" : ""}`}
      >
        {/* Background Pattern */}
        <div
          className={`auth-pattern absolute inset-0 ${isDark ? "dark" : ""}`}
        />

        {/* Gradient Orbs */}
        <div
          className={`auth-orb-1 top-1/4 left-1/4 ${isDark ? "dark" : ""}`}
        />
        <div
          className={`auth-orb-2 bottom-1/4 right-1/4 ${isDark ? "dark" : ""}`}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
          <Card
            className={`login-card auth-card w-full max-w-md ${
              isDark ? "dark" : ""
            }`}
          >
            <CardHeader className="login-header space-y-1 text-center pb-8">
              <CardTitle
                className={`auth-title text-4xl font-bold ${
                  isDark ? "dark" : ""
                }`}
              >
                Welcome Back
              </CardTitle>
              <CardDescription
                className={`auth-description text-base ${isDark ? "dark" : ""}`}
              >
                Sign in to continue to Ryuzen Dev
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className={`p-3 rounded-lg text-sm ${
                  isDark ? "bg-red-500/20 text-red-300" : "bg-red-100 text-red-700"
                }`}>
                  {error}
                </div>
              )}

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  ref={(el) => (socialButtonsRef.current[0] = el)}
                  type="button"
                  variant="outline"
                  className={`social-login w-full h-11 auth-button-outline ${
                    isDark ? "dark" : ""
                  }`}
                  disabled={isLoading || socialLoading !== null}
                  onClick={() => handleSocialLogin('github')}
                >
                  {socialLoading === 'github' ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Github className="w-5 h-5 mr-2" />
                  )}
                  GitHub
                </Button>
                <Button
                  ref={(el) => (socialButtonsRef.current[1] = el)}
                  type="button"
                  variant="outline"
                  className={`social-login w-full h-11 auth-button-outline ${
                    isDark ? "dark" : ""
                  }`}
                  disabled={isLoading || socialLoading !== null}
                  onClick={() => handleSocialLogin('google')}
                >
                  {socialLoading === 'google' ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Chrome className="w-5 h-5 mr-2" />
                  )}
                  Google
                </Button>
              </div>

              <div className="relative">
                <div
                  className={`auth-divider absolute inset-0 flex items-center ${
                    isDark ? "dark" : ""
                  }`}
                />
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`auth-divider-text ${isDark ? "dark" : ""}`}>
                    Or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="form-field space-y-2">
                  <label
                    htmlFor="email"
                    className={`auth-label ${isDark ? "dark" : ""}`}
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDark
                          ? "text-white/60 group-focus-within:text-white"
                          : "text-gray-500 group-focus-within:text-gray-700"
                      } transition-colors`}
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className={`pl-10 h-11 auth-input ${
                        isDark ? "dark" : ""
                      }`}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      disabled={isLoading || socialLoading !== null}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="form-field space-y-2">
                  <label
                    htmlFor="password"
                    className={`auth-label ${isDark ? "dark" : ""}`}
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDark
                          ? "text-white/60 group-focus-within:text-white"
                          : "text-gray-500 group-focus-within:text-gray-700"
                      } transition-colors`}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`pl-10 pr-10 h-11 auth-input ${
                        isDark ? "dark" : ""
                      }`}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      disabled={isLoading || socialLoading !== null}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        isDark
                          ? "text-white/60 hover:text-white"
                          : "text-gray-500 hover:text-gray-700"
                      } transition-colors`}
                      disabled={isLoading || socialLoading !== null}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="form-field flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.remember}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          remember: checked as boolean,
                        })
                      }
                      className={`${
                        isDark
                          ? "data-[state=checked]:bg-white data-[state=checked]:text-black border-white/20"
                          : "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-gray-300"
                      }`}
                      disabled={isLoading || socialLoading !== null}
                    />
                    <label
                      htmlFor="remember"
                      className={`text-sm font-medium leading-none cursor-pointer auth-label ${
                        isDark ? "dark" : ""
                      }`}
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className={`text-sm font-medium auth-link ${
                      isDark ? "dark" : ""
                    }`}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  ref={submitButtonRef}
                  type="submit"
                  className={`form-field w-full h-11 text-base font-semibold auth-button-primary ${
                    isDark ? "dark" : ""
                  }`}
                  size="lg"
                  disabled={isLoading || socialLoading !== null}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                  {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-white/20">
              <div
                className={`text-sm text-center auth-link ${
                  isDark ? "dark" : ""
                }`}
              >
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className={`font-semibold underline ${
                    isDark
                      ? "text-white hover:text-white/80"
                      : "text-primary hover:text-primary/80"
                  }`}
                >
                  Create account
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}