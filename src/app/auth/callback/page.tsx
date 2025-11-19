// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userString = searchParams.get("user");
    const error = searchParams.get("error");

    console.log("OAuth callback received:", { token, userString, error });

    if (error) {
      console.error("OAuth Error:", error);
      router.push(`/auth/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        console.log("OAuth Success - User:", user);

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setTimeout(() => {
          const redirectPath = user.role === "ADMIN" || user.role === "admin" 
            ? "/dashboard/admin" 
            : "/dashboard/user";

          console.log("Redirecting to:", redirectPath);
          window.location.href = redirectPath;
        }, 100);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        router.push("/auth/login?error=Authentication failed");
      }
    } else {
      console.error("Missing token or user data");
      router.push("/auth/login?error=Authentication failed");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Completing Authentication
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we secure your login...
          </p>
        </div>
      </div>
    </div>
  );
}