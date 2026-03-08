import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, CheckCircle2, Map, Loader2, Sparkles, Power } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { tasksApi, volunteerApi } from '@/lib/api';
import type { PickupTask } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function VolunteerDashboard() {
    const { user, refreshUser } = useAuth();
    const [stats, setStats] = useState({
        active: 0,
        completed: 0,
        distance: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await tasksApi.getMyTasks();
                const tasks: PickupTask[] = Array.isArray(response.data) ? response.data : (response.data.data || []);

                const active = tasks.filter(t => ['assigned', 'accepted', 'picked'].includes(t.status)).length;
                const completed = tasks.filter(t => t.status === 'delivered').length;

                setStats({
                    active,
                    completed,
                    distance: completed * 5 + active * 2 // Mock calculation
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
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

                <Link to="/volunteer/tasks">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow border-emerald-100 bg-white">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="p-3 bg-emerald-100 rounded-lg">
                                <Truck className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">Manage Tasks</h3>
                                <p className="text-sm text-gray-600">View assigned pickups, update status, and track deliveries</p>
                            </div>
                            <div className="ml-auto">
                                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                    View All
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
