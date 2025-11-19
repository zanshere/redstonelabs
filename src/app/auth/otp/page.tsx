// app/auth/otp/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ArrowRight, Shield, Clock, Smartphone, Key, RefreshCw } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/partials/Navbar";
import { useTheme } from "next-themes";
import { useSearchParams, useRouter } from "next/navigation";
import { apiService } from "@/lib/api";

interface OTPResponse {
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
}

type AuthMethod = 'authenticator' | 'backup';

export default function OTPPage() {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('authenticator');
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [backupCode, setBackupCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";
  const provider = searchParams.get("provider") || "email";

  const containerRef = useRef(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const backupCodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    
    setResendCooldown(30);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    gsap.set(
      [
        ".otp-card",
        ".otp-header",
        ".otp-field",
        ".otp-timer",
        submitButtonRef.current,
      ],
      {
        opacity: 1,
        y: 0,
      }
    );

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      ".otp-card",
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6 }
    )
      .fromTo(
        ".otp-header",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.3"
      )
      .fromTo(
        ".otp-timer",
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.2"
      )
      .fromTo(
        ".otp-field",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.2"
      )
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

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== "") && index === 5) {
      handleSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedDigits = pastedData.slice(0, 6).split("");

    if (pastedDigits.every(digit => /^\d?$/.test(digit))) {
      const newOtp = [...otp];
      pastedDigits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      setOtp(newOtp);
      
      const lastFilledIndex = pastedDigits.length - 1;
      if (lastFilledIndex < 6) {
        otpInputsRef.current[lastFilledIndex]?.focus();
      }
    }
  };

  const handleBackupCodeChange = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setBackupCode(cleaned);
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    
    let code = "";
    
    if (authMethod === 'authenticator') {
      code = otp.join("");
      if (code.length !== 6) {
        setError("Please enter the complete 6-digit code");
        return;
      }
    } else {
      code = backupCode;
      if (code.length < 8) {
        setError("Please enter a valid backup code");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      const otpResponse: OTPResponse = await apiService.verifyOTP(
        email, 
        code, 
        authMethod === 'backup' ? 'backup' : 'authenticator'
      );
      
      console.log("OTP verification successful:", otpResponse);

      localStorage.setItem("token", otpResponse.token);
      localStorage.setItem("user", JSON.stringify(otpResponse.user));

      const redirectPath =
        otpResponse.user.role === "ADMIN"
          ? "/dashboard/admin"
          : "/dashboard/user";

      gsap.to(".otp-card", {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          window.location.href = redirectPath;
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      if (authMethod === 'authenticator') {
        setOtp(["", "", "", "", "", ""]);
        otpInputsRef.current[0]?.focus();
      } else {
        setBackupCode("");
        backupCodeInputRef.current?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    setError("");

    try {
      await apiService.resendOTP(email, provider);

      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setOtp(["", "", "", "", "", ""]);
      setBackupCode("");
      
      if (authMethod === 'authenticator') {
        otpInputsRef.current[0]?.focus();
      } else {
        backupCodeInputRef.current?.focus();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodChange = (method: string) => {
    setAuthMethod(method as AuthMethod);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setBackupCode("");
    
    setTimeout(() => {
      if (method === 'authenticator') {
        otpInputsRef.current[0]?.focus();
      } else {
        backupCodeInputRef.current?.focus();
      }
    }, 100);
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
        <div
          className={`auth-pattern absolute inset-0 ${isDark ? "dark" : ""}`}
        />

        <div
          className={`auth-orb-1 top-1/4 left-1/4 ${isDark ? "dark" : ""}`}
        />
        <div
          className={`auth-orb-2 bottom-1/4 right-1/4 ${isDark ? "dark" : ""}`}
        />

        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
          <Card
            className={`otp-card auth-card w-full max-w-md ${
              isDark ? "dark" : ""
            }`}
          >
            <CardHeader className="otp-header space-y-1 text-center pb-6">
              <div className="flex justify-center mb-4">
                <div
                  className={`p-3 rounded-full ${
                    isDark
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <Shield className="w-8 h-8" />
                </div>
              </div>
              <CardTitle
                className={`auth-title text-2xl font-bold ${
                  isDark ? "dark" : ""
                }`}
              >
                Two-Factor Authentication
              </CardTitle>
              <CardDescription
                className={`auth-description text-sm ${isDark ? "dark" : ""}`}
              >
                Choose your preferred authentication method
                {email && (
                  <span
                    className={`block font-medium mt-1 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {email}
                  </span>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="otp-timer flex justify-center items-center space-x-2">
                <Clock className={`w-4 h-4 ${isDark ? "text-white/60" : "text-gray-500"}`} />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-white/60" : "text-gray-500"
                  }`}
                >
                  Code expires in: {resendCooldown}s
                </span>
              </div>

              {error && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    isDark
                      ? "bg-red-500/20 text-red-300"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {error}
                </div>
              )}

              <Tabs value={authMethod} onValueChange={handleMethodChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="authenticator" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Authenticator
                  </TabsTrigger>
                  <TabsTrigger value="backup" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Backup Code
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="authenticator" className="space-y-4 mt-4">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="otp-field space-y-4">
                      <label
                        htmlFor="otp-0"
                        className={`auth-label text-center block ${
                          isDark ? "dark" : ""
                        }`}
                      >
                        6-Digit Code from Authenticator App
                      </label>
                      <div className="flex justify-center space-x-2">
                        {otp.map((digit, index) => (
                          <Input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            ref={(el) => (otpInputsRef.current[index] = el)}
                            className={`w-12 h-12 text-center text-lg font-semibold auth-input ${
                              isDark ? "dark" : ""
                            }`}
                            disabled={isLoading}
                            autoFocus={index === 0}
                          />
                        ))}
                      </div>
                    </div>

                    <Button
                      ref={submitButtonRef}
                      type="submit"
                      className={`w-full h-11 text-base font-semibold auth-button-primary ${
                        isDark ? "dark" : ""
                      }`}
                      size="lg"
                      disabled={isLoading || otp.some(digit => digit === "")}
                    >
                      {isLoading ? "Verifying..." : "Verify & Continue"}
                      {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="backup" className="space-y-4 mt-4">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="otp-field space-y-4">
                      <label
                        htmlFor="backup-code"
                        className={`auth-label text-center block ${
                          isDark ? "dark" : ""
                        }`}
                      >
                        Enter One of Your Backup Codes
                      </label>
                      <Input
                        id="backup-code"
                        type="text"
                        value={backupCode}
                        onChange={(e) => handleBackupCodeChange(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX"
                        ref={backupCodeInputRef}
                        className={`text-center text-lg font-semibold font-mono auth-input ${
                          isDark ? "dark" : ""
                        }`}
                        disabled={isLoading}
                        autoFocus
                      />
                      <p className={`text-xs text-center ${isDark ? "text-white/60" : "text-gray-500"}`}>
                        Each backup code can only be used once
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className={`w-full h-11 text-base font-semibold auth-button-primary ${
                        isDark ? "dark" : ""
                      }`}
                      size="lg"
                      disabled={isLoading || backupCode.length < 8}
                    >
                      {isLoading ? "Verifying..." : "Verify & Continue"}
                      {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-white/20">
              <div
                className={`text-sm text-center auth-link ${
                  isDark ? "dark" : ""
                }`}
              >
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || isLoading}
                  className={`font-semibold underline inline-flex items-center gap-1 ${
                    isDark
                      ? "text-white hover:text-white/80 disabled:text-white/40"
                      : "text-primary hover:text-primary/80 disabled:text-gray-400"
                  }`}
                >
                  <RefreshCw className="h-3 w-3" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </button>
              </div>
              
              <div
                className={`text-sm text-center auth-link ${
                  isDark ? "dark" : ""
                }`}
              >
                Having trouble?{" "}
                <Link
                  href="/auth/login"
                  className={`font-semibold underline ${
                    isDark
                      ? "text-white hover:text-white/80"
                      : "text-primary hover:text-primary/80"
                  }`}
                >
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}