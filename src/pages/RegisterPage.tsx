/**
 * Register Page (Stub)
 * Owner: Member 2 (Auth)
 * Branch: feature/auth
 *
 * TODO:
 * - Create registration form with name/email/password/role inputs
 * - Call authApi.register() on submit
 * - Redirect to role-based dashboard on success
 * - Show error messages on failure
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('donor');
    const [organizationType, setOrganizationType] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await register(name, email, password, role, organizationType || undefined);
            // Clear auto-login state to force manual login as per user request
            logout();
            navigate('/login', {
                state: { message: 'Account created successfully! Please sign in with your new credentials.' }
            });
        } catch (err: any) {
            console.error('Registration error:', err.response?.data);
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
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-emerald-600">Join ResQMeals</CardTitle>
                    <CardDescription>Create an account to start saving food</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <p className="text-[10px] text-gray-500 leading-tight">
                                Must be at least 8 characters with an uppercase letter, number, and special character.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">I am a...</Label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="donor">Food Donor (Restaurant/Canteen)</option>
                                <option value="ngo">NGO / Shelter</option>
                                <option value="volunteer">Volunteer</option>
                            </select>
                        </div>

                        {role === 'donor' && (
                            <div className="space-y-2">
                                <Label htmlFor="organizationType">Organization Type</Label>
                                <select
                                    id="organizationType"
                                    value={organizationType}
                                    onChange={(e) => setOrganizationType(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    required
                                >
                                    <option value="">Select organization type...</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="canteen">Canteen</option>
                                    <option value="event">Event Hall</option>
                                    <option value="individual">Individual</option>
                                </select>
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
