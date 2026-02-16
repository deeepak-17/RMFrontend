import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight, Globe, ChevronDown } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? "bg-emerald-900/95 backdrop-blur-sm shadow-lg py-3" : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className="text-white font-bold text-xl hidden sm:block">ResQMeals</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
            How it Works
          </a>
          <a href="#about" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
            About
          </a>
          <a href="#impact" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
            Impact
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-white font-medium px-5 py-2 rounded-full hover:bg-white/10 transition-colors text-sm"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2 rounded-full transition-colors text-sm"
          >
            Get Started
          </Link>
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-emerald-900/95 backdrop-blur-sm border-t border-white/10">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-4" aria-label="Mobile navigation">
            <a href="#how-it-works" className="text-white/80 hover:text-white py-2">
              How it Works
            </a>
            <a href="#about" className="text-white/80 hover:text-white py-2">
              About
            </a>
            <a href="#impact" className="text-white/80 hover:text-white py-2">
              Impact
            </a>
            <hr className="border-white/10" />
            <Link to="/login" className="text-white py-2">
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-orange-500 text-white font-medium px-5 py-3 rounded-full text-center"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;