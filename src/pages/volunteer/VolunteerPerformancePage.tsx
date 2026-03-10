import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Star, Award, TrendingUp, Clock, MapPin, CheckCircle2, Package, Target, AlertTriangle } from 'lucide-react';
import { tasksApi } from '@/lib/api';
import { PerformanceStats } from '@/types';

// Radial progress circle component
const ProgressRing = ({ radius, stroke, progress, color }: any) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
                <circle
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s ease-in-out' }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">{progress}%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Score</span>
            </div>
        </div>
    );
};

export default function VolunteerPerformancePage() {
    const [stats, setStats] = useState<PerformanceStats | null>(null);
    const [recentTasks, setRecentTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await tasksApi.getPerformanceStats();
                setStats(res.data.stats);
                setRecentTasks(res.data.recentTasks || []);
            } catch (error) {
                console.error("Failed to load performance stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const getBadgeColor = (badge: string) => {
        switch (badge) {
            case 'Legend': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Top Rated': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'Reliable': return 'bg-blue-100 text-blue-800 border-blue-300';
            default: return 'bg-emerald-100 text-emerald-800 border-emerald-300';
        }
    };

    const getBadgeIconColor = (badge: string) => {
        switch (badge) {
            case 'Legend': return 'text-yellow-600';
            case 'Top Rated': return 'text-purple-600';
            case 'Reliable': return 'text-blue-600';
            default: return 'text-emerald-600';
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
    }

    if (!stats) return null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-emerald-600 text-white sticky top-0 z-10 shadow-md">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
                    <Link to="/volunteer/dashboard" className="p-2 -ml-2 hover:bg-emerald-700 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-lg font-bold ml-2">My Performance</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 space-y-6 mt-4">

                {/* Top Section: Badge & Score */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-emerald-100 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 opacity-50" />
                        <CardContent className="p-6 flex items-center gap-6">
                            <ProgressRing radius={60} stroke={10} progress={stats.reliabilityScore} color="#10b981" />
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-800 mb-1">Reliability</h2>
                                <p className="text-sm text-slate-500 mb-3">Based on your completion rate without dropping tasks.</p>
                                <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold ${getBadgeColor(stats.badge)}`}>
                                    <Award className={`w-3.5 h-3.5 mr-1.5 ${getBadgeIconColor(stats.badge)}`} />
                                    {stats.badge} Tier
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-100 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-500" />
                                On-Time Pickup Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between mb-2">
                                <span className="text-4xl font-black text-slate-800">{stats.onTimeRate}%</span>
                                <span className="text-sm text-slate-500 font-medium mb-1">{stats.onTimePickups} / {stats.onTimePickups + stats.latePickups} Deliveries</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${stats.onTimeRate}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                Avg delivery time: <span className="font-bold text-slate-700">{stats.averageDeliveryTimeMin} mins</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Grid Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-emerald-100 shadow-sm bg-white">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                                <Package className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="text-2xl font-black text-slate-800">{stats.totalDeliveries}</span>
                            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Total Pickups</span>
                        </CardContent>
                    </Card>
                    <Card className="border-emerald-100 shadow-sm bg-white">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                                <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-2xl font-black text-slate-800">{stats.totalDistance} <span className="text-sm">km</span></span>
                            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Distance Covered</span>
                        </CardContent>
                    </Card>
                    <Card className="border-emerald-100 shadow-sm bg-white">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mb-2">
                                <Star className="w-5 h-5 text-yellow-600" />
                            </div>
                            <span className="text-2xl font-black text-slate-800">{stats.averageRating ? stats.averageRating.toFixed(1) : '—'}</span>
                            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Average Rating</span>
                        </CardContent>
                    </Card>
                    <Card className="border-emerald-100 shadow-sm bg-white">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                                <TrendingUp className="w-5 h-5 text-orange-600" />
                            </div>
                            <span className="text-2xl font-black text-slate-800">{stats.onTimePickups + stats.latePickups === 0 ? '0' : Math.round((stats.onTimePickups) / (stats.totalDeliveries || 1) * 10)}</span>
                            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Current Streak</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent History Timeline */}
                <h3 className="font-bold text-slate-800 text-lg mt-8 mb-4 px-1">Recent Deliveries</h3>

                {recentTasks.length === 0 ? (
                    <Card className="border-dashed border-2 bg-transparent shadow-none">
                        <CardContent className="p-8 text-center text-slate-500">
                            No recent deliveries to show.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                        {recentTasks.map((task) => (
                            <div key={task._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                {/* Timeline Icon */}
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 
                                    ${task.status === 'delivered' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {task.status === 'delivered' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                                </div>

                                {/* Timeline Content */}
                                <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] border-emerald-50 shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-slate-800 text-sm truncate pr-2">{task.donationId?.title || 'Food Donation'}</span>
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${task.status === 'delivered' ? (task.missedPickup ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700') : 'bg-red-100 text-red-700'}`}>
                                                {task.status === 'delivered' ? (task.missedPickup ? 'LATE' : 'ON-TIME') : 'DECLINED'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-500 mb-2 truncate">
                                            To: {task.ngoId?.name || 'NGO'}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-mono">
                                            {new Date(task.updatedAt).toLocaleDateString()} &bull; Tracking ID: {task._id.slice(-6)}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
