"use client";

import React from "react";
import Link from "next/link";
import { Search, PlusSquare, History, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Discover", href: "/feed", icon: Search },
  { name: "Post Food", href: "/add", icon: PlusSquare },
  { name: "My Pickups", href: "/pickups", icon: History },
  { name: "Profile", href: "/profile", icon: User },
];

export const BottomNav = () => {
  const pathname = usePathname();

  // Don't show on landing page
  if (pathname === "/") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-6 py-3 md:hidden">
      <ul className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors duration-200",
                  isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
