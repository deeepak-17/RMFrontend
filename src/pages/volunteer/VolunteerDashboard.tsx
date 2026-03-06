import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Truck, CheckCircle2, Map, Loader2, ArrowRight, Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { tasksApi } from '@/lib/api';
import type { PickupTask } from '@/types';

export default function VolunteerDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ active: 0, completed: 0, distance: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await tasksApi.getMyTasks();
                const tasks: PickupTask[] = Array.isArray(response.data) ? response.data : (response.data.data || []);
                const active = tasks.filter(t => ['assigned', 'accepted', 'picked'].includes(t.status)).length;
                const completed = tasks.filter(t => t.status === 'delivered').length;
                setStats({ active, completed, distance: completed * 5 + active * 2 });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: "Active Tasks", value: stats.active, icon: Truck, boxClass: "icon-box-orange" },
        { label: "Completed", value: stats.completed, icon: CheckCircle2, boxClass: "icon-box-emerald" },
        { label: "Est. Distance", value: `${stats.distance} km`, icon: Map, boxClass: "icon-box-blue" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Welcome, {user?.name?.split(' ')[0] || 'Volunteer'}! 🚚
                    </h1>
                    <p className="text-gray-400 text-sm mt-0.5">Your delivery tasks and impact</p>
                </div>

                {/* Stats */}
                {isLoading ? (
                    <div className="flex justify-center p-10">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {statCards.map((s) => {
                            const Icon = s.icon;
                            return (
                                <div key={s.label} className="stat-card flex items-center gap-4">
                                    <div className={`${s.boxClass} w-12 h-12 flex-shrink-0`}>
                                        <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{s.label}</p>
                                        <p className="text-2xl font-extrabold text-gray-900 tracking-tight mt-0.5">{s.value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Task CTA card */}
                <Link to="/volunteer/tasks">
                    <div className="group bg-white rounded-2xl border-2 border-dashed border-emerald-200 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer p-6 flex items-center gap-5">
                        <div className="icon-box-emerald w-14 h-14 flex-shrink-0">
                            <Package className="w-7 h-7 text-white" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">Manage Tasks</h3>
                            <p className="text-gray-400 text-sm mt-0.5">View assigned pickups, update status, and track deliveries</p>
                        </div>
                        <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                            View All <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                    </div>
                </Link>

            </div>
        </div>
    );
}
