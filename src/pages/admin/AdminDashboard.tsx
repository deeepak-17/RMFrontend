/**
 * Admin Dashboard (Stub)
 * Owner: Member 5 (Admin)
 * Branch: feature/admin
 *
 * TODO:
 * - Display system stats (total users, donations, etc.)
 * - Quick links to user management and logs
 */

import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage users and monitor system activity</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-blue-600">0</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">Pending Verification</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-yellow-600">0</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">Total Donations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-emerald-600">0</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">Meals Saved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-emerald-600">0</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/admin/users">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">User Management</h3>
                                    <p className="text-sm text-gray-600">Verify and manage users</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/admin/logs">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Activity className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Activity Logs</h3>
                                    <p className="text-sm text-gray-600">View system activity</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
