import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    MapPin, History, Package, TrendingUp, Users, Leaf, Clock,
    AlertCircle, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import VoiceAssistant from '@/components/VoiceAssistant';

const mockStats = { mealsCollected: 245, peopleFed: 612, activeClaims: 3, co2Saved: 122 };

const mockRecentActivity = [
    { id: '1', title: 'Rice and Curry - 50 servings', donor: 'Taj Restaurant', status: 'collected', time: '2 hours ago' },
    { id: '2', title: 'Bread and Pastries - 30 pieces', donor: 'City Bakery', status: 'reserved', time: '5 hours ago' },
    { id: '3', title: 'Vegetable Biryani - 40 plates', donor: 'Grand Canteen', status: 'collected', time: '1 day ago' },
];

const mockNearbyDonations = [
    { id: '1', title: 'Mixed Lunch Plates - 25 servings', donor: 'Corporate Office Canteen', distance: '1.2 km', expiresIn: '2 hours', urgent: true },
    { id: '2', title: 'Fresh Sandwiches - 40 pieces', donor: 'Cafe Express', distance: '2.5 km', expiresIn: '3 hours', urgent: false },
];

const statusStyles: Record<string, string> = {
    collected: 'bg-green-100 text-green-700',
    reserved: 'bg-yellow-100 text-yellow-700',
};

export default function NgoDashboard() {
    const { user } = useAuth();
    const [stats] = useState(mockStats);
    const [recentActivity] = useState(mockRecentActivity);
    const [nearbyDonations] = useState(mockNearbyDonations);

    useEffect(() => { /* TODO: real API */ }, []);

    const statCards = [
        { label: "Meals Collected", value: stats.mealsCollected, icon: Package, boxClass: "icon-box-emerald" },
        { label: "People Fed", value: stats.peopleFed, icon: Users, boxClass: "icon-box-blue" },
        { label: "Active Claims", value: stats.activeClaims, icon: Clock, boxClass: "icon-box-orange" },
        { label: "CO₂ Saved", value: `${stats.co2Saved} kg`, icon: Leaf, boxClass: "icon-box-teal" },
    ];

    const quickActions = [
        { to: "/ngo/available", icon: Package, boxClass: "icon-box-emerald", label: "Find Donations", sub: "Browse food available near you" },
        { to: "/ngo/history", icon: History, boxClass: "icon-box-blue", label: "Collection History", sub: "View past collections" },
        { to: "/ngo/history", icon: TrendingUp, boxClass: "icon-box-purple", label: "Impact Report", sub: "View your collection impact" },
    ];

    return (
        <>
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            Welcome back, {user?.name?.split(' ')[0] || 'Partner'}! 👋
                        </h1>
                        <p className="text-gray-400 text-sm mt-0.5">Find surplus food and make an impact today</p>
                    </div>
                    <Link to="/ngo/available">
                        <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-md shadow-emerald-200 px-5">
                            <MapPin className="w-4 h-4 mr-2" /> Find Food Nearby
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.label} className="stat-card flex items-center gap-3">
                                <div className={`${s.boxClass} w-11 h-11 flex-shrink-0`}>
                                    <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-tight">{s.label}</p>
                                    <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{s.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Nearby donations */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <h2 className="font-bold text-gray-900 text-sm">Available Nearby</h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {nearbyDonations.map((d) => (
                                <div
                                    key={d.id}
                                    className={`flex items-center justify-between p-4 rounded-xl border-l-4 transition-colors ${d.urgent
                                            ? 'border-orange-500 bg-orange-50/50 hover:bg-orange-50'
                                            : 'border-emerald-400 bg-green-50/30 hover:bg-green-50/50'
                                        }`}
                                >
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">{d.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{d.donor}</p>
                                        <div className="flex items-center gap-3 mt-1.5 text-xs">
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <MapPin className="w-3 h-3" />{d.distance}
                                            </span>
                                            <span className="flex items-center gap-1 text-orange-500 font-semibold">
                                                <Clock className="w-3 h-3" />Expires in {d.expiresIn}
                                            </span>
                                        </div>
                                    </div>
                                    <Link to="/ngo/available">
                                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-4">
                                            Claim
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                            <Link to="/ngo/available" className="block pt-1">
                                <Button variant="ghost" size="sm" className="w-full text-emerald-600 hover:bg-emerald-50 rounded-xl font-semibold text-xs">
                                    View All Available Donations
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50">
                            <h2 className="font-bold text-gray-900 text-sm">Quick Actions</h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {quickActions.map((a) => {
                                const Icon = a.icon;
                                return (
                                    <Link key={a.to + a.label} to={a.to}>
                                        <div className="group flex items-center gap-3 p-3.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className={`${a.boxClass} w-10 h-10 flex-shrink-0`}>
                                                <Icon className="w-4 h-4 text-white" strokeWidth={1.5} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm">{a.label}</p>
                                                <p className="text-gray-400 text-xs">{a.sub}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Recent activity */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
                        <History className="w-4 h-4 text-gray-400" />
                        <h2 className="font-bold text-gray-900 text-sm">Recent Activity</h2>
                    </div>
                    <div className="p-4 space-y-2">
                        {recentActivity.map((a) => (
                            <div key={a.id} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">From: {a.donor}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${statusStyles[a.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {a.status}
                                    </span>
                                    <span className="text-[11px] text-gray-400">{a.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
        <VoiceAssistant />
        </>
    );
}
