"use client";

import { useState, useRef, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Search, MapPin, Bell, LogOut, Settings, LayoutDashboard, ChevronDown } from "lucide-react";
import Logo from "@/components/ui/Logo";

export const Navbar = () => {
  const pathname = useLocation().pathname;
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Don't show on landing page
  if (pathname === "/" || pathname === "/landing") return null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const profilePicture = (user as any)?.profilePicture;

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "donor"
        ? "/donor/dashboard"
        : user?.role === "ngo"
          ? "/ngo/dashboard"
          : "/volunteer/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-3 md:px-8">
      <div className="container mx-auto flex items-center gap-4 justify-between">
        {/* Logo */}
        <Logo size="md" showText={true} linkTo="/" textColor="text-gray-900" />

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

          {/* User avatar with dropdown */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {profilePicture ? (
                  <img
                    src={profilePicture.startsWith("http") ? profilePicture : `http://localhost:5001${profilePicture}`}
                    alt="Profile"
                    className="w-8 h-8 rounded-xl object-cover border border-gray-100"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {initials}
                  </div>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 hidden md:block transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                  style={{ animation: "fadeIn 0.15s ease-out" }}>
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full capitalize">
                      {user.role}
                    </span>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={() => { setDropdownOpen(false); navigate(dashboardPath); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-400" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => { setDropdownOpen(false); navigate("/profile"); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      Edit Profile
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-50 pt-1">
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
