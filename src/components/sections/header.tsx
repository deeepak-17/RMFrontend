import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-emerald-900/95 backdrop-blur-sm border-t border-white/10">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-4" role="navigation" aria-label="Mobile navigation">
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