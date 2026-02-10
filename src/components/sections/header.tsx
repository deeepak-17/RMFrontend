"use client";

import { useState, useEffect } from "react";
import { Image } from "@/components/ui/image";
import { ChevronDown, Globe, ArrowRight } from "lucide-react";

const navItems = [
  { name: "THE APP", dropdown: true },
  { name: "BUSINESS SOLUTIONS", dropdown: true },
  { name: "ABOUT US", dropdown: true },
  { name: "ABOUT FOOD WASTE", dropdown: true },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? "bg-[#064E3B] shadow-md py-4" : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Left: Navigation Menu */}
        <nav className="hidden xl:flex items-center gap-6">
          {navItems.map((item) => (
            <div key={item.name} className="group relative">
              <button className="flex items-center gap-1.5 text-white font-nav hover:opacity-80 transition-opacity">
                {item.name}
                {item.dropdown && <ChevronDown className="w-4 h-4" />}
              </button>
              {/* Simple visual indicator for dropdown potential */}
              <div className="absolute top-full left-0 w-full h-2 bg-transparent" />
            </div>
          ))}
        </nav>

        {/* Center: Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <a href="/" className="block relative h-16 w-16 md:h-20 md:w-20">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/50a2a612-5acf-432e-95f7-7652884b81f4-toogoodtogo-com/assets/icons/eb37301e40a80bb500e31e5a939924c582ad7744-512x512-1.png"
              alt="ResQMeals Logo"
              fill
              className="object-contain invert brightness-0"
              priority
            />
          </a>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="/admin/dashboard"
              className="text-white font-bold hover:underline mr-4"
            >
              ADMIN DEMO
            </a>
            <a
              href="#"
              className="group flex items-center gap-2 border-2 border-white text-white font-cta btn-pill hover:bg-white hover:text-[#115E59]"
            >
              DOWNLOAD THE APP
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <div className="flex flex-col items-center">
              <a
                href="#"
                className="group flex items-center gap-2 border-2 border-white text-white font-cta btn-pill hover:bg-white hover:text-[#115E59]"
              >
                BUSINESS SIGN-UP
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#"
                className="text-[10px] text-white/80 uppercase font-semibold mt-1 hover:underline tracking-widest"
              >
                MyStore login
              </a>
            </div>
          </div>

          {/* Language Selector */}
          <button className="flex items-center gap-1 text-white hover:opacity-80 transition-opacity ml-2">
            <Globe className="w-5 h-5" />
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Mobile Menu Icon (Hamburger placeholder) */}
          <button className="xl:hidden flex flex-col gap-1.5 p-2" aria-label="Menu">
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
          </button>
        </div>
      </div>


    </header>
  );
};

export default Header;