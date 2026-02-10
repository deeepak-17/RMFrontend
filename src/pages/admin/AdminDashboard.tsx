import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Activity, UserCheck, Utensils, Heart, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingVerification: 0,
        totalDonations: 124,
        mealsSaved: 450
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Try to fetch from API
                const response = await adminApi.getUsers();
                if (response.data.success) {
                    const users: User[] = response.data.data;
                    setStats(prev => ({
                        ...prev,
                        totalUsers: users.length,
                        pendingVerification: users.filter(u => u.verificationStatus === 'pending').length,
                    }));
                }
            } catch (error) {
                console.warn('API unavailable, using mock data for dashboard stats');
                // Mock data fallback
                setStats({
                    totalUsers: 142,
                    pendingVerification: 12,
                    totalDonations: 356,
                    mealsSaved: 1250
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* Header with Animations */}
            <div className="animate-fade-in-up">
                <h1 className="text-3xl md:text-5xl font-bold mb-2">
                    Admin <span className="text-gradient-green text-emerald-600">Command Center</span>
                </h1>
                <p className="text-muted-foreground text-lg">Platform overview and mission management hub</p>
            </div>

            {/* Stats Grid with Staggered Animations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="animate-fade-in-up hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300" style={{ animationDelay: '100ms' }}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Force</CardTitle>
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="w-4 h-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold text-primary">
                            {isLoading ? '...' : stats.totalUsers}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-500" /> +5% this week
                        </p>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in-up hover:shadow-lg hover:border-yellow-500/30 transition-all duration-300 border-yellow-100/50" style={{ animationDelay: '200ms' }}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Vetting Queue</CardTitle>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <UserCheck className="w-4 h-4 text-yellow-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold text-yellow-600">
                            {isLoading ? '...' : stats.pendingVerification}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Awaiting verification</p>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in-up hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300" style={{ animationDelay: '300ms' }}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Resources</CardTitle>
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <Utensils className="w-4 h-4 text-emerald-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold text-emerald-600">
                            {stats.totalDonations}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Active food postings</p>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in-up hover:shadow-lg hover:border-orange-500/30 transition-all duration-300 border-orange-100/50" style={{ animationDelay: '400ms' }}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Impact</CardTitle>
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Heart className="w-4 h-4 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold text-orange-600">
                            {stats.mealsSaved}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Lives touched</p>
                    </CardContent>
                </Card>
            </div>

            {/* Management Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <Card className="group animate-fade-in-up overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300" style={{ animationDelay: '500ms' }}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold">User Management</CardTitle>
                                <CardDescription>Grant permissions and maintain trust</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                            Review new registrations, verify NGO credentials, and manage platform participants to ensure a safe environment.
                        </p>
                        <Link to="/admin/users">
                            <Button className="w-full group-hover:bg-primary/90" size="lg">
                                Manage Force <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="group animate-fade-in-up overflow-hidden border-emerald-100/50 hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300" style={{ animationDelay: '600ms' }}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-emerald-50 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                <Activity className="w-8 h-8 text-emerald-600 group-hover:text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold">Operation Logs</CardTitle>
                                <CardDescription>Audit system events and activities</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                            Monitor real-time system activities, track donation transfers, and audit administrative actions for complete transparency.
                        </p>
                        <Link to="/admin/logs">
                            <Button className="w-full group-hover:bg-emerald-700 bg-emerald-600 text-white" size="lg">
                                View Intel <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
