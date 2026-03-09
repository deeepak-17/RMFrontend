import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    MapPin, History, Package, TrendingUp, Users, Leaf, Clock,
    AlertCircle, ArrowRight, Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { donationsApi } from '@/lib/api';
import { toast } from 'sonner';
import { socketService } from '@/lib/socket';

interface DashboardDonation {
    id: string;
    title: string;
    donor: string;
    distance: string;
    expiresIn: string;
    urgent: boolean;
    status: string;
}

interface RecentActivity {
    id: string;
    title: string;
    donor: string;
    status: string;
    time: string;
}

const statusStyles: Record<string, string> = {
    collected: 'bg-green-100 text-green-700',
    reserved: 'bg-yellow-100 text-yellow-700',
    claimed: 'bg-blue-100 text-blue-700',
};

export default function NgoDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ mealsCollected: 0, peopleFed: 0, activeClaims: 0, co2Saved: 0 });
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [nearbyDonations, setNearbyDonations] = useState<DashboardDonation[]>([]);
    const [isLoadingNearby, setIsLoadingNearby] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [claimingId, setClaimingId] = useState<string | null>(null);

    const getTimeRemaining = (expiryTime: string) => {
        const now = new Date();
        const expiry = new Date(expiryTime);
        const diffMs = expiry.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        if (diffHours <= 0 && diffMins <= 0) return 'Expired';
        if (diffHours === 0) return `${diffMins}m`;
        return `${diffHours}h ${diffMins}m`;
    };

    const isUrgent = (expiryTime: string) => {
        const now = new Date();
        const expiry = new Date(expiryTime);
        return (expiry.getTime() - now.getTime()) / (1000 * 60 * 60) <= 2;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    };

    const fetchDashboardData = async (lat = 0, lng = 0) => {
        setIsLoadingNearby(true);
        console.log(`NGO Dashboard: Fetching nearby from [${lat}, ${lng}]`);
        try {
            // Fetch with a huge radius to ensure we find "that 1 item" if it exists
            const response = await donationsApi.getNearby(lat, lng, 5000);
            console.log("NGO Nearby Response:", response.data);

            const donationList = response.data?.donations || response.data?.data || (Array.isArray(response.data) ? response.data : []);

            const mappedNearby = donationList
                .filter((d: any) => d.status === 'available')
                .slice(0, 5) // Show up to 5 on dash
                .map((d: any) => {
                    // Calculate distance string safely
                    let distStr = 'Near you';
                    if (d.location?.distance !== undefined) {
                        distStr = `${d.location.distance.toFixed(1)} km`;
                    } else if (d.dist?.calculated !== undefined) {
                        distStr = `${(d.dist.calculated / 1000).toFixed(1)} km`;
                    }

                    return {
                        id: d._id,
                        title: d.title,
                        donor: d.donorId?.name || 'Unknown Donor',
                        distance: distStr,
                        expiresIn: d.expiryTime ? getTimeRemaining(d.expiryTime) : 'N/A',
                        urgent: d.expiryTime ? isUrgent(d.expiryTime) : false,
                        status: d.status
                    };
                });
            console.log("Mapped Nearby Donations:", mappedNearby);
            setNearbyDonations(mappedNearby);
        } catch (error) {
            console.error('Error fetching nearby donations:', error);
        } finally {
            setIsLoadingNearby(false);
        }
    };

    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const response = await donationsApi.getNgoHistory();
            const history = response.data || [];

            // Map history to recent activity
            const recent = history.slice(0, 5).map((h: any) => ({
                id: h._id,
                title: h.title,
                donor: h.donorId?.name || 'Unknown Donor',
                status: h.status,
                time: formatDate(h.reservedAt || h.collectedAt || h.createdAt)
            }));
            setRecentActivity(recent);

            // Derive some stats
            const collected = history.filter((h: any) => h.status === 'collected').length;
            const reserved = history.filter((h: any) => h.status === 'reserved' || h.status === 'claimed').length;
            setStats({
                mealsCollected: collected * 10, // Mock multiplier
                peopleFed: collected * 4,
                activeClaims: reserved,
                co2Saved: collected * 2
            });
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchHistory();

        const handlePosition = (pos: GeolocationPosition) => fetchDashboardData(pos.coords.latitude, pos.coords.longitude);
        const handleError = () => fetchDashboardData(0, 0);

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(handlePosition, handleError);
        } else {
            fetchDashboardData(0, 0);
        }

        // Socket listeners for real-time updates
        const onNewDonation = () => {
            console.log("Real-time: New donation available");
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(handlePosition, handleError);
            } else {
                fetchDashboardData(0, 0);
            }
        };

        const onDonationUpdated = () => fetchHistory();

        socketService.on('donation:new', onNewDonation);
        socketService.on('donation:updated', onDonationUpdated);
        socketService.on('donation:deleted', onNewDonation);

        return () => {
            socketService.off('donation:new', onNewDonation);
            socketService.off('donation:updated', onDonationUpdated);
            socketService.off('donation:deleted', onNewDonation);
        };
    }, []);

    const handleClaim = async (donationId: string) => {
        setClaimingId(donationId);
        try {
            await donationsApi.accept(donationId);
            toast.success("Donation claimed successfully!");
            // Refresh data
            fetchHistory();
            // Remove from nearby list
            setNearbyDonations(prev => prev.filter(d => d.id !== donationId));
        } catch (error: any) {
            console.error('Error claiming donation:', error);
            toast.error(error.response?.data?.message || "Failed to claim donation.");
        } finally {
            setClaimingId(null);
        }
    };

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
                            {isLoadingNearby ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                    <p className="text-xs">Finding available food...</p>
                                </div>
                            ) : nearbyDonations.length > 0 ? (
                                nearbyDonations.map((d) => (
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
                                                <span className={`flex items-center gap-1 font-semibold ${d.urgent ? 'text-orange-500' : 'text-gray-400'}`}>
                                                    <Clock className="w-3 h-3" />Expires in {d.expiresIn}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleClaim(d.id)}
                                            disabled={claimingId === d.id}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-4"
                                        >
                                            {claimingId === d.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Claim'}
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500">No donations available nearby right now.</p>
                                </div>
                            )}
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
                        {isLoadingHistory ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                            </div>
                        ) : recentActivity.length > 0 ? (
                            recentActivity.map((a) => (
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
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <History className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">No recent activity found.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
