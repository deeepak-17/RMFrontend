/**
 * Donor Dashboard
 * Owner: Member 3 (Donor)
 * Branch: feature/donor
 *
 * IMPLEMENTED:
 * - Display donor's impact stats (meals donated, CO2 saved)
 * - Show recent donations with status
 * - Quick action buttons (Add Food, View History)
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, History, TrendingUp, Loader2, Clock, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { donationsApi } from '@/lib/api';
import type { FoodDonation } from '@/types';

// Status badge component
function StatusBadge({ status }: { status: FoodDonation['status'] }) {
    const styles = {
        available: 'bg-green-100 text-green-700',
        reserved: 'bg-yellow-100 text-yellow-700',
        collected: 'bg-blue-100 text-blue-700',
        expired: 'bg-red-100 text-red-700',
    };

    return (
        <span className={`px-2 py-1 text-xs rounded-full ${styles[status]}`}>
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

                // Get last 5 donations
                setRecentDonations(donations.slice(0, 5));

                // Calculate stats
                const collected = donations.filter((d: FoodDonation) => d.status === 'collected');
                const totalMeals = collected.reduce((sum: number, d: FoodDonation) => sum + (d.quantity || 0), 0);
                setStats({
                    meals: totalMeals,
                    co2: Math.round(totalMeals * 2.5), // ~2.5kg CO2 per meal saved
                    credits: collected.length * 10,
                });
            } catch (err) {
                console.error('Failed to fetch donations:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

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
                            <p className="text-3xl font-bold text-emerald-600">{stats.meals}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">CO₂ Saved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-emerald-600">{stats.co2} kg</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">Green Credits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-emerald-600">{stats.credits}</p>
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

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                            </div>
                        ) : recentDonations.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                No donations yet. Start by adding your first food donation!
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {recentDonations.map((donation) => (
                                    <div
                                        key={donation._id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{donation.title}</p>
                                            <div className="flex gap-3 text-sm text-gray-500">
                                                <span>{donation.quantity} {donation.unit}</span>
                                                {donation.location?.address && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {donation.location.address}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <StatusBadge status={donation.status} />
                                    </div>
                                ))}
                                <Link to="/donor/history" className="block">
                                    <Button variant="ghost" className="w-full">
                                        View All Donations
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
