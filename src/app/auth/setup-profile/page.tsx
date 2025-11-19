"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { User, Camera, ArrowRight, X } from "lucide-react";
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
import Navbar from "@/components/partials/Navbar";
import { useTheme } from "next-themes";
import { apiService } from "@/lib/api";

export default function SetupProfilePage() {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const containerRef = useRef(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);

    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      ".setup-card",
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6 }
    )
      .fromTo(
        ".setup-header",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.3"
      )
      .fromTo(
        ".form-field",
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
  }, [mounted]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setAvatar(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please choose a username");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Prepare form data for file upload
      const formData = new FormData();
      formData.append("username", username.trim());

      if (avatar) {
        formData.append("avatar", avatar);
      }

      // Update user profile with username and optional avatar
      await apiService.updateProfile(user.id, formData);

      // Update user data in localStorage
      const updatedUser = {
        ...user,
        username: username.trim(),
        avatar: avatar ? URL.createObjectURL(avatar) : null, // atau URL dari server
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Success animation
      gsap.to(".setup-card", {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // Redirect to dashboard
          window.location.href = "/dashboard";
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to setup profile");
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
            className={`setup-card auth-card w-full max-w-md ${
              isDark ? "dark" : ""
            }`}
          >
            <CardHeader className="setup-header space-y-1 text-center pb-8">
              <CardTitle
                className={`auth-title text-4xl font-bold ${
                  isDark ? "dark" : ""
                }`}
              >
                Complete Your Profile
              </CardTitle>
              <CardDescription
                className={`auth-description text-base ${isDark ? "dark" : ""}`}
              >
                Choose a username to get started
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Upload (Optional) */}
                <div className="form-field space-y-2">
                  <label className={`auth-label ${isDark ? "dark" : ""}`}>
                    Profile Picture (Optional)
                  </label>
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed cursor-pointer ${
                          isDark
                            ? "border-white/20 hover:border-white/40"
                            : "border-gray-300 hover:border-gray-400"
                        } transition-colors`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {avatarPreview ? (
                          <>
                            <div className="relative w-24 h-24 rounded-full overflow-hidden">
                              <Image
                                src={avatarPreview}
                                alt="Profile preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeAvatar();
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <Camera
                            className={`w-8 h-8 ${
                              isDark ? "text-white/40" : "text-gray-400"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <p
                    className={`text-xs text-center mt-2 ${
                      isDark ? "text-white/60" : "text-gray-600"
                    }`}
                  >
                    Click to upload a photo. If not provided, a default avatar
                    will be used.
                  </p>
                </div>

                {/* Username Input */}
                <div className="form-field space-y-2">
                  <label
                    htmlFor="username"
                    className={`auth-label ${isDark ? "dark" : ""}`}
                  >
                    Username *
                  </label>
                  <div className="relative group">
                    <User
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDark
                          ? "text-white/60 group-focus-within:text-white"
                          : "text-gray-500 group-focus-within:text-gray-700"
                      } transition-colors`}
                    />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      className={`pl-10 h-11 auth-input ${
                        isDark ? "dark" : ""
                      }`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <p
                    className={`text-xs mt-2 ${
                      isDark ? "text-white/60" : "text-gray-600"
                    }`}
                  >
                    This will be your unique identifier on Ryuzen Dev
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  ref={submitButtonRef}
                  type="submit"
                  className={`form-field w-full h-11 text-base font-semibold auth-button-primary ${
                    isDark ? "dark" : ""
                  }`}
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Setting Up..." : "Complete Setup"}
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
                You can update this later in your profile settings
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
