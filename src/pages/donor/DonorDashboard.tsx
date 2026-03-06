import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, History, TrendingUp, Loader2, MapPin, Utensils, Leaf, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { donationsApi } from '@/lib/api';
import { socketService } from '@/lib/socket';
import { toast } from 'sonner';
import type { FoodDonation } from '@/types';

const statusStyles: Record<string, string> = {
    available: 'bg-green-100 text-green-700',
    reserved: 'bg-yellow-100 text-yellow-700',
    collected: 'bg-blue-100 text-blue-700',
    expired: 'bg-red-100 text-red-700',
};

function StatusBadge({ status }: { status: FoodDonation['status'] }) {
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[status] ?? 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
}

export default function DonorDashboard() {
    const { user } = useAuth();
    const [recentDonations, setRecentDonations] = useState<FoodDonation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ meals: 0, co2: 0, credits: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await donationsApi.getMyDonations();
                const donations = response.data.data || response.data || [];
                setRecentDonations(donations.slice(0, 5));
                const collected = donations.filter((d: FoodDonation) => d.status === 'collected');
                const totalMeals = collected.reduce((sum: number, d: FoodDonation) => sum + (parseInt(d.quantity) || 0), 0);
                setStats({ meals: totalMeals, co2: Math.round(totalMeals * 2.5), credits: collected.length * 10 });
            } catch (err) {
                console.error('Failed to fetch donations:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const onReserved = () => toast.success('🎉 Your donation was accepted by an NGO!', { duration: 5000 });
        const onCollected = () => toast.success('✅ Donation picked up successfully!', { duration: 5000 });
        socketService.on('donation:reserved', onReserved);
        socketService.on('donation:collected', onCollected);
        return () => {
            socketService.off('donation:reserved', onReserved);
            socketService.off('donation:collected', onCollected);
        };
    }, []);

    const statCards = [
        { label: "Meals Donated", value: stats.meals, unit: "", icon: Utensils, boxClass: "icon-box-emerald" },
        { label: "CO₂ Saved", value: stats.co2, unit: " kg", icon: Leaf, boxClass: "icon-box-teal" },
        { label: "Green Credits", value: stats.credits, unit: "", icon: Star, boxClass: "icon-box-orange" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            Welcome, {user?.name?.split(' ')[0] || 'Donor'}! 👋
                        </h1>
                        <p className="text-gray-400 text-sm mt-0.5">Manage your food donations and track your impact</p>
                    </div>
                    <Link to="/donor/add">
                        <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-md shadow-emerald-200 px-5">
                            <Plus className="w-4 h-4 mr-2" /> Donate Food
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
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
                                    <p className="text-2xl font-extrabold text-gray-900 tracking-tight mt-0.5">
                                        {s.value}{s.unit}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { to: "/donor/add", icon: Plus, boxClass: "icon-box-emerald", title: "Add New Donation", sub: "Post surplus food for pickup" },
                        { to: "/donor/history", icon: History, boxClass: "icon-box-orange", title: "Donation History", sub: "View all past donations" },
                    ].map((a) => {
                        const Icon = a.icon;
                        return (
                            <Link key={a.to} to={a.to}>
                                <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                                    <div className={`${a.boxClass} w-12 h-12 flex-shrink-0`}>
                                        <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 text-sm">{a.title}</h3>
                                        <p className="text-gray-400 text-xs">{a.sub}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all duration-200" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <h2 className="font-bold text-gray-900 text-sm">Recent Activity</h2>
                    </div>
                    <div className="p-4">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                            </div>
                        ) : recentDonations.length === 0 ? (
                            <div className="text-center py-10">
                                <Utensils className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">No donations yet. Start by adding your first!</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recentDonations.map((d) => (
                                    <div key={d._id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{d.title}</p>
                                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                                                <span>{d.quantity} {d.unit}</span>
                                                {d.location?.address && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />{d.location.address}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <StatusBadge status={d.status} />
                                    </div>
                                ))}
                                <Link to="/donor/history" className="block pt-2">
                                    <Button variant="ghost" size="sm" className="w-full text-emerald-600 hover:bg-emerald-50 rounded-xl font-semibold text-xs">
                                        View All Donations
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
