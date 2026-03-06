import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, User, Mail, Lock, ArrowRight, Utensils, Heart, Bike, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles = [
    {
        id: "donor",
        label: "Food Donor",
        sublabel: "Restaurant / Canteen / Individual",
        icon: Utensils,
        color: "text-orange-600",
        bg: "bg-orange-50 border-orange-200",
        activeBg: "bg-orange-500",
    },
    {
        id: "ngo",
        label: "NGO / Shelter",
        sublabel: "Requires document verification",
        icon: Heart,
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-200",
        activeBg: "bg-emerald-600",
    },
    {
        id: "volunteer",
        label: "Volunteer",
        sublabel: "Help deliver food to those in need",
        icon: Bike,
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-200",
        activeBg: "bg-blue-600",
    },
];

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('donor');
    const [organizationType, setOrganizationType] = useState('');
    const [documentType, setDocumentType] = useState('registration_cert');
    const [verificationFile, setVerificationFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register(name, email, password, role, organizationType || undefined, verificationFile, documentType);
            logout();
            navigate('/login', {
                state: { message: 'Account created successfully! Please sign in with your new credentials.' }
            });
        } catch (err: any) {
            const backendError = err.response?.data;
            if (backendError?.errors && Array.isArray(backendError.errors)) {
                setError(backendError.errors[0].msg);
            } else {
                setError(backendError?.message || 'Registration failed. Please check your details.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* ── Left brand panel ── */}
            <div className="hidden lg:flex lg:w-2/5 relative flex-col justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 overflow-hidden p-12">
                <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-emerald-700/20 blur-3xl animate-float pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl animate-float-slow pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <span className="text-white font-black text-lg">R</span>
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">ResQMeals</span>
                </div>

                <div className="relative z-10">
                    <h1 className="text-white text-3xl font-extrabold tracking-tight mb-4 leading-tight">
                        Join thousands making a difference every day.
                    </h1>
                    <p className="text-white/55 text-sm leading-relaxed max-w-xs" style={{ margin: 0 }}>
                        Sign up and start rescuing surplus food from going to waste — one meal at a time.
                    </p>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="w-full lg:w-3/5 flex items-start justify-center bg-white px-6 py-14 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2.5 mb-10">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                            <span className="text-white font-black">R</span>
                        </div>
                        <span className="text-gray-900 font-bold text-lg">ResQMeals</span>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">Create account</h2>
                    <p className="text-gray-400 text-sm mb-8">Start saving food and feeding communities</p>

                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role selector */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">I am a...</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {roles.map((r) => {
                                    const Icon = r.icon;
                                    const isActive = role === r.id;
                                    return (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => setRole(r.id)}
                                            className={cn(
                                                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-center",
                                                isActive
                                                    ? `border-current ${r.color} bg-white shadow-md scale-[1.02]`
                                                    : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200 hover:bg-white"
                                            )}
                                        >
                                            <Icon className={cn("w-6 h-6", isActive ? r.color : "text-gray-400")} strokeWidth={1.5} />
                                            <span className={cn("text-xs font-bold leading-tight", isActive ? r.color : "text-gray-500")}>
                                                {r.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                {roles.find(r => r.id === role)?.sublabel}
                            </p>
                        </div>

                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full name</Label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input id="name" type="text" value={name} onChange={e => setName(e.target.value)}
                                    placeholder="Your name" className="pl-10 h-11 rounded-xl border-gray-200" required />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com" className="pl-10 h-11 rounded-xl border-gray-200" required />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••" className="pl-10 h-11 rounded-xl border-gray-200" required />
                            </div>
                            <p className="text-xs text-gray-400">
                                Min 8 characters with uppercase, number and special character.
                            </p>
                        </div>

                        {/* Donor: organization type */}
                        {role === 'donor' && (
                            <div className="space-y-1.5">
                                <Label htmlFor="organizationType" className="text-sm font-semibold text-gray-700">
                                    Organization type
                                </Label>
                                <select id="organizationType" value={organizationType}
                                    onChange={e => setOrganizationType(e.target.value)}
                                    className="w-full h-11 px-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    required>
                                    <option value="">Select type...</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="canteen">Canteen</option>
                                    <option value="event">Event Hall</option>
                                    <option value="individual">Individual</option>
                                </select>
                            </div>
                        )}

                        {/* NGO: verification docs */}
                        {role === 'ngo' && (
                            <div className="space-y-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">NGO Verification</p>
                                <div className="space-y-1.5">
                                    <Label htmlFor="documentType" className="text-sm font-semibold text-gray-700">Document type</Label>
                                    <select id="documentType" value={documentType}
                                        onChange={e => setDocumentType(e.target.value)}
                                        className="w-full h-11 px-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                                        <option value="registration_cert">Registration Certificate</option>
                                        <option value="tax_exemption">Tax Exemption Certificate</option>
                                        <option value="ngo_license">NGO License</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold text-gray-700">Upload document</Label>
                                    <label className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-dashed border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer transition-all">
                                        <Upload className="w-6 h-6 text-emerald-400" />
                                        <span className="text-sm text-gray-500">
                                            {verificationFile ? verificationFile.name : "Click to upload PDF or Image"}
                                        </span>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                                            onChange={e => setVerificationFile(e.target.files?.[0] || null)} required />
                                    </label>
                                    <p className="text-xs text-gray-400">An admin will review your document before granting access.</p>
                                </div>
                            </div>
                        )}

                        <Button type="submit" disabled={isLoading}
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.02]">
                            {isLoading
                                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</>
                                : <><span>Create Account</span><ArrowRight className="w-4 h-4 ml-2" /></>
                            }
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
