import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, ArrowRight, Leaf, Users, ShieldCheck } from "lucide-react";

const brandHighlights = [
    { icon: Leaf, text: "10,000+ meals rescued monthly" },
    { icon: Users, text: "500+ partner businesses" },
    { icon: ShieldCheck, text: "Verified NGOs & volunteers" },
];

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* ── Left brand panel (hidden on mobile) ── */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 overflow-hidden p-12">
                {/* Blobs */}
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-emerald-700/20 blur-3xl animate-float pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl animate-float-slow pointer-events-none" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <span className="text-white font-black text-lg">R</span>
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">ResQMeals</span>
                </div>

                {/* Headline */}
                <div className="relative z-10">
                    <h1 className="text-white text-4xl font-extrabold leading-tight tracking-tight mb-4">
                        Rescue Food.
                        <br />
                        <span className="text-gradient-teal">Feed Communities.</span>
                    </h1>
                    <p className="text-white/60 text-base leading-relaxed mb-8 max-w-sm" style={{ margin: "0 0 32px" }}>
                        Join thousands of restaurants, NGOs and volunteers turning food waste into meals for people in need.
                    </p>

                    {/* Highlights */}
                    <div className="space-y-4">
                        {brandHighlights.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-emerald-300" />
                                </div>
                                <span className="text-white/75 text-sm font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-white/25 text-xs mt-8">
                    © 2026 ResQMeals. Fighting food waste together.
                </p>
            </div>

            {/* ── Right form panel ── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-16">
                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2.5 mb-10">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                            <span className="text-white font-black">R</span>
                        </div>
                        <span className="text-gray-900 font-bold text-lg">ResQMeals</span>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
                        Welcome back
                    </h2>
                    <p className="text-gray-400 text-sm mb-8">
                        Sign in to your ResQMeals account
                    </p>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.02]"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
                            ) : (
                                <><span>Sign In</span><ArrowRight className="w-4 h-4 ml-2" /></>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
                        <p className="text-center text-sm text-gray-400">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
