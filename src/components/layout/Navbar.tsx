"use client";

import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Search, MapPin, Bell, LogOut } from "lucide-react";

export const Navbar = () => {
  const pathname = useLocation().pathname;
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuth();

  // Don't show on landing page
  if (pathname === "/" || pathname === "/landing") return null;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    if (term) {
      setSearchParams({ ...Object.fromEntries(searchParams), search: term });
    } else {
      const p = Object.fromEntries(searchParams);
      delete p.search;
      setSearchParams(p);
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-3 md:px-8">
      <div className="container mx-auto flex items-center gap-4 justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20">
            <span className="text-white font-black text-base">R</span>
          </div>
          <span className="text-gray-900 font-bold text-[17px] tracking-tight hidden sm:block">
            ResQMeals
          </span>
        </Link>

        {/* Search bar */}
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="text"
              placeholder="Search for surplus food..."
              className="w-full bg-gray-50 border border-gray-100 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
              value={searchParams.get("search") || ""}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Location chip */}
          <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-full hover:bg-emerald-100 transition-colors">
            <MapPin className="w-3.5 h-3.5" />
            <span>Coimbatore</span>
          </button>

          {/* Bell */}
          <button className="relative p-2 text-gray-500 hover:text-emerald-600 rounded-xl hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
          </button>

          {/* User avatar */}
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {initials}
              </div>
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-red-600 text-xs font-semibold rounded-xl hover:bg-red-50 transition-all"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
