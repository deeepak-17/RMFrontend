import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, CheckCircle2, Map, Loader2, Sparkles, Power, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { tasksApi, volunteerApi, matchingApi } from '@/lib/api';
import type { PickupTask } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { socketService } from '@/lib/socket';
import { TrendingUp, Clock, Navigation, Award } from 'lucide-react';

export default function VolunteerDashboard() {
    const { user, refreshUser } = useAuth();
    const [stats, setStats] = useState({
        active: 0,
        completed: 0,
        distance: 0
    });
    const [forecast, setForecast] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const fetchDashData = async () => {
        try {
            const [tasksRes, forecastRes] = await Promise.all([
                tasksApi.getMyTasks(),
                matchingApi.getPredictions()
            ]);

            const tasks: PickupTask[] = Array.isArray(tasksRes.data) ? tasksRes.data : (tasksRes.data.data || []);
            const activeCount = tasks.filter(t => ['assigned', 'accepted', 'picked'].includes(t.status)).length;

            setStats({
                active: activeCount,
                completed: user?.totalDeliveries || 0,
                distance: user?.totalDistance || 0
            });

            setForecast(forecastRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashData();

        // Socket listener for new tasks
        const onTaskAssigned = (data: any) => {
            console.log("Real-time: New task assigned", data);
            toast.success("🚀 New task assigned! Check your tasks page.", {
                description: "A pickup is waiting for you.",
                duration: 6000,
            });
            fetchDashData();
        };

        socketService.on('task:assigned', onTaskAssigned);

        return () => {
            socketService.off('task:assigned', onTaskAssigned);
        };
    }, []);

    const handleToggleAvailability = async (checked: boolean) => {
        try {
            setIsUpdatingStatus(true);
            await volunteerApi.toggleAvailability(checked);
            await refreshUser?.();
            toast.success(`You are now ${checked ? 'Available' : 'Unavailable'} for pickups`);
        } catch (error) {
            console.error('Error updating availability:', error);
            toast.error("Failed to update status");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            Welcome, {user?.name || 'Volunteer'}!
                            {user?.verified && <Sparkles className="w-5 h-5 text-emerald-500" />}
                        </h1>
                        <p className="text-gray-600">Your delivery performance and tasks</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Card className="bg-white border-emerald-100 min-w-[200px]">
                            <CardContent className="py-3 px-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Power className={`w-4 h-4 ${user?.isAvailable ? 'text-emerald-500' : 'text-gray-400'}`} />
                                    <Label htmlFor="availability" className="text-sm font-medium cursor-pointer">
                                        {user?.isAvailable ? 'Online' : 'Offline'}
                                    </Label>
                                </div>
                                <Switch
                                    id="availability"
                                    checked={user?.isAvailable || false}
                                    onCheckedChange={handleToggleAvailability}
                                    disabled={isUpdatingStatus}
                                />
                            </CardContent>
                        </Card>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white border-emerald-100 text-emerald-700 hover:bg-emerald-50 h-9 flex items-center gap-2"
                            onClick={async () => {
                                try {
                                    setIsUpdatingStatus(true);
                                    // Use browser Geolocation
                                    if ("geolocation" in navigator) {
                                        navigator.geolocation.getCurrentPosition(async (pos) => {
                                            const { latitude, longitude } = pos.coords;
                                            await volunteerApi.updateLocation(latitude, longitude, "Current Live Location");
                                            toast.success("Location synced! Nearby pickups will be prioritized.");
                                            await refreshUser?.();
                                        }, () => {
                                            toast.error("Geolocation denied or unavailable.");
                                        });
                                    } else {
                                        // Simulator for demo purposes
                                        const lat = 12.9716 + (Math.random() - 0.5) * 0.01;
                                        const lng = 77.5946 + (Math.random() - 0.5) * 0.01;
                                        await volunteerApi.updateLocation(lat, lng, "Simulated Live Position");
                                        toast.success("Position simulated! Checking for nearby tasks.");
                                        await refreshUser?.();
                                    }
                                } catch (e) {
                                    toast.error("Failed to sync location");
                                } finally {
                                    setIsUpdatingStatus(false);
                                }
                            }}
                        >
                            <MapPin className="w-4 h-4" />
                            Sync Location
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                ) : (
                    /* Stats Cards */
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-orange-50/50 border-orange-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-orange-700 uppercase tracking-wider flex items-center gap-2">
                                    <Truck className="w-3.5 h-3.5" />
                                    Active Tasks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-emerald-50/50 border-emerald-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Completed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-blue-50/50 border-blue-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                                    <Map className="w-3.5 h-3.5" />
                                    Distance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-900">{stats.distance} km</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-purple-50/50 border-purple-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-purple-700 uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Impact Credits
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-900">{user?.sustainabilityCredits || 0}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Community Insights & Forecast (User Story 4.8) */}
                {forecast && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="md:col-span-2 bg-emerald-900 text-emerald-50 border-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <TrendingUp className="w-24 h-24" />
                            </div>
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-xs uppercase tracking-widest">
                                    <Sparkles className="w-4 h-4" />
                                    Community Forecast
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-3xl font-bold">High Demand Expected</p>
                                            <p className="text-emerald-400 text-sm mt-1">Surplus Risk: <span className="text-emerald-50 font-bold">{forecast.surplusRisk}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">+{forecast.recommendedVolunteerShiftIncrease}</p>
                                            <p className="text-emerald-400 text-[10px] uppercase font-bold">Needed Online</p>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-emerald-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-400 transition-all duration-1000"
                                            style={{ width: forecast.surplusRisk === 'High' ? '85%' : '30%' }}
                                        />
                                    </div>
                                    <p className="text-xs text-emerald-300 italic">
                                        Tip: Stay online today to maximize your impact. More donations are expected in the next 4 hours.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-none shadow-sm flex flex-col justify-center p-6 text-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Clock className="w-6 h-6 text-amber-600" />
                            </div>
                            <h4 className="font-bold text-gray-900">Peak Time Bonus</h4>
                            <p className="text-xs text-gray-500 mt-1">Impact credits are currently multiplied by 1.2x</p>
                            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                Active Now
                            </div>
                        </Card>
                    </div>
                )}

                {/* Performance Tracking Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white border-none shadow-sm overflow-hidden">
                        <CardHeader className="pb-2 border-b border-gray-50">
                            <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                Efficiency & Reliability
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Reliability Score</p>
                                    <p className="text-2xl font-black text-emerald-600">{user?.reliabilityScore ?? 100}%</p>
                                </div>
                                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100 uppercase tracking-tighter">
                                    {((user?.reliabilityScore ?? 100) >= 90) ? 'Top Rated' : 'Reliable'}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Task Completion Rate</span>
                                    <span className="font-bold text-gray-700">24 / 25</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[96%]" />
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">On-time Pickups</span>
                                    <span className="font-bold text-gray-700">92%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[92%]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-none shadow-sm overflow-hidden">
                        <CardHeader className="pb-2 border-b border-gray-50">
                            <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                Impact Analytics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                    <p className="text-[10px] font-bold text-purple-600 uppercase mb-1">CO2 Saved</p>
                                    <p className="text-xl font-bold text-purple-900">{(stats.distance * 0.2).toFixed(1)} kg</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Meals Moved</p>
                                    <p className="text-xl font-bold text-blue-900">{stats.completed * 45}</p>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-4 italic text-center">
                                Tip: Completing tasks during peak hours boosts your score!
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
                    <Link to="/volunteer/tasks">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow border-emerald-100 bg-white h-full flex flex-col justify-center">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="p-3 bg-emerald-100 rounded-lg shrink-0">
                                    <Truck className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 leading-tight">My Tasks</h3>
                                    <p className="text-xs text-gray-500 mt-1">View assigned pickups</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link to="/volunteer/map">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow border-emerald-100 bg-white h-full flex flex-col justify-center">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                                    <Map className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 leading-tight">Pickup Map</h3>
                                    <p className="text-xs text-gray-500 mt-1">Find nearby available tasks</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link to="/volunteer/tracking">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow border-emerald-100 bg-white h-full flex flex-col justify-center">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="p-3 bg-orange-100 rounded-lg shrink-0">
                                    <Navigation className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 leading-tight">Live Tracking</h3>
                                    <p className="text-xs text-gray-500 mt-1">Navigate & share location</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link to="/volunteer/performance">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow border-emerald-100 bg-white h-full flex flex-col justify-center">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="p-3 bg-purple-100 rounded-lg shrink-0">
                                    <Award className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 leading-tight">Performance</h3>
                                    <p className="text-xs text-gray-500 mt-1">View badges & stats</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
