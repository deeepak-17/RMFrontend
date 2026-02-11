/**
 * NGO Dashboard
 * Owner: Deepak (NGO)
 * Branch: feature/ngo
 *
 * Features:
 * - Display impact stats (meals collected, people fed, CO2 saved)
 * - Show active claims
 * - Quick actions to find food and view history
 * - Recent activity feed
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, History, Package, TrendingUp, Users, Leaf, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Mock data - will be replaced with API calls when backend is ready
const mockStats = {
    mealsCollected: 245,
    peopleFed: 612,
    activeClaims: 3,
    co2Saved: 122, // kg
};

const mockRecentActivity = [
    {
        id: '1',
        title: 'Rice and Curry - 50 servings',
        donor: 'Taj Restaurant',
        status: 'collected',
        time: '2 hours ago',
    },
    {
        id: '2',
        title: 'Bread and Pastries - 30 pieces',
        donor: 'City Bakery',
        status: 'reserved',
        time: '5 hours ago',
    },
    {
        id: '3',
        title: 'Vegetable Biryani - 40 plates',
        donor: 'Grand Canteen',
        status: 'collected',
        time: '1 day ago',
    },
];

const mockNearbyDonations = [
    {
        id: '1',
        title: 'Mixed Lunch Plates - 25 servings',
        donor: 'Corporate Office Canteen',
        distance: '1.2 km',
        expiresIn: '2 hours',
    },
    {
        id: '2',
        title: 'Fresh Sandwiches - 40 pieces',
        donor: 'Cafe Express',
        distance: '2.5 km',
        expiresIn: '3 hours',
    },
];

export default function NgoDashboard() {
    const { user } = useAuth();
    const [stats] = useState(mockStats);
    const [recentActivity] = useState(mockRecentActivity);
    const [nearbyDonations] = useState(mockNearbyDonations);

    useEffect(() => {
        // TODO: Fetch real data from API when backend is ready
        // const fetchData = async () => {
        //   setIsLoading(true);
        //   const [statsRes, activityRes, nearbyRes] = await Promise.all([
        //     api.get('/ngo/stats'),
        //     api.get('/ngo/activity'),
        //     donationsApi.getNearby(lat, lng),
        //   ]);
        //   setStats(statsRes.data);
        //   setRecentActivity(activityRes.data);
        //   setNearbyDonations(nearbyRes.data);
        //   setIsLoading(false);
        // };
        // fetchData();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'collected':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Collected</span>;
            case 'reserved':
                return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Reserved</span>;
            default:
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Welcome back, {user?.name || 'Partner'}! 👋
                        </h1>
                        <p className="text-gray-600 mt-1">Find surplus food and make an impact today</p>
                    </div>
                    <Link to="/ngo/available">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-lg">
                            <MapPin className="w-4 h-4 mr-2" />
                            Find Food Nearby
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Meals Collected</p>
                                    <p className="text-3xl font-bold text-emerald-600">{stats.mealsCollected}</p>
                                </div>
                                <div className="p-3 bg-emerald-100 rounded-full">
                                    <Package className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">People Fed</p>
                                    <p className="text-3xl font-bold text-blue-600">{stats.peopleFed}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Active Claims</p>
                                    <p className="text-3xl font-bold text-orange-500">{stats.activeClaims}</p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-full">
                                    <Clock className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">CO₂ Saved</p>
                                    <p className="text-3xl font-bold text-teal-600">{stats.co2Saved} kg</p>
                                </div>
                                <div className="p-3 bg-teal-100 rounded-full">
                                    <Leaf className="w-6 h-6 text-teal-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Nearby Donations - Alert Section */}
                    <Card className="lg:col-span-2 bg-white shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <AlertCircle className="w-5 h-5 text-orange-500" />
                                Available Nearby
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {nearbyDonations.length === 0 ? (
                                <p className="text-gray-500 text-center py-6">No donations available nearby right now.</p>
                            ) : (
                                <div className="space-y-3">
                                    {nearbyDonations.map((donation) => (
                                        <div
                                            key={donation.id}
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100"
                                        >
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{donation.title}</h4>
                                                <p className="text-sm text-gray-600">{donation.donor}</p>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {donation.distance}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-orange-600 font-medium">
                                                        <Clock className="w-3 h-3" /> Expires in {donation.expiresIn}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link to="/ngo/available">
                                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                                    Claim
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                    <Link to="/ngo/available" className="block">
                                        <Button variant="outline" className="w-full mt-2">
                                            View All Available Donations
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <Card className="bg-white shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link to="/ngo/available" className="block">
                                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer">
                                        <div className="p-2 bg-emerald-200 rounded-lg">
                                            <Package className="w-5 h-5 text-emerald-700" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-emerald-900">Find Donations</h4>
                                            <p className="text-xs text-emerald-700">Browse food available near you</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link to="/ngo/history" className="block">
                                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                                        <div className="p-2 bg-blue-200 rounded-lg">
                                            <History className="w-5 h-5 text-blue-700" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-blue-900">Collection History</h4>
                                            <p className="text-xs text-blue-700">View past collections</p>
                                        </div>
                                    </div>
                                </Link>

                                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                                    <div className="p-2 bg-purple-200 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-purple-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-purple-900">Impact Report</h4>
                                        <p className="text-xs text-purple-700">Coming soon...</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Activity */}
                <Card className="bg-white shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <History className="w-5 h-5 text-gray-500" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentActivity.length === 0 ? (
                            <p className="text-gray-500 text-center py-6">No recent activity.</p>
                        ) : (
                            <div className="space-y-3">
                                {recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                            <p className="text-sm text-gray-600">From: {activity.donor}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {getStatusBadge(activity.status)}
                                            <span className="text-xs text-gray-500">{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
