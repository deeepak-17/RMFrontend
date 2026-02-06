/**
 * Donor Dashboard (Stub)
 * Owner: Member 3 (Donor)
 * Branch: feature/donor
 *
 * TODO:
 * - Display donor's impact stats (meals donated, CO2 saved)
 * - Show recent donations
 * - Quick action buttons (Add Food, View History)
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, History, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function DonorDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'Donor'}!</h1>
                        <p className="text-gray-600">Manage your food donations</p>
                    </div>
                    <Link to="/donor/add">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Donate Food
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">Meals Donated</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-emerald-600">0</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">CO₂ Saved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-emerald-600">0 kg</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">Green Credits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-emerald-600">0</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/donor/add">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="p-3 bg-emerald-100 rounded-lg">
                                    <Plus className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Add New Donation</h3>
                                    <p className="text-sm text-gray-600">Post surplus food for pickup</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/donor/history">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <History className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Donation History</h3>
                                    <p className="text-sm text-gray-600">View all past donations</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Recent Activity Placeholder */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500 text-center py-8">
                            No donations yet. Start by adding your first food donation!
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
