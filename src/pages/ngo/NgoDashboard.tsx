/**
 * NGO Dashboard (Stub)
 * Owner: Deepak (NGO)
 * Branch: feature/ngo
 *
 * TODO:
 * - Display nearby available donations
 * - Show claimed/collected stats
 * - Quick action to view available food
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, History, Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function NgoDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'Partner'}!</h1>
                        <p className="text-gray-600">Find and claim surplus food nearby</p>
                    </div>
                    <Link to="/ngo/available">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <MapPin className="w-4 h-4 mr-2" />
                            Find Food
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">Meals Collected</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-emerald-600">0</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">People Fed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-emerald-600">0</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">Active Claims</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-orange-500">0</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/ngo/available">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="p-3 bg-emerald-100 rounded-lg">
                                    <Package className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Available Donations</h3>
                                    <p className="text-sm text-gray-600">Browse food available near you</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/ngo/history">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <History className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Claim History</h3>
                                    <p className="text-sm text-gray-600">View past collections</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
