/**
 * Volunteer Dashboard (Stub)
 * Owner: Member 4 (Volunteer)
 * Branch: feature/volunteer
 *
 * TODO:
 * - Display assigned tasks
 * - Show completed deliveries count
 * - Quick actions for task management
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, CheckCircle2, Map, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { tasksApi } from '@/lib/api';
import type { PickupTask } from '@/types';

export default function VolunteerDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        active: 0,
        completed: 0,
        distance: 0 // Placeholder as we don't track distance yet
    });
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'Volunteer'}!</h1>
                    <p className="text-gray-600">Your delivery tasks</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                ) : (
                    /* Stats Cards */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-orange-500" />
                                    Active Tasks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    Completed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                                    <Map className="w-4 h-4 text-blue-600" />
                                    Est. Distance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-gray-900">{stats.distance} km</p>
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
