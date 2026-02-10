import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Volunteer', path: '/volunteer/tasks' },
        { name: 'About', path: '/about' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 hover-scale">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                        <Leaf className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-bold text-gradient-green">ResQMeals</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path)
                                ? 'text-primary'
                                : 'text-muted-foreground'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Get Started Button (Desktop) */}
                <div className="hidden md:block">
                    <Button size="sm">
                        Get Started
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-foreground"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-background animate-fade-in-down">
                    <div className="container mx-auto px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block py-2 text-sm font-medium transition-colors ${isActive(link.path)
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-primary'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Button size="sm" className="w-full mt-2">
                            Get Started
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};
