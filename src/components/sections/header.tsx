import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe, ChevronDown } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
          ? "bg-emerald-950/90 backdrop-blur-xl shadow-lg shadow-black/20 py-3"
          : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-6 max-w-[1280px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform duration-200">
            <span className="text-white font-black text-base tracking-tight">R</span>
          </div>
          <span className="text-white font-bold text-[17px] tracking-tight hidden sm:block">
            ResQMeals
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {["How it Works", "About", "Impact"].map((link) => (
            <a
              key={link}
              href="#"
              className="relative px-4 py-2 text-white/75 hover:text-white text-sm font-medium tracking-wide transition-colors duration-200 rounded-lg hover:bg-white/5 after:content-[''] after:absolute after:bottom-1 after:left-4 after:right-4 after:h-px after:bg-orange-400 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-2 text-white/80 hover:text-white text-sm font-semibold transition-colors rounded-full hover:bg-white/10"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-bold rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            to="/admin/dashboard"
            className="px-3 py-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Admin Demo
          </Link>
          {/* Language selector */}
          <button className="flex items-center gap-1 px-3 py-2 text-white/60 hover:text-white text-sm transition-colors rounded-full hover:bg-white/10">
            <Globe className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-emerald-950/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 space-y-1">
          {["How it Works", "About", "Impact"].map((link) => (
            <a
              key={link}
              href="#"
              className="block px-4 py-3 text-white/70 hover:text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
            >
              {link}
            </a>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/login"
              className="text-center px-5 py-3 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-center px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}