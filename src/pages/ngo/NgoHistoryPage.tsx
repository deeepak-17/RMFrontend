/**
 * NGO History Page (Stub)
 * Owner: Deepak (NGO)
 * Branch: feature/ngo
 *
 * TODO:
 * - Fetch claimed/collected donations
 * - Display with status badges
 * - Allow confirming pickups
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import type { FoodDonation } from '@/types';

export default function NgoHistoryPage() {
    const [donations, _setDonations] = useState<FoodDonation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch NGO's claimed donations
        setIsLoading(false);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/ngo/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <h1 className="text-2xl font-bold mb-6">Collection History</h1>

                {isLoading ? (
                    <p className="text-center text-gray-500 py-8">Loading...</p>
                ) : donations.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-gray-500">No collections yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {donations.map((donation) => (
                            <Card key={donation._id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{donation.title}</h3>
                                            <p className="text-sm text-gray-600">
                                                {donation.quantity} {donation.unit}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${donation.status === 'collected' ? 'bg-green-100 text-green-700' :
                                            donation.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {donation.status}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
