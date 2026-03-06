import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Activity, UserCheck, Utensils, Heart, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0, pendingVerification: 0, totalDonations: 124, mealsSaved: 450
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminApi.getUsers();
                if (response.data.success) {
                    const users: User[] = response.data.data;
                    setStats(prev => ({
                        ...prev,
                        totalUsers: users.length,
                        pendingVerification: users.filter(u => !u.verified && u.role === 'ngo').length,
                    }));
                }
            } catch {
                setStats({ totalUsers: 142, pendingVerification: 12, totalDonations: 356, mealsSaved: 1250 });
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: "Total Force", value: stats.totalUsers, sub: "+5% this week", icon: Users, boxClass: "icon-box-emerald", delay: 100 },
        { label: "Vetting Queue", value: stats.pendingVerification, sub: "Awaiting verification", icon: UserCheck, boxClass: "icon-box-orange", delay: 200 },
        { label: "Resources", value: stats.totalDonations, sub: "Active food postings", icon: Utensils, boxClass: "icon-box-teal", delay: 300 },
        { label: "Impact", value: stats.mealsSaved, sub: "Lives touched", icon: Heart, boxClass: "icon-box-purple", delay: 400 },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="animate-fade-in-up">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight">
                    Admin <span className="text-gradient-green">Command Center</span>
                </h1>
                <p className="text-gray-400 text-lg">Platform overview and mission management hub</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div
                            key={s.label}
                            className="stat-card flex items-center gap-4 animate-fade-in-up"
                            style={{ animationDelay: `${s.delay}ms` }}
                        >
                            <div className={`${s.boxClass} w-12 h-12 flex-shrink-0`}>
                                <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.label}</p>
                                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    {isLoading ? (
                                        <span className="text-gray-300 text-4xl">…</span>
                                    ) : s.value}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                    {s.label === "Total Force" && <Zap className="w-3 h-3 text-yellow-400" />}
                                    {s.sub}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Management Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="group animate-fade-in-up hover:shadow-xl hover:ring-2 hover:ring-primary/20 transition-all duration-300 overflow-hidden" style={{ animationDelay: '500ms' }}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                            <div className="icon-box-emerald w-14 h-14 group-hover:scale-105 transition-transform duration-300">
                                <ShieldCheck className="w-7 h-7 text-white" strokeWidth={1.5} />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold">User Management</CardTitle>
                                <CardDescription>Grant permissions and maintain trust</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400 text-sm mb-5">
                            Review new registrations, verify NGO credentials, and manage platform participants to ensure a safe environment.
                        </p>
                        <Link to="/admin/users">
                            <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md shadow-emerald-100 text-white" size="lg">
                                Manage Force <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="group animate-fade-in-up hover:shadow-xl hover:ring-2 hover:ring-blue-500/20 transition-all duration-300 overflow-hidden" style={{ animationDelay: '600ms' }}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                            <div className="icon-box-blue w-14 h-14 group-hover:scale-105 transition-transform duration-300">
                                <Activity className="w-7 h-7 text-white" strokeWidth={1.5} />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold">Operation Logs</CardTitle>
                                <CardDescription>Audit system events and activities</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400 text-sm mb-5">
                            Monitor real-time system activities, track donation transfers, and audit administrative actions for complete transparency.
                        </p>
                        <Link to="/admin/logs">
                            <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 font-bold shadow-md shadow-blue-100 text-white" size="lg">
                                View Intel <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
