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

import { Link } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function VolunteerDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'Volunteer'}!</h1>
                    <p className="text-gray-600">Your delivery tasks</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">Active Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-orange-500">0</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-emerald-600">0</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">Distance Covered</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-blue-600">0 km</p>
                        </CardContent>
                    </Card>
                </div>

                <Link to="/volunteer/tasks">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="p-3 bg-emerald-100 rounded-lg">
                                <Truck className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">My Tasks</h3>
                                <p className="text-sm text-gray-600">View and manage pickup tasks</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
