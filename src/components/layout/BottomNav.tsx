"use client";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Plus, History, MapPin, ClipboardList,
  Users, Truck, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const navByRole: Record<string, { name: string; href: string; icon: React.ElementType }[]> = {
  donor: [
    { name: "Dashboard", href: "/donor/dashboard", icon: LayoutDashboard },
    { name: "Donate", href: "/donor/add", icon: Plus },
    { name: "History", href: "/donor/history", icon: History },
  ],
  ngo: [
    { name: "Dashboard", href: "/ngo/dashboard", icon: LayoutDashboard },
    { name: "Available", href: "/ngo/available", icon: MapPin },
    { name: "History", href: "/ngo/history", icon: History },
  ],
  volunteer: [
    { name: "Dashboard", href: "/volunteer/dashboard", icon: LayoutDashboard },
    { name: "My Tasks", href: "/volunteer/tasks", icon: Truck },
  ],
  admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Logs", href: "/admin/logs", icon: ClipboardList },
    { name: "Donations", href: "/admin/donations", icon: ShieldCheck },
  ],
};

export const BottomNav = () => {
  const pathname = useLocation().pathname;
  const { user } = useAuth();

  // Don't show on landing page
  if (pathname === "/" || pathname === "/landing") return null;

  const role = user?.role ?? "donor";
  const navItems = navByRole[role] ?? navByRole.donor;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 px-2 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 12px)", paddingTop: "10px" }}
    >
      <ul className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-primary bg-primary/8"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                <span className="text-[10px] font-bold tracking-wider">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
