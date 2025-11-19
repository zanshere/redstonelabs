// components/dashboard-sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  FileText, 
  Clock, 
  History, 
  Settings, 
  LogOut,
  Send,
  User,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  BarChart3
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { apiService } from "@/lib/api";

interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  photo: string | null;
}

const userNavigation = [
  { name: "Dashboard", href: "/dashboard/user", icon: Home },
  { name: "Orders", href: "/dashboard/user/orders", icon: FileText },
  { name: "Progress", href: "/dashboard/user/progress", icon: Clock },
  { name: "Payments", href: "/dashboard/user/payments", icon: CreditCard },
  { name: "History", href: "/dashboard/user/history", icon: History },
  { name: "Settings", href: "/dashboard/user/settings", icon: Settings },
];

const adminNavigation = [
  { name: "Dashboard", href: "/dashboard/admin", icon: Home },
  { name: "Orders", href: "/dashboard/admin/orders", icon: FileText },
  { name: "Progress", href: "/dashboard/admin/progress", icon: Clock },
  { name: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
  { name: "Send", href: "/dashboard/admin/send", icon: Send },
  { name: "History", href: "/dashboard/admin/history", icon: History },
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export function DashboardSidebar() {
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await apiService.getUserProfile();
      // Normalize photo to `string | null` so it matches UserData.photo
      setUser({ ...response, photo: response.photo ?? null });
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.role === "ADMIN" || pathname.includes('/dashboard/admin');
  const navigation = isAdmin ? adminNavigation : userNavigation;

  const handleLogout = () => {
    apiService.clearAuthData();
    router.push('/auth/login');
  };

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={cn(
        "flex flex-col bg-background border-r transition-all duration-300 ease-in-out h-screen",
        collapsed ? "w-20" : "w-64"
      )}>
        <div className="flex items-center justify-center p-4 border-b">
          {!collapsed && (
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
          )}
        </div>
        <div className="flex-1 p-4 space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              {!collapsed && (
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col bg-background border-r transition-all duration-300 ease-in-out h-screen sticky top-0",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image
                            src="/images/RD-Dark-nobg.png"
                            alt="Ryuzen Dev Logo"
                            width={50}
                            height={50}
                            className="w-10 h-10"
                          />
            </div>
            <h1 className="text-xl font-bold transition-opacity duration-300 ease-in-out">
              {isAdmin ? "Admin" : "Dashboard"}
            </h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 transition-transform duration-300 ease-in-out hover:bg-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ease-in-out group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed ? "justify-center" : ""
              )}
            >
              <Icon className={cn(
                "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                isActive && "scale-110"
              )} />
              {!collapsed && (
                <span className="transition-opacity duration-300 ease-in-out opacity-100">
                  {item.name}
                </span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* User Section */}
      <div className="p-4 space-y-4">
        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3 transition-all duration-200 ease-in-out p-2 rounded-lg",
          collapsed ? "justify-center" : "bg-accent/50"
        )}>
          <Avatar className="h-8 w-8 flex-shrink-0 border-2 border-background">
            <AvatarImage 
              src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name || user?.username}&background=6366f1&color=fff`} 
              alt={user?.name || user?.username}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          {!collapsed && user && (
            <div className="flex-1 min-w-0 transition-opacity duration-300 ease-in-out opacity-100">
              <p className="text-sm font-medium truncate">{user.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">
                @{user.username} • {user.role === 'ADMIN' ? 'Admin' : 'User'}
              </p>
            </div>
          )}
        </div>

        {/* Theme Toggle & Logout */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-muted-foreground hover:text-foreground transition-all duration-200 ease-in-out",
              collapsed ? "justify-center" : ""
            )}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 flex-shrink-0" />
            ) : (
              <Moon className="h-4 w-4 flex-shrink-0" />
            )}
            {!collapsed && (
              <span className="ml-3 transition-opacity duration-300 ease-in-out opacity-100">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-muted-foreground hover:text-destructive transition-all duration-200 ease-in-out",
              collapsed ? "justify-center" : ""
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && (
              <span className="ml-3 transition-opacity duration-300 ease-in-out opacity-100">
                Logout
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}